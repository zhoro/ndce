import {DevicePortsType} from "../DevicePortsType";

export type IDevicePortsCount = {
    [portType in DevicePortsType]: number;
};