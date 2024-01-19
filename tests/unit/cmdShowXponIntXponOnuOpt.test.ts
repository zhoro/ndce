import {cmdShowXponIntXponOnuOpt} from '../../src/core/devices/bdcom/generic-gpon/cmdShowXponIntXponOnuOpt';
import {IDeviceCommand} from '../../src/core/network/interfaces/IDeviceCommand';
import {expect} from 'chai';
import {IBdcomOnuInterfaceXponOpticalDetails} from '../../src';

describe('cmdShowXponIntXponOnuOpt', () => {
    it('should return correct command with default board number', () => {
        const result: IDeviceCommand<IBdcomOnuInterfaceXponOpticalDetails> =
            cmdShowXponIntXponOnuOpt(undefined, 1, 1);
        expect(result.command()).to.equal(
            'show gpon int gpon0/1:1 onu optical-transceiver-diagnosis'
        );
    });

    it('should return correct command with provided board number', () => {
        const result: IDeviceCommand<IBdcomOnuInterfaceXponOpticalDetails> =
            cmdShowXponIntXponOnuOpt(2, 1, 1);
        expect(result.command()).to.equal(
            'show gpon int gpon2/1:1 onu optical-transceiver-diagnosis'
        );
    });

    it('should return correct onu details when data is provided', () => {
        const result: IDeviceCommand<IBdcomOnuInterfaceXponOpticalDetails> =
            cmdShowXponIntXponOnuOpt(0, 1, 1);
        const data =
            '-----\n' +
            ' gpon0/1:1    39.0                   3.4           13.5           -14.1           2.3\n' +
            'N';
        const onuDetails = result.analyzer(data);
        expect(onuDetails).to.deep.equal({
            opTemperature: '39.0',
            opVoltage: '3.4',
            opBiasCurrent: '13.5',
            opRxPower: '-14.1',
            opTxPower: '2.3',
        });
    });

    it('should return empty strings when data is not provided', () => {
        const result: IDeviceCommand<IBdcomOnuInterfaceXponOpticalDetails> =
            cmdShowXponIntXponOnuOpt(0, 1, 1);
        const data = '';
        const onuDetails = result.analyzer(data);
        expect(onuDetails).to.deep.equal({
            opTemperature: '',
            opVoltage: '',
            opBiasCurrent: '',
            opRxPower: '',
            opTxPower: '',
        });
    });
});
