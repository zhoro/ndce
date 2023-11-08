import {IDeviceCommandParams} from "./IDeviceCommandParams";

export interface IDeviceCommand<T> {
    cmdParams: IDeviceCommandParams;
    command: () => string;
    analyzer: (output: string) => T | T[];
}