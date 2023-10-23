import {IDeviceCommandParams} from "./IDeviceCommandParams";

export interface IDeviceCommand {
    cmdParams: IDeviceCommandParams;
    command: () => string;
    analyzer: (output: string) => string | undefined;
}