import { cmdShowEponIntEponOnuCtcOpt } from '../../src/core/devices/bdcom/generic/cmdShowEponIntEponOnuCtcOpt';

describe('cmdShowEponIntEponOnuCtcOpt', () => {
  it('should return an object with the correct structure', () => {
    const boardNumber = 0;
    const portNumber = 1;
    const interfaceNumber = 53;
    const result = cmdShowEponIntEponOnuCtcOpt(boardNumber, portNumber, interfaceNumber);

    // Mock data to simulate the response from the device
    const mockData = ' operating temperature(degree): 35\n' +
        ' supply voltage(V): 3.4\n' +
        ' bias current(mA): 14.4\n' +
        ' transmitted power(DBm): 2.2\n' +
        ' received power(DBm): -17.7';

    const expectedOutput = {
      opTemperature: '35',
      opVoltage: '3.4',
      opBiasCurrent: '14.4',
      opTxPower: '2.2',
      opRxPower: '-17.7',
    };

    expect(result.analyzer(mockData)).toEqual(expectedOutput);
  });
});