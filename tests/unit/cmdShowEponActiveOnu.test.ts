import { cmdShowXponActiveOnu } from '../../src/core/devices/bdcom/generic/cmdShowXponActiveOnu';
import { IBdcomActiveOnu } from '../../src';
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

    it('should return correct command', () => {
        const result = cmdShowXponActiveOnu.command();
        expect(result).toBe('show epon active-onu');
    });
});
