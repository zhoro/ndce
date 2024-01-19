import {DeviceHost} from './DeviceHost';
import {DeviceCredentials} from './DeviceCredentials';

export class DeviceManagementAccess {
    constructor(
        public host: DeviceHost,
        public credentials: DeviceCredentials
    ) {}
}
