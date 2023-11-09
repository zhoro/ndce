import {PrismaClient, StatOnuDevice} from "@prisma/client";
import Debug from "debug";
import {DeviceHost} from "./core/network/DeviceHost";
import {DeviceAccessType} from "./core/network/DeviceAccessType";
import {NetworkDevice} from "./core/network/NetworkDevice";
import {DeviceManagementAccess} from "./core/network/DeviceManagementAccess";
import {networkDevices} from "./core/devices";
import {getNetworkDevices} from "./core/utils/getNetworkDevices";

/***
 * Show epon onu info interface command for network devices
 * @param networkDeviceId optional network device id, default value is 0 for all devices
 * @param boardNumber optional board number, default value is Infinity for board #0 from configuration
 * @param portNumber optional port number, default value is 0 for all ports on board
 */
export async function exCmdShowEponOnuInfoInterface(networkDeviceId: number = 0, boardNumber = Infinity, portNumber = 0) {

    const prisma = new PrismaClient();
    const debug = Debug('ndce:exShEponOnuInfoInterface');
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
                for (let port = 1; port <= devConf.configuration.portsCount.PON; port++) {
                    if (portNumber > 0 && portNumber !== port) continue
                    const epoOnuInfo: StatOnuDevice[] = await device.execute(devConf.commands.cmdShowEponOnuInfo(boardNumber, port));
                    for (const onu of epoOnuInfo) {
                        try {
                            const data: StatOnuDevice = {...onu};
                            data.networkDeviceId = networkDevice.id;
                            await prisma.statOnuDevice.create({
                                data: data,
                            });
                        } catch (e) {
                            console.error('exShEponOnuInfoInterface: ' + e);
                        }
                    }

                }
            }
            await device.disconnect();
        }
    } catch (e) {
        console.error('exShEponOnuInfoInterface: ' + e);
    } finally {
        await prisma.$disconnect();
    }
}

