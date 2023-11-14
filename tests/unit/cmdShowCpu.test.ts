import {cmdShowCpu} from '../../src/core/devices/bdcom/generic/cmdShowCpu';
import {IBdcomCpuUtilization} from '../../src';

describe('cmdShowCpu', () => {
    describe('command', () => {
        it('should return "show cpu"', () => {
            expect(cmdShowCpu.command()).toBe('show cpu');
        });
    });

    describe('analyzer', () => {
        it('should parse valid CPU utilization data and return the expected object', () => {
            const data = 'CPU utilization for one second: 14%; one minute: 12%; five minutes: 12% CPU MAX utilization: 92%(2023-10-5 17:21:8)';
            const expected: IBdcomCpuUtilization = {
                oneSecond: "14%",
                oneMinute: "12%",
                fiveMinutes: "12%",
                max: "92%"
            };
            expect(cmdShowCpu.analyzer(data)).toEqual(expected);
        });

        it('should throw an error when provided with invalid CPU utilization data', () => {
            const data = 'invalid data';
            expect(() => cmdShowCpu.analyzer(data)).toThrow('Invalid cpu information received');
        });
    });
});