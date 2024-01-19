import {cmdEnable} from '../../src/core/devices/bdcom/generic/cmdEnable';

describe('cmdEnable', () => {
    describe('command', () => {
        it('should return "enable"', () => {
            expect(cmdEnable.command()).toBe('enable');
        });
    });

    describe('analyzer', () => {
        it('should return true', () => {
            expect(cmdEnable.analyzer('')).toBe(true);
        });
    });
});
