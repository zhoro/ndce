import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomOnuDevice} from './interfaces/IBdcomOnuDevice';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';
import {StatOnuDevice} from '../../../../generated/prisma-client';

/***
 * This command is used to show epon onu info interface
 * @param boardNumber - default value is 0
 * @param portNumber - port number
 */
export const cmdShowXponOnuInfo = (
    boardNumber: number = 0,
    portNumber: number
): IDeviceCommand<StatOnuDevice> => {
    return {
        ...defaultCmdParams,
        command: () => {
            return `show epon onu-info int epon${boardNumber}/${portNumber}`;
        },
        analyzer: (data) => {
            let input = data
                .replace(/[\b\r\n]/g, '')
                .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
            const regex =
                /(EPON(?<board>\d{0,3})\/(?<port>\d{0,3}):(?<face>\d{0,3})(\s+)?(?<vendor>\S+)\s+(?<model>\S+)\s+(?<mac>(?:[A-Fa-f0-9]{2}[:-]){5}[A-Fa-f0-9]{2}|(?:[A-Fa-f0-9]{4}\.){2}[A-Fa-f0-9]{3,4})\s+(?<desc>\S+)\s+(?<bind>\S+)\s+(?<status>\S+)\s+(?<dereg>\S+))/gm;
            const onuDevices: any[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const onuObject: IBdcomOnuDevice = {
                    xponType: 'epon',
                    serialNumberOnu: '',
                    xponBoard: Number(match.groups.board),
                    xponPort: Number(match.groups.port),
                    xponInterface: Number(match.groups.face),
                    vendorId: match.groups.vendor,
                    modelId: match.groups.model,
                    macAddressOnu: match.groups.mac,
                    description: match.groups.desc,
                    bindType: match.groups.bind,
                    status: match.groups.status,
                    deregReason: match.groups.dereg,
                };
                onuDevices.push(onuObject);
            }
            return onuDevices;
        },
    };
};
