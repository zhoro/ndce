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
            let statData: any[] = [];
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
            debug('host: ' + JSON.stringify(host));

            await device.connect();
            if (device.isConnected) {
                await device.login();
            }
            if (device.isLogged) {
                await device.execute(devConf.commands.cmdEnable);

                //get all PON interfaces for OLT in DB
                const interfaces = await getOnuInformation(
                    prisma,
                    networkDevice.id
                );

                const portTypes = [
                    DevicePortsType.GE,
                    DevicePortsType.XGE,
                    DevicePortsType.PON,
                ];

                for (const portType of portTypes) {
                    statData.push(
                        ...(await handleInterfaceStatus(
                            device,
                            devConf,
                            networkDevice.id,
                            portType,
                            boardNumber,
                            devConf.configuration.portsCount[portType]
                        ))
                    );
                }

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
                        const el = createDataObj(
                            networkDevice.id,
                            interfaceStatus
                        );
                        if (el != null) {
                            statData.push(el);
                        }
                    } catch (e) {
                        debug(
                            `Can't get interface status for ${iface.xponBoard}/${iface.xponPort}:${iface.xponInterface} on ${networkDevice.description} device, skipping...`
                        );
                    }
                }
                const result = await prisma.statInterfaces.createMany({
                    data: statData,
                });
                debug('Saved result: ' + JSON.stringify(result));
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
        networkDeviceId: number,
        portType: DevicePortsType,
        boardNumber: number,
        portCount: number,
        interfaceNumber: number = 0
    ) {
        const arrayData: any[] = [];
        for (let i = 1; i <= portCount; i++) {
            try {
                const command = devConf.commands.cmdShowIntStatus(
                    portType,
                    boardNumber,
                    i,
                    interfaceNumber
                );
                const interfaceStatus = await device.execute(command);
                arrayData.push(createDataObj(networkDeviceId, interfaceStatus));
            } catch (e) {
                debug(
                    `Can't get interface status for ${boardNumber}/${i} on deviceId=${networkDeviceId}. Error ${e} skipping...`
                );
            }
        }
        return arrayData;
    }

    function createDataObj(
        networkDeviceId: number,
        interfaceStatus: IBdcomInterfaceStatus
    ) {
        const {
            boardNum,
            portNum,
            xponInterfaceNum,
            ifStatus,
            ifLineProtocolStatus,
            bandwidth,
            inRate5min,
            outRate5min,
            inRateCurrent,
            outRateCurrent,
            inRatePeak,
            outRatePeak,
            rxError,
            ifSpeed,
            description,
            hardwareType,
            portType,
        } = interfaceStatus;

        if (typeof boardNum === 'undefined' || typeof portNum === 'undefined') {
            return null;
        } else {
            return {
                networkDeviceId,
                board: boardNum,
                port: portNum,
                xponInterfaceNum,
                ifState: ifStatus,
                ifLineProtocolState: ifLineProtocolStatus,
                bandwidth,
                fiveMinutesInRate: inRate5min,
                fiveMinutesOutRate: outRate5min,
                realtimeInRates: inRateCurrent,
                realtimeOutRates: outRateCurrent,
                peakInRates: inRatePeak,
                peakOutRates: outRatePeak,
                rxErrorCount: rxError,
                ifSpeedMb: +ifSpeed,
                description,
                hardwareType,
                portType,
            };
        }
    }
}
