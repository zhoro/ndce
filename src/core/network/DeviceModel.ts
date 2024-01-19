import {DeviceVendor} from './DeviceVendor';
import {DeviceType} from './DeviceType';

export class DeviceModel {
    constructor(
        public name: string,
        public vendor: DeviceVendor,
        public deviceType: DeviceType
    ) {}
}
