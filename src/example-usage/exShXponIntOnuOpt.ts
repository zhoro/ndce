import Debug from 'debug';
import {PrismaClient} from '../generated/prisma-client';
import {getNetworkDevices} from '../core/utils/getNetworkDevices';
import {networkDevices} from '../core/devices';
import {DeviceAccessType} from '../core/network/DeviceAccessType';
import {NetworkDevice} from '../core/network/NetworkDevice';
import {DeviceManagementAccess} from '../core/network/DeviceManagementAccess';
import {DeviceHost} from '../core/network/DeviceHost';

//ONU statuses that are not considered as online
const offLineStatuses = [
    'offline',
    'off-line',
    'deregistered',
    'lost',
    'config-failed',
];

export async function exCmdShowXponIntOnuOpt(networkDeviceId: number = 0) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exCmdShowXponIntOnuOpt');
    Debug.enable(process.env.DEBUG || 'false');
    try {
        const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
        if (networkDevs.length === 0) {
            debug(
                `no network devices found with id: ${networkDeviceId}. Exiting...`,
            );
            return;
        }
        const promises = networkDevs.map(async (networkDevice) => {
            if (networkDevice.deviceModel.deviceType.type !== 'olt') {
                debug('device type is not OLT, skipping');
                return;
            }
            const devConf =
                networkDevices[`${networkDevice.deviceModel.vendor.name}`][
                    `${networkDevice.deviceModel.name}`
                    ];
            if (devConf === undefined) {
                debug(
                    `device configuration not found for: ${networkDevice.deviceModel.vendor.name}/${networkDevice.deviceModel.name}', skipping`,
                );
                return;
            }
            const boardNumber = devConf.configuration.boards[0];
            if (!devConf.configuration.boards.includes(boardNumber)) {
                debug(
                    `board number: ${boardNumber} is not configured for: '${networkDevice.deviceModel.name}', skipping`,
                );
                return;
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
                //get all interfaces for OLT
                const interfaces = await getOnuInformation(
                    prisma,
                    networkDevice.id,
                );
                const opticalSignals: any[] = [];

                for (const intf of interfaces) {
                    if (offLineStatuses.includes(intf.status)) continue;
                    try {
                        const onuInfo = await device.execute(
                            devConf.commands.cmdShowXponIntOnuCtcOpt(
                                intf.xponBoard,
                                intf.xponPort,
                                intf.xponInterface,
                            ),
                        );
                        if (
                            onuInfo.opTxPower !== '' &&
                            onuInfo.opRxPower !== ''
                        ) {
                            opticalSignals.push({
                                networkDeviceId: networkDevice.id,
                                xponPort: intf.xponPort,
                                xponBoard: intf.xponBoard,
                                xponInterface: intf.xponInterface,
                                txPower: +onuInfo.opTxPower,
                                rxPower: +onuInfo.opRxPower,
                            });
                        } else {
                            debug(
                                `${networkDevice.description} - ${intf.xponBoard}/${intf.xponPort}:${intf.xponInterface} onuInfo.opTxPower and/or onuInfo.opRxPower is empty, skipping...`,
                            );
                        }
                    } catch (e) {
                        debug(
                            `Can't get optical signal for ${intf.xponBoard}/${intf.xponPort}:${intf.xponInterface} on ${networkDevice.description} device, skipping...`,
                        );
                    }
                }
                const savedData = await prisma.statOnuOpticalSignal.createMany({
                    data: opticalSignals,
                });
                debug(`savedData: ${JSON.stringify(savedData)}`);
            } else {
                debug(
                    `Can't login into ${networkDevice.description} device, skipping...`,
                );
            }
            await device.disconnect();
        });

        await Promise.all(promises);
    } catch (e) {
        console.error('exCmdShowXponIntOnuOpt: ' + e);
    } finally {
        await prisma.$disconnect();
    }
}

async function getOnuInformation(
    prisma: PrismaClient,
    networkDeviceId: number = 0,
    boardNumber = 0,
    portNumber = 0,
    interfaceNumber = 0,
) {
    // const prisma = new PrismaClient();
    const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
    if (!networkDevs || networkDevs.length === 0) {
        throw new Error('Device not found');
    }
    let conf_id = {};

    if (networkDeviceId > 0) {
        conf_id = {
            networkDeviceId: networkDeviceId,
        };
    }

    if (boardNumber > 0) {
        conf_id = {
            ...conf_id,
            xponBoard: boardNumber,
        };
    }

    if (portNumber > 0) {
        conf_id = {
            ...conf_id,
            xponPort: portNumber,
        };
    }
    if (interfaceNumber > 0) {
        conf_id = {
            ...conf_id,
            xponInterface: interfaceNumber,
        };
    }

    let result = await prisma.statOnuDevice.findMany({
        distinct: ['networkDeviceId', 'xponBoard', 'xponPort', 'xponInterface'],
        orderBy: [
            {createdAt: 'desc'},
            {xponBoard: 'asc'},
            {xponPort: 'asc'},
            {xponInterface: 'asc'},
            {networkDeviceId: 'asc'},
        ],
        where: {
            ...conf_id,
        },
    });
    return result;
}
