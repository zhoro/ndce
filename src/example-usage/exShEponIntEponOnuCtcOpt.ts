import Debug from "debug";
import {PrismaClient} from "../generated/prisma-client";
import {getNetworkDevices} from "../core/utils/getNetworkDevices";
import {networkDevices} from "../core/devices";
import {DeviceAccessType} from "../core/network/DeviceAccessType";
import {NetworkDevice} from "../core/network/NetworkDevice";
import {DeviceManagementAccess} from "../core/network/DeviceManagementAccess";
import {DeviceHost} from "../core/network/DeviceHost";

/***
 * Show epon interface epon onu ctc optical command for network devices
 * @param networkDeviceId  network device id
 * @param boardNumber  board number, default value is Infinity for board #0 from configuration
 * @param portNumber  port number
 * @param interfaceNumber ONT interface number
 */
export async function exCmdShowEponIntEponOnuCtcOpt(networkDeviceId: number, boardNumber: number = Infinity, portNumber: number, interfaceNumber: number) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exShEponIntEponOnuCtcOpt');
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
                const onuInfo = await device.execute(devConf.commands.cmdShowEponIntEponOnuCtcOpt(boardNumber, portNumber, interfaceNumber));
                debug('OnuOpticalSignal: ' + JSON.stringify(onuInfo));
                if (onuInfo.opTxPower !== '' && onuInfo.opRxPower !== '') {
                    await prisma.statOnuOpticalSignal.create({
                        data: {
                            networkDevice: {
                                connect: {
                                    id: networkDevice.id
                                }
                            },
                            eponBoard: boardNumber,
                            eponPort: portNumber,
                            eponInterface: interfaceNumber,
                            txPower: +onuInfo.opTxPower,
                            rxPower: +onuInfo.opRxPower
                        }
                    });
                } else {
                    debug(`onuInfo.opTxPower and/or onuInfo.opRxPower is empty, skipping...`);
                }
            }
            await device.disconnect();
        }
    } catch (e) {
        throw new Error(`exCmdShowEponIntEponOnuCtcOpt: ${e}`);
    } finally {
        await prisma.$disconnect();
    }
}