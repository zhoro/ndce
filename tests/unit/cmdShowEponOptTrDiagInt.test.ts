import { cmdShowEponOptTrDiagInt } from '../../src/core/devices/bdcom/generic/cmdShowEponOptTrDiagInt';

describe('cmdShowEponOptTrDiagInt', () => {
  it('should return an array with the correct structure', () => {
    const portNumber = '1';
    const result = cmdShowEponOptTrDiagInt(portNumber);

    const mockData = 'epon0/1:53   -24.6';
    const expectedOutput = [
      {
        eponBoard: '0',
        eponPort: '1',
        eponInterface: '53',
        rxPower: '-24.6',
      },
    ];

    expect(result.analyzer(mockData)).toEqual(expectedOutput);
  });
});