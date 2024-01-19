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

    it('should return correct command', () => {
        const result = cmdShowXponInactiveOnu.command();
        expect(result).toBe('show epon inactive-onu');
    });
});
