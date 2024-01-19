import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomInactiveOnu} from '../generic/interfaces/IBdcomInactiveOnu';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdShowXponInactiveOnu: IDeviceCommand<IBdcomInactiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return 'show gpon inactive-onu';
    },
    analyzer: (data) => {
        let input = data
            .replace(/[\b\r\n]/g, '')
            .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
        const regex =
            /GPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/gm;
        const deregisteredONUs: any[] = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            const [
                wholeMatch,
                xponBoard,
                xponPort,
                xponInterface,
                serialNumber,
                loid,
                status,
                lastDeregDate,
                lastDeregTime,
                lastDeregReason,
            ] = match;
            const onuObject: IBdcomInactiveOnu = {
                xponType: 'gpon',
                xponBoard: +xponBoard,
                xponPort: +xponPort,
                xponInterface: +xponInterface,
                macAddressOnu: '',
                serialNumber,
                loid,
                status,
                lastRegDate: '',
                lastRegTime: '',
                lastDeregDate,
                lastDeregTime,
                lastDeregReason,
                absentDays: '',
                absentTime: '',
            };
            deregisteredONUs.push(onuObject);
        }
        return deregisteredONUs;
    },
};
