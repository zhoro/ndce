import {IDeviceCommandParams} from './IDeviceCommandParams';

export interface IDeviceConnection {
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    execute(command: string, params: IDeviceCommandParams): Promise<string>;

    initialize(params): boolean;

    get isConnected(): boolean;

    get isLogged(): boolean;

    login(messageAuthFailed: string, messageLoginPrompt: string): Promise<void>;

    logout(): Promise<void>;
}
