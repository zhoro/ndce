import { cmdShowEponOnuInfo } from '../../src/core/devices/bdcom/generic/cmdShowEponOnuInfo';

describe('cmdShowEponOnuInfo', () => {
  it('should return an object with the correct structure', () => {
    const boardNumber = 0;
    const portNumber = 1;
    const result = cmdShowEponOnuInfo(boardNumber, portNumber);

    // Mock data to simulate the response from the device
    const mockData = 'EPON0/1:53       FHTT     XPON       a394.6780.7317 PPPoE10-300M                    static   auto-configured  N/A';

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
    ];

    expect(result.analyzer(mockData)).toEqual(expectedOutput);
  });
});