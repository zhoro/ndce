import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomActiveOnu} from './interfaces/IBdcomActiveOnu';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdShowXponActiveOnu: IDeviceCommand<IBdcomActiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return 'show epon active-onu';
    },
    analyzer: (data) => {
        let input = data
            .replace(/[\b\r\n]/g, '')
            .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
        const regex =
            /(EPON(?<board>\d{0,3})\/(?<port>\d{0,3}):(?<iface>\d{0,3})(\s+)?(?<mac>(?:[A-Fa-f0-9]{2}[:-]){5}[A-Fa-f0-9]{2}|(?:[A-Fa-f0-9]{4}\.){2}[A-Fa-f0-9]{3,4})\s+(?<status>\S+)\s+(?<oamstatus>\S+)\s+(?<distance>\d+)\s+(?<rtt>\d+)\s+(?<datereg>\S+)(\.|\s)(?<treg>\d{2}\:\d{2}\:\d{2})\s+(?<datedereg>\S+|)(\.|\s)(?<tdereg>\d{2}\:\d{2}\:\d{2}|)\s+(?<deregreason>\S+)\s+(?<alivedays>\d+)(\s+\.|\.)(?<alivetime>\d{2}\:\d{2}\:\d{2}))/gm;
        const registeredONUs: any[] = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            const onuObject: IBdcomActiveOnu = {
                xponType: 'epon',
                xponBoard: Number(match.groups.board),
                xponPort: Number(match.groups.port),
                xponInterface: Number(match.groups.iface),
                macAddressOnu: match.groups.mac,
                serialNumber: '',
                status: match.groups.status,
                lastRegDate: match.groups.datereg,
                lastRegTime: match.groups.treg,
                lastDeregDate: match.groups.datedereg,
                lastDeregTime: match.groups.tdereg,
                lastDeregReason: match.groups.deregreason,
                aliveDays: match.groups.alivedays,
                aliveTime: match.groups.alivetime,
            };
            registeredONUs.push(onuObject);
        }
        return registeredONUs;
    },
};
