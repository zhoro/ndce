import {cmdShowMacAddTableDynamic} from '../../src/core/devices/bdcom/generic/cmdShowMacAddTableDynamic';
import {IBdcomMacAddTable} from "../../src";

describe('cmdShowMacAddTableDynamic', () => {
    it('should return an array with the correct structure for g interface', () => {
        const mockData: string = '889     8476.fa9c.4023    DYNAMIC    g0/6';
        const expectedOutput: IBdcomMacAddTable[] = [
            {
                vlan: '889',
                mac: '8476.fa9c.4023',
                type: 'DYNAMIC',
                fullInterface: 'g0/6',
                ethFullInt: 'g0/6',
                ethBoard: '0',
                ethPort: '6',
                ponFullInt: undefined,
                ponBoard: undefined,
                ponPort: undefined,
                ponInt: undefined
            },
        ];
        const receivedOutput = cmdShowMacAddTableDynamic.analyzer(mockData);
        expect(receivedOutput).toEqual(expectedOutput);
    });

    it('should return an array with the correct structure for epon interface', () => {
        const mockData: string = '212     f8d1.1197.1c73    DYNAMIC    epon0/2:59';
        const expectedOutput: IBdcomMacAddTable[] = [
            {
                vlan: '212',
                mac: 'f8d1.1197.1c73',
                type: 'DYNAMIC',
                fullInterface: 'epon0/2:59',
                ethFullInt: undefined,
                ethBoard: undefined,
                ethPort: undefined,
                ponFullInt: 'epon0/2:59',
                ponBoard: '0',
                ponPort: '2',
                ponInt: '59'
            },
        ];
        const receivedOutput = cmdShowMacAddTableDynamic.analyzer(mockData);
        expect(receivedOutput).toEqual(expectedOutput);
    });

    it('should return an array with the correct structure for tg interface', () => {
        const mockData: string = '111     7854.2eb0.f620    DYNAMIC    tg0/6';
        const expectedOutput: IBdcomMacAddTable[] = [
            {
                vlan: '111',
                mac: '7854.2eb0.f620',
                type: 'DYNAMIC',
                fullInterface: 'tg0/6',
                ethFullInt: 'tg0/6',
                ethBoard: '0',
                ethPort: '6',
                ponFullInt: undefined,
                ponBoard: undefined,
                ponPort: undefined,
                ponInt: undefined
            },
        ];
        const receivedOutput = cmdShowMacAddTableDynamic.analyzer(mockData);
        expect(receivedOutput).toEqual(expectedOutput);
    });
});