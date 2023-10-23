import {DeviceAccessType} from "../DeviceAccessType";

export interface IDeviceConfiguration {
    type: string;
    deviceAccessTypes: DeviceAccessType;
    messageAuthFailed: string;
    messagePageSeparator: string;
}