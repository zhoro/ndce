import { cmdShowXponActiveOnu } from '../../src/core/devices/bdcom/generic-gpon/cmdShowXponActiveOnu';
import { IBdcomActiveOnu } from '../../src';

describe('cmdShowXponActiveOnu', () => {
    it('should parse the command output correctly', () => {
        const data = `
            GPON0/2:125    FHTT:6A1184B7    N/A                      2024-11-03 21:24:58 0014d:12:45:40  962.5
        `;
        const expectedOutput: IBdcomActiveOnu[] = [
            {
                xponType: 'gpon',
                xponBoard: 0,
                xponPort: 2,
                xponInterface: 125,
                macAddressOnu: '',
                serialNumber: 'FHTT:6A1184B7',
                status: '',
                lastRegDate: '2024-11-03',
                lastRegTime: '21:24:58',
                lastDeregDate: '',
                lastDeregTime: '',
                lastDeregReason: '',
                aliveDays: '0014',
                aliveTime: '12:45:40',
            },
        ];

        const result = cmdShowXponActiveOnu.analyzer(data);
        expect(result).toEqual(expectedOutput);
    });

    it('should return correct command', () => {
        const result = cmdShowXponActiveOnu.command();
        expect(result).toBe('show gpon active-onu');
    });
});
