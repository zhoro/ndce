import {cmdShowXponInactiveOnu} from '../../src/core/devices/bdcom/generic/cmdShowXponInactiveOnu';

describe('cmdShowEponInactiveOnu', () => {
    it('should correctly analyze the data', () => {
        const mockData =
            'EPON0/5:19       a034.6181.93a8 lost             2023-04-10 15:40:24 2023-04-10 15:51:58 power-off         217.18:17:56';
        const result = cmdShowXponInactiveOnu.analyzer(mockData);
        expect(result).toEqual([
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 5,
                xponInterface: 19,
                macAddressOnu: 'a034.6181.93a8',
                serialNumber: '',
                loid: '',
                status: 'lost',
                lastRegDate: '2023-04-10',
                lastRegTime: '15:40:24',
                lastDeregDate: '2023-04-10',
                lastDeregTime: '15:51:58',
                lastDeregReason: 'power-off',
                absentDays: '217',
                absentTime: '18:17:56',
            },
        ]);
    });

    it('should correctly analyze the data BDCOM 3310C version', () => {
        const mockData =
            'EPON0/3:61 9845.62cd.9050 deregistered    2024.01.24.09:04:38 2024.01.24.10:58:38 wire-down         0.01:17:55';
        const result = cmdShowXponInactiveOnu.analyzer(mockData);
        expect(result).toEqual([
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 3,
                xponInterface: 61,
                macAddressOnu: '9845.62cd.9050',
                serialNumber: '',
                loid: '',
                status: 'deregistered',
                lastRegDate: '2024.01.24',
                lastRegTime: '09:04:38',
                lastDeregDate: '2024.01.24',
                lastDeregTime: '10:58:38',
                lastDeregReason: 'wire-down',
                absentDays: '0',
                absentTime: '01:17:55',
            },
        ]);
    });

    it('should correctly analyze the data BDCOM 3310C version', () => {
        const mockData =
            'EPON0/15:5410f7.a6c4.cfb6 lost            1972.01.06.04:58:03 1972.01.06.17:46:36 wire-down         19401.16:22:48';
        const result = cmdShowXponInactiveOnu.analyzer(mockData);
        expect(result).toEqual([
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 15,
                xponInterface: 54,
                macAddressOnu: '10f7.a6c4.cfb6',
                serialNumber: '',
                loid: '',
                status: 'lost',
                lastRegDate: '1972.01.06',
                lastRegTime: '04:58:03',
                lastDeregDate: '1972.01.06',
                lastDeregTime: '17:46:36',
                lastDeregReason: 'wire-down',
                absentDays: '19401',
                absentTime: '16:22:48',
            },
        ]);
    });

    it('should return correct command', () => {
        const result = cmdShowXponInactiveOnu.command();
        expect(result).toBe('show epon inactive-onu');
    });
});
