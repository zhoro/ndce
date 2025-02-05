import Debug from 'debug';
import {PrismaClient} from '../generated/prisma-client';
import {getNetworkDevices} from '../core/utils/getNetworkDevices';
import {networkDevices} from '../core/devices';
import {DeviceAccessType} from '../core/network/DeviceAccessType';
import {DeviceHost} from '../core/network/DeviceHost';
import {NetworkDevice} from '../core/network/NetworkDevice';
import {DeviceManagementAccess} from '../core/network/DeviceManagementAccess';
import {IBdcomShowVersion} from '../core/devices/bdcom/generic/interfaces/IBdcomShowVersion';

export async function exCmdShVersion(networkDeviceId: number = 0) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exCmdShVersion');
    Debug.enable(process.env.DEBUG || 'false');

    try {
        const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
        if (networkDevs.length === 0) {
            debug(
                `no network devices found with id: ${networkDeviceId}. Exiting...`
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
                    `device configuration not found for: ${networkDevice.deviceModel.vendor.name}/${networkDevice.deviceModel.name}', skipping`
                );
                continue;
            }

            const transport = networkDevice.accessType as DeviceAccessType;
            const host = new DeviceHost(
                networkDevice.accessIpAddressV4,
                Number(networkDevice.accessPort)
            );
            const credentials = networkDevice.deviceCredential;
            const device = new NetworkDevice(
                devConf,
                new DeviceManagementAccess(host, credentials)
            );

            debug(
                'vendor: ' +
                    JSON.stringify(networkDevice.deviceModel.vendor.name)
            );
            debug(
                'device model: ' +
                    JSON.stringify(networkDevice.deviceModel.name)
            );
            debug(
                'networkDevice: ' +
                    JSON.stringify(networkDevice.deviceModel.deviceType.type)
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
                const oltVersions: IBdcomShowVersion = await device.execute(
                    devConf.commands.cmdShowVersion
                );
                debug('OLT Version: ' + JSON.stringify(oltVersions));
                try {
                    await prisma.networkDeviceVersion.create({
                        data: {
                            model: oltVersions.model,
                            softwareVersion: oltVersions.softwareVersion,
                            hardwareVersion: oltVersions.hardwareVersion,
                            macAddress: oltVersions.macAddress,
                            serialNumber: oltVersions.serialNumber,
                            networkDeviceId: networkDevice.id,
                        },
                    });
                } catch (error) {
                    console.error('Error while processing OLTVersions:', error);
                }
            }
            await device.disconnect();
        }
    } catch (e) {
        throw new Error(`exCmdShVersion: ${e}`);
    } finally {
        await prisma.$disconnect();
    }
}
