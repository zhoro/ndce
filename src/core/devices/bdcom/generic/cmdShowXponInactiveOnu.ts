import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomInactiveOnu} from './interfaces/IBdcomInactiveOnu';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdShowXponInactiveOnu: IDeviceCommand<IBdcomInactiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return 'show epon inactive-onu';
    },
    analyzer: (data) => {
        let input = data
            .replace(/[\b\r\n]/g, '')
            .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
        const regex =
            /(EPON(?<board>\d)\/(?<port>\d):(?<iface>\d{0,3})\s+(?<mac>\S+)\s+(?<dreason>\S+)\s+(?<datereg>\S+)(\s|\.)(?<treg>\S+)\s(?<ddereg>\S+)(\s|\.)(?<tdereg>\S+)\s(?<deregreason>\S+)\s+(?<adays>\d+)(\s+)?(\.)(?<atime>\d{2}:\d{2}:\d{2}))/gm;
        const deregisteredONUs: any[] = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            const onuObject: IBdcomInactiveOnu = {
                xponType: 'epon',
                xponBoard: Number(match.groups.board),
                xponPort: Number(match.groups.port),
                xponInterface: Number(match.groups.iface),
                loid: '',
                serialNumber: '',
                macAddressOnu: match.groups.mac,
                status: match.groups.dreason,
                lastRegDate: match.groups.datereg,
                lastRegTime: match.groups.treg,
                lastDeregDate: match.groups.ddereg,
                lastDeregTime: match.groups.tdereg,
                lastDeregReason: match.groups.deregreason,
                absentDays: match.groups.adays,
                absentTime: match.groups.atime,
            };
            deregisteredONUs.push(onuObject);
        }
        return deregisteredONUs;
    },
};
