import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomActiveOnu} from '../generic/interfaces/IBdcomActiveOnu';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdShowXponActiveOnu: IDeviceCommand<IBdcomActiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return 'show gpon active-onu';
    },
    analyzer: (data) => {
        let input = data
            .replace(/[\b\r\n]/g, '')
            .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
        const regex =
            /(GPON(?<board>\d{0,3})\/(?<port>\d{0,3}):(?<iface>\d{0,3})\s+(?<serial>\S+)\s+(?<loid>\S+)\s+(?<datereg>\S+)(\.|\s)(?<treg>\d{2}\:\d{2}\:\d{2})\s+(?<alivedays>\d+)(d:)(?<alivetime>\d{2}\:\d{2}\:\d{2}))/gm;
        const registeredONUs: any[] = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            const onuObject: IBdcomActiveOnu = {
                xponType: 'gpon',
                xponBoard: Number(match.groups.board),
                xponPort: Number(match.groups.port),
                xponInterface: Number(match.groups.iface),
                macAddressOnu: '',
                serialNumber: match.groups.serial,
                status: '',
                lastRegDate: match.groups.datereg,
                lastRegTime: match.groups.treg,
                lastDeregDate: '',
                lastDeregTime: '',
                lastDeregReason: '',
                aliveDays: match.groups.alivedays,
                aliveTime: match.groups.alivetime,
            };
            registeredONUs.push(onuObject);
        }
        return registeredONUs;
    },
};
