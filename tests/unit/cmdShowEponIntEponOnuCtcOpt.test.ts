import {cmdShowXponIntXponOnuOpt} from '../../src/core/devices/bdcom/generic/cmdShowXponIntXponOnuOpt'

describe('cmdShowEponIntEponOnuCtcOpt', () => {
    describe('analyzer', () => {
        it('should return an object with the correct structure', () => {
            const boardNumber = 0;
            const portNumber = 1;
            const interfaceNumber = 53;
            const result = cmdShowXponIntXponOnuOpt(
                boardNumber,
                portNumber,
                interfaceNumber
            )

            // Mock data to simulate the response from the device
            const mockData =
                ' operating temperature(degree): 3\n' +
                ' supply voltage(V): 3.4\n' +
                ' bias current(mA): 14.4\n' +
                ' transmitted power(DBm): 2.2\n' +
                ' received power(DBm): -17.7';

            const expectedOutput = {
                opTemperature: '3',
                opVoltage: '3.4',
                opBiasCurrent: '14.4',
                opTxPower: '2.2',
                opRxPower: '-17.7',
            };

            expect(result.analyzer(mockData)).toEqual(expectedOutput)
        });
    });

    describe('command', () => {
        it('should return the correct command string', () => {
            const boardNumber = 0
            const portNumber = 1
            const interfaceNumber = 53

            const result = cmdShowXponIntXponOnuOpt(
                boardNumber,
                portNumber,
                interfaceNumber
            )

            const expectedCommand = `show epon int epon${boardNumber}/${portNumber}:${interfaceNumber} onu ctc optical-transceiver-diagnosis`
            expect(result.command()).toEqual(expectedCommand)
        });
    });

    describe('boardNumber not provided', () => {
        it('should use default boardNumber when not provided', () => {
            const portNumber = 1;
            const interfaceNumber = 53;
            const result = cmdShowXponIntXponOnuOpt(
                undefined,
                portNumber,
                interfaceNumber
            )

            const expectedCommand = `show epon int epon0/${portNumber}:${interfaceNumber} onu ctc optical-transceiver-diagnosis`

            expect(result.command()).toEqual(expectedCommand)
        });
    });

    describe('empty object', () => {
        describe('analyzer', () => {
            it('should return an object with empty properties when data is empty', () => {
                const boardNumber = 0;
                const portNumber = 1;
                const interfaceNumber = 53;
                const result = cmdShowXponIntXponOnuOpt(
                    boardNumber,
                    portNumber,
                    interfaceNumber
                );

                // Mock data to simulate an empty response from the device
                const mockData = ''

                const expectedOutput = {
                    opTemperature: '',
                    opVoltage: '',
                    opBiasCurrent: '',
                    opTxPower: '',
                    opRxPower: '',
                }

                expect(result.analyzer(mockData)).toEqual(expectedOutput)
            });
        });
    });
})
