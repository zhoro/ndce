import { cmdShowEponOnuInfo } from '../../src/core/devices/bdcom/generic/cmdShowEponOnuInfo'

describe('cmdShowEponOnuInfo', () => {
    describe('analyzer', () => {
        it('should return an object with the correct structure', () => {
            const boardNumber = 0
            const portNumber = 1
            const result = cmdShowEponOnuInfo(boardNumber, portNumber)

            // Mock data to simulate the response from the device
            const mockData =
                'EPON0/1:53       FHTT     XPON       a394.6780.7317 PPPoE10-300M                    static   auto-configured  N/A'

            const expectedOutput = [
                {
                    eponBoard: 0,
                    eponPort: 1,
                    eponInterface: 53,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7317',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                },
            ]

            expect(result.analyzer(mockData)).toEqual(expectedOutput)
        });
    });

    describe('analyzer', () => {
        it('should return the correct command string', () => {
            const boardNumber = 0
            const portNumber = 1

            const result = cmdShowEponOnuInfo(boardNumber, portNumber)

            const expectedCommand = `show epon onu-info int epon${boardNumber}/${portNumber}`

            expect(result.command()).toEqual(expectedCommand)
        });
    });

    describe('analyzer multiple', () => {
        // ...existing tests...

        it('should correctly parse multiple lines of data', () => {
            const boardNumber = 0
            const portNumber = 1
            const result = cmdShowEponOnuInfo(boardNumber, portNumber)

            // Mock data to simulate the response from the device
            const mockData = `
      EPON0/1:53       FHTT     XPON       a394.6780.7317 PPPoE10-300M                    static   auto-configured  N/A
      EPON0/1:54       FHTT     XPON       a394.6780.7318 PPPoE10-300M                    static   auto-configured  N/A
    `

            const expectedOutput = [
                {
                    eponBoard: 0,
                    eponPort: 1,
                    eponInterface: 53,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7317',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                },
                {
                    eponBoard: 0,
                    eponPort: 1,
                    eponInterface: 54,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7318',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                },
            ]
            expect(result.analyzer(mockData)).toEqual(expectedOutput)
        });
    });

    describe('default boardNumber', () => {
        it('should use default boardNumber when not provided', () => {
            const portNumber = 1
            const result = cmdShowEponOnuInfo(undefined, portNumber)

            const expectedCommand = `show epon onu-info int epon0/${portNumber}`

            expect(result.command()).toEqual(expectedCommand)
        });
    });
});
