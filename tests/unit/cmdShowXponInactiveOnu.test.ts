import {cmdShowXponInactiveOnu} from '../../src/core/devices/bdcom/generic-gpon/cmdShowXponInactiveOnu';
import {expect} from 'chai';

describe('cmdShowXponInactiveOnu', () => {
    it('should return an empty array when no matches are found', () => {
        const result = cmdShowXponInactiveOnu.analyzer('');
        expect(result).to.be.an('array').that.is.empty;
    });

    it('should correctly analyze the data', () => {
        const mockData =
            'GPON0/1:126    FHTT:6A89B080    N/A                      off-line      2023-11-29 12:37:03 Los';
        const result = cmdShowXponInactiveOnu.analyzer(mockData);
        expect(result).to.deep.equal([
            {
                xponType: 'gpon',
                xponBoard: 0,
                xponPort: 1,
                xponInterface: 126,
                macAddressOnu: '',
                serialNumber: 'FHTT:6A89B080',
                loid: 'N/A',
                status: 'off-line',
                lastRegDate: '',
                lastRegTime: '',
                lastDeregDate: '2023-11-29',
                lastDeregTime: '12:37:03',
                lastDeregReason: 'Los',
                absentDays: '',
                absentTime: '',
            },
        ]);
    });

    it('should return an array of inactive ONUs when matches are found', () => {
        const data = 'GPON1/2:3 ABCD ABCD ABCD ABCD ABCD ABCD ABCD';
        const result = cmdShowXponInactiveOnu.analyzer(data);
        expect(result).to.be.an('array').that.is.not.empty;
        expect(result[0]).to.have.property('xponType', 'gpon');
        expect(result[0]).to.have.property('xponBoard', 1);
        expect(result[0]).to.have.property('xponPort', 2);
        expect(result[0]).to.have.property('xponInterface', 3);
        expect(result[0]).to.have.property('serialNumber', 'ABCD');
    });

    it('should correctly parse multiple lines of data', () => {
        const data =
            'GPON1/2:3 ABCD ABCD ABCD ABCD ABCD ABCD ABCD\nGPON4/5:6 EFGH EFGH EFGH EFGH EFGH EFGH EFGH';
        const result = cmdShowXponInactiveOnu.analyzer(data);
        expect(result).to.be.an('array').that.has.lengthOf(2);
        expect(result[1]).to.have.property('xponType', 'gpon');
        expect(result[1]).to.have.property('xponBoard', 4);
        expect(result[1]).to.have.property('xponPort', 5);
        expect(result[1]).to.have.property('xponInterface', 6);
        expect(result[1]).to.have.property('serialNumber', 'EFGH');
    });
});
