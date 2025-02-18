import {cmdShowXponOnuInfo} from '../../src/core/devices/bdcom/generic/cmdShowXponOnuInfo';

describe('cmdShowEponOnuInfo', () => {
    describe('analyzer', () => {
        it('should return an object with the correct structure', () => {
            const boardNumber = 0;
            const portNumber = 1;
            const result = cmdShowXponOnuInfo(boardNumber, portNumber);

            // Mock data to simulate the response from the device
            const mockData =
                'EPON0/1:53       FHTT     XPON       a394.6780.7317 PPPoE10-300M                    static   auto-configured  N/A';

            const expectedOutput = [
                {
                    xponBoard: 0,
                    xponPort: 1,
                    xponInterface: 53,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7317',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                    serialNumberOnu: '',
                    xponType: 'epon',
                },
            ];

            expect(result.analyzer(mockData)).toEqual(expectedOutput);
        });

        it('should return an object with the correct structure', () => {
            const boardNumber = 0;
            const portNumber = 10;
            const result = cmdShowXponOnuInfo(boardNumber, portNumber);

            // Mock data to simulate the response from the device
            const mockData =
                'EPON0/10:10PICO      E910       10a5.6add.665f N/A                             static    auto-configured N/A';

            const expectedOutput = [
                {
                    xponBoard: 0,
                    xponPort: 10,
                    xponInterface: 10,
                    vendorId: 'PICO',
                    modelId: 'E910',
                    macAddressOnu: '10a5.6add.665f',
                    description: 'N/A',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                    serialNumberOnu: '',
                    xponType: 'epon',
                },
            ];

            expect(result.analyzer(mockData)).toEqual(expectedOutput);
        });
    });

    describe('analyzer', () => {
        it('should return the correct command string', () => {
            const boardNumber = 0;
            const portNumber = 1;

            const result = cmdShowXponOnuInfo(boardNumber, portNumber);

            const expectedCommand = `show epon onu-info int epon${boardNumber}/${portNumber}`;

            expect(result.command()).toEqual(expectedCommand);
        });
    });

    describe('analyzer multiple', () => {
        // ...existing tests...

        it('should correctly parse multiple lines of data', () => {
            const boardNumber = 0;
            const portNumber = 1;
            const result = cmdShowXponOnuInfo(boardNumber, portNumber);

            // Mock data to simulate the response from the device
            const mockData = `
      EPON0/1:53       FHTT     XPON       a394.6780.7317 PPPoE10-300M                    static   auto-configured  N/A
      EPON0/1:56 FGEP      1001       8007.1b76.cb30 Olimp-1754                static    auto-configured N/A
      EPON0/1:54       FHTT     XPON       a394.6780.7318 PPPoE10-300M                    static   auto-configured  N/A
    `;

            const expectedOutput = [
                {
                    xponBoard: 0,
                    xponPort: 1,
                    xponInterface: 53,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7317',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                    serialNumberOnu: '',
                    xponType: 'epon',
                },
                {
                    xponBoard: 0,
                    xponPort: 1,
                    xponInterface: 56,
                    vendorId: 'FGEP',
                    modelId: '1001',
                    macAddressOnu: '8007.1b76.cb30',
                    description: 'Olimp-1754',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                    serialNumberOnu: '',
                    xponType: 'epon',
                },
                {
                    xponBoard: 0,
                    xponPort: 1,
                    xponInterface: 54,
                    vendorId: 'FHTT',
                    modelId: 'XPON',
                    macAddressOnu: 'a394.6780.7318',
                    description: 'PPPoE10-300M',
                    bindType: 'static',
                    status: 'auto-configured',
                    deregReason: 'N/A',
                    serialNumberOnu: '',
                    xponType: 'epon',
                },
            ];
            expect(result.analyzer(mockData)).toEqual(expectedOutput);
        });
    });

    describe('default boardNumber', () => {
        it('should use default boardNumber when not provided', () => {
            const portNumber = 1;
            const result = cmdShowXponOnuInfo(undefined, portNumber);

            const expectedCommand = `show epon onu-info int epon0/${portNumber}`;

            expect(result.command()).toEqual(expectedCommand);
        });
    });
});
