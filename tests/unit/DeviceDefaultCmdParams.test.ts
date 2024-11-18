// src/core/network/__tests__/DeviceDefaultCmdParams.test.ts
import { defaultCmdParams } from '../../src';

describe('defaultCmdParams', () => {
    it('should have default sendTimeout value', () => {
        expect(defaultCmdParams.cmdParams.sendTimeout).toBe(2000);
    });

    it('should set sendTimeout value', () => {
        defaultCmdParams.setTimeout(5000);
        expect(defaultCmdParams.cmdParams.sendTimeout).toBe(5000);
    });
});
