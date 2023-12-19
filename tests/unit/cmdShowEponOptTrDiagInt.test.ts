import {cmdShowXponOptTrDiagInt} from '../../src/core/devices/bdcom/generic/cmdShowXponOptTrDiagInt'

describe('cmdShowEponOptTrDiagInt', () => {
    describe('analyzer', () => {
        it('should return an array with the correct structure', () => {
            const portNumber = '1'
            const result = cmdShowXponOptTrDiagInt(portNumber)

            const mockData = 'epon0/1:53   -24.6'
            const expectedOutput = [
                {
                    xponBoard: '0',
                    xponPort: '1',
                    xponInterface: '53',
                    rxPower: '-24.6',
                },
            ]

            expect(result.analyzer(mockData)).toEqual(expectedOutput)
        });
    });

    describe('cmdShowEponOptTrDiagInt', () => {
        it('should return the correct command string', () => {
            const portNumber = '1'
            const result = cmdShowXponOptTrDiagInt(portNumber)

            const expectedCommand = `show epon optical-transceiver-diagnosis interface epon 0/${portNumber}`

            expect(result.command()).toEqual(expectedCommand)
        })
    });
});
