import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';
import {DevicePortsType} from '../../../network/DevicePortsType';
import {IBdcomInterfaceStatus} from '../generic/interfaces/IBdcomInterfaceStatus';

/***
 * @description Show interface status command
 * @param portType - port type @@see DevicePortsType
 * @param boardNumber - default value is 0
 * @param portNumber - port number
 * @param interfaceNumber - interface number, default value is 0
 */
export const cmdShowIntStatus = (
    portType: DevicePortsType,
    boardNumber: number = 0,
    portNumber: number,
    interfaceNumber: number = 0,
): IDeviceCommand<IBdcomInterfaceStatus> => {
    return {
        ...defaultCmdParams,
        command: () => {
            if (portType === DevicePortsType.PON && interfaceNumber === 0) {
                return `show int gpon${boardNumber}/${portNumber} `;
            } else if (portType === DevicePortsType.PON && interfaceNumber > 0) {
                return `show int gpon${boardNumber}/${portNumber}:${interfaceNumber} `;
            } else if (portType === DevicePortsType.GE) {
                return `show int gi${boardNumber}/${portNumber}`;
            } else if (portType === DevicePortsType.XGE) {
                return `show int tg${boardNumber}/${portNumber}`;
            } else return ``;
        },
        analyzer: (data) => {
            let input = data
                .replace(/[\b\r\n]/g, '');
            const regex = /(GigaEthernet|EPON|GPON|TGigaEthernet)(?<board>\d)\/(?<port>\d):?(?<interface>\d{0,3})?.*?is (administratively )?(?<ifStatus>\w+).*?is (?<ifProtocolStatus>\w+).*?(ription: (?<desc>\w+[-_\w]{0,}\w+).*?)?(ware is (?<hardware>\w+[-_\w]{0,}).*?)?(BW (?<bandwidth>\d+) kbit*?)(.*?(?<portspeed>\d+)Mb\/s.*?)?(.*?5 minutes input rate (?<fiveMinIn>\d+).*?)?(.*?5 minutes output rate (?<fiveMinOut>\d+).*?)?(.*?Real time input rate (\d+)%, (?<realIn>\d+).*?)?(.*?Real time output rate (\d+)%, (?<realOut>\d+).*?)?(.*?peak input rate (?<peakIn>\d+) bits\/sec.*?)?(.*?peak output rate (?<peakOut>\d+) bits\/sec.*?)?(.*?(?<rxError> \d+) error)?/gm;
            const interfaceStatuses: any[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const interfaceStatus: IBdcomInterfaceStatus = {
                    bandwidth: Number(match.groups.bandwidth),
                    boardNum: Number(match.groups.board),
                    description: match.groups.desc || '',
                    hardwareType: match.groups.hardware || '',
                    ifLineProtocolStatus: match.groups.ifProtocolStatus,
                    ifSpeed: match.groups.portspeed || '',
                    ifStatus: match.groups.ifStatus,
                    inRate5min: Number(match.groups.fiveMinIn || 0),
                    inRateCurrent: Number(match.groups.realIn || 0),
                    inRatePeak: Number(match.groups.peakIn || 0),
                    outRate5min: Number(match.groups.fiveMinOut || 0),
                    outRateCurrent: Number(match.groups.realOut || 0),
                    outRatePeak: Number(match.groups.peakOut || 0),
                    portNum: Number(match.groups.port),
                    rxError: Number(match.groups.rxError || 0),
                    xponInterfaceNum: Number(match.groups.interface || 0),
                };
                return interfaceStatus;
            }
            return interfaceStatuses
        },
    };
};
