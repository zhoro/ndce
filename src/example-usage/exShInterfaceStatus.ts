import {PrismaClient} from '../generated/prisma-client';
import Debug from 'debug';
import {DeviceHost} from '../core/network/DeviceHost';
import {DeviceAccessType} from '../core/network/DeviceAccessType';
import {NetworkDevice} from '../core/network/NetworkDevice';
import {DeviceManagementAccess} from '../core/network/DeviceManagementAccess';
import {networkDevices} from '../core/devices';
import {getNetworkDevices} from '../core/utils/getNetworkDevices';
import {getOnuInformation} from './getOnuInformation';
import {DevicePortsType} from '../core/network/DevicePortsType';
import {IBdcomInterfaceStatus} from '../core/devices/bdcom/generic/interfaces/IBdcomInterfaceStatus';

export async function exCmdShowInterfaceStatus(
    networkDeviceId: number = 0,
    boardNumber = Infinity,
    portNumber = 0
) {
    const prisma = new PrismaClient();
    const debug = Debug('ndce:exCmdShowInterfaceStatus');
    Debug.enable(process.env.DEBUG || 'false');

    try {
        const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
        if (networkDevs.length === 0) {
            debug(
                `no network devices found with id: ${networkDeviceId}. Exiting...`
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
                    `device configuration not found for: ${networkDevice.deviceModel.vendor.name}/${networkDevice.deviceModel.name}', skipping`
                );
                return;
            }
            const boardNumber = devConf.configuration.boards[0];
            if (!devConf.configuration.boards.includes(boardNumber)) {
                debug(
                    `board number: ${boardNumber} is not configured for: '${networkDevice.deviceModel.name}', skipping`
                );
                return;
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

                //get all PON interfaces for OLT
                const interfaces = await getOnuInformation(
                    prisma,
                    networkDevice.id
                );

                await handleInterfaceStatus(
                    device,
                    devConf,
                    prisma,
                    networkDevice.id,
                    DevicePortsType.GE,
                    boardNumber,
                    devConf.configuration.portsCount.GE
                );
                await handleInterfaceStatus(
                    device,
                    devConf,
                    prisma,
                    networkDevice.id,
                    DevicePortsType.XGE,
                    boardNumber,
                    devConf.configuration.portsCount.XGE
                );
                await handleInterfaceStatus(
                    device,
                    devConf,
                    prisma,
                    networkDevice.id,
                    DevicePortsType.PON,
                    boardNumber,
                    devConf.configuration.portsCount.PON
                );

                //for every PON interface get interface status
                for (const iface of interfaces) {
                    try {
                        const interfaceStatus = await device.execute(
                            devConf.commands.cmdShowIntStatus(
                                DevicePortsType.PON,
                                iface.xponBoard,
                                iface.xponPort,
                                iface.xponInterface
                            )
                        );
                        await saveDataToDb(
                            prisma,
                            networkDevice.id,
                            interfaceStatus
                        );
                        // debug(` ${iface.xponBoard}/${iface.xponPort}:${iface.xponInterface} on ${networkDevice.description} device, interface status: ${JSON.stringify(interfaceStatus)}`);
                    } catch (e) {
                        debug(
                            `Can't get interface status for ${iface.xponBoard}/${iface.xponPort}:${iface.xponInterface} on ${networkDevice.description} device, skipping...`
                        );
                    }
                }
            } else {
                debug(
                    `Can't login into ${networkDevice.description} device, skipping...`
                );
            }
            await device.disconnect();
        });

        await Promise.all(promises);
    } catch (e) {
        console.error('exCmdShowInterfaceStatus: ' + e);
    } finally {
        await prisma.$disconnect();
    }

    async function handleInterfaceStatus(
        device: NetworkDevice,
        devConf: any,
        prisma: PrismaClient,
        networkDeviceId: number,
        portType: DevicePortsType,
        boardNumber: number,
        portCount: number,
        interfaceNumber: number = 0
    ) {
        for (let i = 1; i <= portCount; i++) {
            try {
                const command = devConf.commands.cmdShowIntStatus(
                    portType,
                    boardNumber,
                    i,
                    interfaceNumber
                );
                command.setTimeout(1000);
                const interfaceStatus = await device.execute(command);
                await saveDataToDb(prisma, networkDeviceId, interfaceStatus);
            } catch (e) {
                debug(
                    `Can't get interface status for ${boardNumber}/${i} on deviceId=${networkDeviceId}. Error ${e} skipping...`
                );
            }
        }
    }

    async function saveDataToDb(
        prisma: PrismaClient,
        networkDeviceId: number,
        interfaceStatus: IBdcomInterfaceStatus
    ) {
        await prisma.statInterfaces.create({
            data: {
                networkDevice: {
                    connect: {
                        id: networkDeviceId,
                    },
                },
                board: interfaceStatus.boardNum,
                port: interfaceStatus.portNum,
                xponInterfaceNum: interfaceStatus.xponInterfaceNum,
                ifState: interfaceStatus.ifStatus,
                ifLineProtocolState: interfaceStatus.ifLineProtocolStatus,
                bandwidth: interfaceStatus.bandwidth,
                fiveMinutesInRate: interfaceStatus.inRate5min,
                fiveMinutesOutRate: interfaceStatus.outRate5min,
                realtimeInRates: interfaceStatus.inRateCurrent,
                realtimeOutRates: interfaceStatus.outRateCurrent,
                peakInRates: interfaceStatus.inRatePeak,
                peakOutRates: interfaceStatus.outRatePeak,
                rxErrorCount: interfaceStatus.rxError,
                ifSpeedMb: +interfaceStatus.ifSpeed,
                description: interfaceStatus.description,
                hardwareType: interfaceStatus.hardwareType,
            },
        });
    }
}
