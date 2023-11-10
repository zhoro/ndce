import Debug from "debug";
import {PrismaClient} from "@prisma/client";
import {getNetworkDevices} from "./core/utils/getNetworkDevices";
import {networkDevices} from "./core/devices";
import {DeviceAccessType} from "./core/network/DeviceAccessType";
import {DeviceHost} from "./core/network/DeviceHost";
import {NetworkDevice} from "./core/network/NetworkDevice";
import {DeviceManagementAccess} from "./core/network/DeviceManagementAccess";
import {IBdcomInactiveOnu} from "./core/devices/bdcom/generic/interfaces/IBdcomInactiveOnu";

/***
 * Show epon inactive onu command for network devices
 * @param networkDeviceId optional network device id, default value is 0 for all OLT devices
 * @param boardNumber optional board number, default value is Infinity for board #0 from configuration
 */
export async function exCmdShEponInactiveOnu(networkDeviceId: number = 0, boardNumber: number = Infinity) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exShEponInactiveOnu');
    Debug.enable(process.env.DEBUG || 'false');

    try {
        const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
        if (networkDevs.length === 0) {
            debug(`no network devices found with id: ${networkDeviceId}. Exiting...`);
            return
        }
        for (const networkDevice of networkDevs) {
            if (networkDevice.deviceModel.deviceType.type !== 'olt') {
                debug('device type is not OLT, skipping');
                continue
            }

            const devConf = networkDevices[`${networkDevice.deviceModel.vendor.name}`][`${networkDevice.deviceModel.name}`];
            if (devConf === undefined) {
                debug(`device configuration not found for: ${networkDevice.deviceModel.vendor.name}/${networkDevice.deviceModel.name}', skipping`);
                continue
            }

            if (boardNumber === Infinity) {
                boardNumber = devConf.configuration.boards[0];
            }

            if (!devConf.configuration.boards.includes(boardNumber)) {
                debug(`board number: ${boardNumber} is not configured for: '${networkDevice.deviceModel.name}', skipping`);
                continue
            }

            const transport = networkDevice.accessType as DeviceAccessType;
            const host = new DeviceHost(networkDevice.accessIpAddressV4, Number(networkDevice.accessPort));
            const credentials = networkDevice.deviceCredential;
            const device = new NetworkDevice(devConf, new DeviceManagementAccess(host, credentials));

            debug('vendor: ' + JSON.stringify(networkDevice.deviceModel.vendor.name));
            debug('device model: ' + JSON.stringify(networkDevice.deviceModel.name));
            debug('networkDevice: ' + JSON.stringify(networkDevice.deviceModel.deviceType.type));
            debug('transport: ' + JSON.stringify(transport));
            debug('host: ' + JSON.stringify(host));
            debug('devConf: ' + JSON.stringify(devConf));

            await device.connect();
            if (device.isConnected) {
                await device.login();
            }
            if (device.isLogged) {
                await device.execute(devConf.commands.cmdEnable);
                const inactiveOnus: IBdcomInactiveOnu[] = await device.execute(devConf.commands.cmdShowEponInactiveOnu);
                debug('OnuOpticalSignal: ' + JSON.stringify(inactiveOnus));
                //set all previous inactive ONUs to newest = false
                await prisma.statInactiveOnu.updateMany({
                    where: {
                        networkDeviceId: networkDevice.id,
                        newest: true
                    },
                    data: {
                        newest: false
                    }
                });
                await Promise.all(inactiveOnus.map(async (inactiveOnu) => {
                    await processInactiveOnu(inactiveOnu, networkDevice.id);
                }));
            }
            await device.disconnect();
        }


    } catch (e) {
        throw new Error(`exCmdShEponInactiveOnu: ${e}`)
    } finally {
        await prisma.$disconnect();
    }

    async function processInactiveOnu(inactiveOnu: IBdcomInactiveOnu, deviceId: number) {
        try {
            await prisma.statInactiveOnu.create({
                data: {
                    eponBoard: inactiveOnu.eponBoard,
                    eponPort: inactiveOnu.eponPort,
                    eponInterface: inactiveOnu.eponInterface,
                    macAddressOnu: inactiveOnu.macAddressOnu,
                    status: inactiveOnu.status,
                    deregReason: inactiveOnu.lastDeregReason,
                    lastRegister: new Date(`${inactiveOnu.lastRegDate} ${inactiveOnu.lastRegTime}`),
                    lastDeregister: new Date(`${inactiveOnu.lastDeregDate} ${inactiveOnu.lastDeregTime}`),
                    networkDeviceId: deviceId
                }
            });
        } catch (error) {
            console.error('Error while processing inactiveOnu:', error);
        }
    }

}

