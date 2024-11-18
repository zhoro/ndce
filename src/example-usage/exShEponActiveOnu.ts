import Debug from 'debug';
import {PrismaClient} from '../generated/prisma-client';
import {getNetworkDevices} from '../core/utils/getNetworkDevices';
import {networkDevices} from '../core/devices';
import {DeviceAccessType} from '../core/network/DeviceAccessType';
import {DeviceHost} from '../core/network/DeviceHost';
import {NetworkDevice} from '../core/network/NetworkDevice';
import {DeviceManagementAccess} from '../core/network/DeviceManagementAccess';
import {IBdcomActiveOnu} from '../core/devices/bdcom/generic/interfaces';

export async function exCmdShEponActiveOnu(
    networkDeviceId: number = 0,
    boardNumber: number = Infinity,
) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exShEponActiveOnu');
    Debug.enable(process.env.DEBUG || 'false');

    try {
        const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
        if (networkDevs.length === 0) {
            debug(
                `no network devices found with id: ${networkDeviceId}. Exiting...`,
            );
            return;
        }
        for (const networkDevice of networkDevs) {
            if (networkDevice.deviceModel.deviceType.type !== 'olt') {
                debug('device type is not OLT, skipping');
                continue;
            }

            const devConf =
                networkDevices[`${networkDevice.deviceModel.vendor.name}`][
                    `${networkDevice.deviceModel.name}`
                    ];
            if (devConf === undefined) {
                debug(
                    `device configuration not found for: ${networkDevice.deviceModel.vendor.name}/${networkDevice.deviceModel.name}', skipping`,
                );
                continue;
            }

            if (boardNumber === Infinity) {
                boardNumber = devConf.configuration.boards[0];
            }

            if (!devConf.configuration.boards.includes(boardNumber)) {
                debug(
                    `board number: ${boardNumber} is not configured for: '${networkDevice.deviceModel.name}', skipping`,
                );
                continue;
            }

            const transport = networkDevice.accessType as DeviceAccessType;
            const host = new DeviceHost(
                networkDevice.accessIpAddressV4,
                Number(networkDevice.accessPort),
            );
            const credentials = networkDevice.deviceCredential;
            const device = new NetworkDevice(
                devConf,
                new DeviceManagementAccess(host, credentials),
            );

            debug(
                'vendor: ' +
                JSON.stringify(networkDevice.deviceModel.vendor.name),
            );
            debug(
                'device model: ' +
                JSON.stringify(networkDevice.deviceModel.name),
            );
            debug(
                'networkDevice: ' +
                JSON.stringify(networkDevice.deviceModel.deviceType.type),
            );
            debug('transport: ' + JSON.stringify(transport));
            debug('host: ' + JSON.stringify(host));
            debug('devConf: ' + JSON.stringify(devConf));

            await device.connect();
            if (device.isConnected) {
                await device.login();
            }
            if (device.isLogged) {
                await device.execute(devConf.commands.cmdEnable);
                const activeOnus: IBdcomActiveOnu[] = await device.execute(
                    devConf.commands.cmdShowXponActiveOnu,
                );
                debug('ActiveONU: ' + JSON.stringify(activeOnus));
                //set all previous Active ONUs to newest = false
                await prisma.statActiveOnu.updateMany({
                    where: {
                        networkDeviceId: networkDevice.id,
                        newest: true,
                    },
                    data: {
                        newest: false,
                    },
                });
                await Promise.all(
                    activeOnus.map(async (activeOnu) => {
                        await processActiveOnu(activeOnu, networkDevice.id);
                    }),
                );
            }
            await device.disconnect();
        }
    } catch (e) {
        throw new Error(`exShEponActiveOnu: ${e}`);
    } finally {
        await prisma.$disconnect();
    }

    function isValidDate(date: Date): boolean {
        return !isNaN(date.getTime());
    }

    async function processActiveOnu(
        activeOnu: IBdcomActiveOnu,
        deviceId: number,
    ) {
        let lastRegister =
            activeOnu.xponType === 'epon' || activeOnu.xponType === 'gpon'
                ? new Date(
                    `${activeOnu.lastRegDate} ${activeOnu.lastRegTime}`,
                )
                : new Date(0);
        let lastDeregister = new Date(
            `${activeOnu.lastDeregDate} ${activeOnu.lastDeregTime}`,
        );
        if (!isValidDate(lastRegister)) {
            lastRegister = new Date(0);
        }
        if (!isValidDate(lastDeregister)) {
            lastDeregister = new Date(0);
        }
        // convert aliveDays to number and aliveTime to time and store them as unix timestamp
        let alivedays = parseInt(activeOnu.aliveDays, 10) * 24 * 60 * 60;
        let alivetime = activeOnu.aliveTime.split(':').reduce((acc, time) => {
            return acc * 60 + parseInt(time, 10);
        }, 0);
        try {
            await prisma.statActiveOnu.create({
                data: {
                    xponBoard: activeOnu.xponBoard,
                    xponPort: activeOnu.xponPort,
                    xponInterface: activeOnu.xponInterface,
                    macAddressOnu: activeOnu.macAddressOnu,
                    status: activeOnu.status,
                    dereason: activeOnu.lastDeregReason,
                    lastRegister: lastRegister,
                    lastDeregister: lastDeregister,
                    networkDeviceId: deviceId,
                    serialNumberOnu: activeOnu.serialNumber,
                    alivetime: alivedays + alivetime,
                },
            });
        } catch (error) {
            console.error('Error while processing inactiveOnu:', error);
        }
    }
}
