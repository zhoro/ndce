import {IDeviceCommandParams} from './IDeviceCommandParams';

export interface IDeviceCommand<T> {
    cmdParams: IDeviceCommandParams;
    setTimeout: (value: number) => void;
    command: () => string;
    analyzer: (output: string) => T | T[];
}
