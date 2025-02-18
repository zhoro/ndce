import {cmdShowXponActiveOnu} from '../../src/core/devices/bdcom/generic/cmdShowXponActiveOnu';
import {IBdcomActiveOnu} from '../../src';
import {cmdShowXponInactiveOnu} from '../../src/core/devices/bdcom/generic/cmdShowXponInactiveOnu';

describe('cmdShowXponActiveOnu', () => {
    it('should parse the command output correctly', () => {
        const data = `
            EPON0/2:40 a094.6a89.97d0 auto-configured  ctc-oam-oper 376         232    2024-08-31 02:57:27 2024-08-31 02:21:43 power-off         79 .11:25:25
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 2,
                xponInterface: 40,
                macAddressOnu: 'a094.6a89.97d0',
                serialNumber: '',
                status: 'auto-configured',
                lastRegDate: '2024-08-31',
                lastRegTime: '02:57:27',
                lastDeregDate: '2024-08-31',
                lastDeregTime: '02:21:43',
                lastDeregReason: 'power-off',
                aliveDays: '79',
                aliveTime: '11:25:25',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });
    it('should parse the command output correctly', () => {
        const data = `
            EPON0/5:2  80f7.a69b.9a25 auto-configured ctc-oam-oper 2299        1418    1970.09.05.05:01:45 1971.09.05.05:01:45 wire-down         3.06:19:13       
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 5,
                xponInterface: 2,
                macAddressOnu: '80f7.a69b.9a25',
                serialNumber: '',
                status: 'auto-configured',
                lastRegDate: '1970.09.05',
                lastRegTime: '05:01:45',
                lastDeregDate: '1971.09.05',
                lastDeregTime: '05:01:45',
                lastDeregReason: 'wire-down',
                aliveDays: '3',
                aliveTime: '06:19:13',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });
    it('should parse the command output correctly', () => {
        const data = `
            EPON0/10:64      a094.6a10.db9f auto-configured  ctc-oam-oper 4856        2995    2025-01-02 16:05:54 N/A                 unknow            2  .04:44:21
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 10,
                xponInterface: 64,
                macAddressOnu: 'a094.6a10.db9f',
                serialNumber: '',
                status: 'auto-configured',
                lastRegDate: '2025-01-02',
                lastRegTime: '16:05:54',
                lastDeregDate: 'N/A',
                lastDeregTime: '',
                lastDeregReason: 'unknow',
                aliveDays: '2',
                aliveTime: '04:44:21',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });
    it('should parse the command output correctly', () => {
        const data = `
            EPON0/10:57      a094.6a10.73f7 auto-configured  ctc-oam-oper 4144        2556    2025-01-04 20:29:18 2025-01-04 13:45:33 power-off         0  .00:20:58
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 10,
                xponInterface: 57,
                macAddressOnu: 'a094.6a10.73f7',
                serialNumber: '',
                status: 'auto-configured',
                lastRegDate: '2025-01-04',
                lastRegTime: '20:29:18',
                lastDeregDate: '2025-01-04',
                lastDeregTime: '13:45:33',
                lastDeregReason: 'power-off',
                aliveDays: '0',
                aliveTime: '00:20:58',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });

    it('should return correct command', () => {
        const result = cmdShowXponActiveOnu.command();
        expect(result).toBe('show epon active-onu');
    });
    it('should parse the command output correctly', () => {
        const data = `
            EPON0/12:13a0e8.e6d3.fa37 auto-configured ctc-oam-oper 1478        912     1971.12.03.16:21:58 1971.12.03.16:21:17 power-off         19435.16:51:03
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'epon',
                xponBoard: 0,
                xponPort: 12,
                xponInterface: 13,
                macAddressOnu: 'a0e8.e6d3.fa37',
                serialNumber: '',
                status: 'auto-configured',
                lastRegDate: '1971.12.03',
                lastRegTime: '16:21:58',
                lastDeregDate: '1971.12.03',
                lastDeregTime: '16:21:17',
                lastDeregReason: 'power-off',
                aliveDays: '19435',
                aliveTime: '16:51:03',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });
});
