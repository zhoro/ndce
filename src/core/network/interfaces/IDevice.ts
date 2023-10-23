import {IDeviceConfiguration} from "./IDeviceConfiguration";

export interface IDevice {
    configuration: IDeviceConfiguration;
    commands: any;
}