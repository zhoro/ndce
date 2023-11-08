import {DeviceAccessType} from "../DeviceAccessType";
import {IDevicePortsCount} from "./IDevicePortsCount";

export interface IDeviceConfiguration {
    type: string;
    deviceAccessTypes: DeviceAccessType;
    messageAuthFailed: string;
    messagePageSeparator: string;
    portsCount: IDevicePortsCount;
    boards: number[];
}