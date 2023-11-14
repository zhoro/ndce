import {cmdShowMacAddTableInt} from '../../src/core/devices/bdcom/generic/cmdShowMacAddTableInt';
import {IBdcomMacAddTable} from "../../src";

describe('cmdShowMacAddTableInt', () => {
    it('should return the correct command for pon interface with intNum', () => {
        const intType = 'epon';
        const boardNum = '0';
        const portNum = '2';
        const intNum = '59';
        const expectedCommand = `sh mac address-table interface ${intType} ${boardNum}/${portNum}:${intNum}`;
        const receivedCommand = cmdShowMacAddTableInt(intType, boardNum, portNum, intNum).command();
        expect(receivedCommand).toEqual(expectedCommand);
    });

    it('should return the correct command for non-pon interface or without intNum', () => {
        const intType = 'g';
        const boardNum = '0';
        const portNum = '6';
        const expectedCommand = `sh mac address-table interface ${intType} ${boardNum}/${portNum}`;
        const receivedCommand = cmdShowMacAddTableInt(intType, boardNum, portNum).command();
        expect(receivedCommand).toEqual(expectedCommand);
    });


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
        const receivedOutput = cmdShowMacAddTableInt('g', '0', '6').analyzer(mockData);
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
        const receivedOutput = cmdShowMacAddTableInt('epon', '0', '2', '59').analyzer(mockData);
        expect(receivedOutput).toEqual(expectedOutput);
    });
});