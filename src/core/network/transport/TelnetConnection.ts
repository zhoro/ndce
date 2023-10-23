import Debug from 'debug';
import {IDeviceConnection} from "../interfaces/IDeviceConnection";
import {Telnet} from "telnet-client";
import {IDeviceConfiguration} from "../interfaces/IDeviceConfiguration";
import {IDeviceCommandParams} from "../interfaces/IDeviceCommandParams";

export type TelnetConnectionParams = {
    host: string;
    port: number;
    shellPrompt: string;
    timeout: number;
    sendTimeout: number;
    username?: string;
    password?: string;
    terminalWidth: 132;
    pageSeparator?: string;
}

/// Telnet connection Class
export class TelnetConnection implements IDeviceConnection {
    private debug;
    private telnet;
    private params: TelnetConnectionParams;

    private _isConnected: boolean = false;
    get isConnected(): boolean {
        return this._isConnected;
    }

    private set isConnected(value: boolean) {
        this._isConnected = value;
        this.debug('TelnetConnection.isConnected: ' + value)
    }

    private _isLogged: boolean = false;
    get isLogged(): boolean {
        return this._isLogged;
    }

    private set isLogged(value: boolean) {
        this._isLogged = value;
        this.debug('TelnetConnection.isLogged: ' + value)
    }

    private _isInitialized: boolean = false;
    get isInitialized(): boolean {
        return this._isInitialized;
    }

    private set isInitialized(value: boolean) {
        this._isInitialized = value;
        this.debug('TelnetConnection.isInitialized: ' + value)
        this.debug('TelnetConnection.params: ' + JSON.stringify(this.params))
    }

    constructor(private deviceConfiguration: IDeviceConfiguration) {
        this.debug = Debug('ndce:telnet-transport');
        Debug.enable(process.env.DEBUG || 'false');

        this.debug('TelnetConnection.constructor');

        this.telnet = null;
        this.params = {
            host: '',
            port: 23,
            shellPrompt: '',
            timeout: 5000,
            sendTimeout: 2000,
            username: '',
            password: '',
            terminalWidth: 132,
            pageSeparator: deviceConfiguration.messagePageSeparator
        };
    }

    async login(messageAuthFailed?: string) {
        this.debug('TelnetConnection.login');
        if (!this.isConnected) {
            throw new Error("Not connected");
        }
        await this.telnet.send(this.params.username);
        const result = await this.telnet.send(this.params.password);
        if (result.includes(messageAuthFailed)) {
            await Promise.reject(messageAuthFailed)
            this.isLogged = false;
        } else {
            this.isLogged = true;
        }
    }

    async logout() {
        throw new Error("Method not implemented.");
    }

    /// Initialize the connection
    initialize(params: TelnetConnectionParams): boolean {
        this.debug('TelnetConnection.initialize');
        if (!this.isInitialized) {
            this.telnet = new Telnet();
            this.params = params;

            this.telnet.on('failedlogin', this.onLoginFailed);
            this.telnet.on('error', this.onError);
            this.telnet.on('timeout', this.onTimeout);

            this.isInitialized = true;
            return true;
        }
        return false;
    }

    /// Connect to the device
    async connect() {
        this.debug('TelnetConnection.connect');
        if (this.isConnected) {
            this.debug('TelnetConnection.connect: already connected');
            return;
        }
        try {
            await this.telnet.connect(this.params);
            this.isConnected = true;
        } catch (e) {
            console.error('TelnetConnection.connect: ' + e);
            this.isConnected = false;
        }
        return;
    }

    /// Disconnect from the device
    async disconnect() {
        this.debug('TelnetConnection.disconnect');
        if (this.isConnected) {
            try {
                await this.telnet.end();
            } catch (e) {
                console.error('TelnetConnection.disconnect: ' + e);
                await this.telnet.destroy();
            } finally {
                this.isConnected = false;
            }
        }
    }

    /// Execute a command on the device
    async execute(command: string, params: IDeviceCommandParams) {
        this.debug('TelnetConnection.execute: ' + command);
        if (!this.isConnected) return Promise.reject();
        let result = await this.telnet.send(command, {sendTimeout: params.sendTimeout});
        while (result.includes(this.deviceConfiguration.messagePageSeparator)) {
            result = result.replace(new RegExp(this.deviceConfiguration.messagePageSeparator, 'g'), '');
            result += await this.telnet.send(' ');
        }
        return result;
    }

    onError(error) {
        console.error(error);
    }

    onTimeout() {
        console.error('TelnetConnection.onTimeout');
    }

    onLoginFailed() {
        this.debug('TelnetConnection.onLoginFailed');
    }
}