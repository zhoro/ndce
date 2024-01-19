import Debug from 'debug';
import {IDeviceConnection} from '../interfaces/IDeviceConnection';
import {Telnet} from 'telnet-client';
import {IDeviceConfiguration} from '../interfaces/IDeviceConfiguration';
import {IDeviceCommandParams} from '../interfaces/IDeviceCommandParams';

export type TelnetConnectionParams = {
    host: string;
    port: number;
    shellPrompt: string;
    timeout: number;
    sendTimeout: number;
    username?: string;
    password?: string;
    terminalWidth: number;
    pageSeparator?: string;
};

/***
 * Telnet connection
 */
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
        this.debug('TelnetConnection.isConnected: ' + value);
    }

    private _isLogged: boolean = false;
    get isLogged(): boolean {
        return this._isLogged;
    }

    private set isLogged(value: boolean) {
        this._isLogged = value;
        this.debug('TelnetConnection.isLogged: ' + value);
    }

    private _isInitialized: boolean = false;
    get isInitialized(): boolean {
        return this._isInitialized;
    }

    private set isInitialized(value: boolean) {
        this._isInitialized = value;
        this.debug('TelnetConnection.isInitialized: ' + value);
        this.debug('TelnetConnection.params: ' + JSON.stringify(this.params));
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
            terminalWidth: 120,
            pageSeparator: deviceConfiguration.messagePageSeparator,
        };
    }

    async login(messageAuthFailed?: string, messageLoginPrompt?: string) {
        this.debug('TelnetConnection.login');
        if (!this.isConnected) {
            throw new Error('Not connected');
        }
        await this.telnet.send(this.params.username);
        const result = await this.telnet.send(this.params.password);
        if (
            result.includes(messageAuthFailed) ||
            result.includes(messageLoginPrompt)
        ) {
            await Promise.reject(messageAuthFailed);
            this.isLogged = false;
        } else {
            this.isLogged = true;
        }
    }

    async logout() {
        throw new Error('Method not implemented.');
    }

    /***
     * Initialize connection
     * @param params connection parameters
     */
    initialize(params: TelnetConnectionParams): boolean {
        this.debug('TelnetConnection.initialize');
        if (!this.isInitialized) {
            this.telnet = new Telnet();
            this.params = params;

            this.telnet.on('failedlogin', this.onLoginFailed.bind(this));
            this.telnet.on('error', this.onError.bind(this));
            this.telnet.on('timeout', this.onTimeout.bind(this));

            this.isInitialized = true;
            return true;
        }
        return false;
    }

    /***
     * Connect to the device
     */
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

    /***
     * Disconnect from the device
     */
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

    /***
     * Execute command
     * @param command command to execute
     * @param params command parameters
     * @param retryCount number of retries. Optional, default 3
     */
    async execute(
        command: string,
        params: IDeviceCommandParams,
        retryCount: number = 3
    ) {
        this.debug(
            `TelnetConnection.execute: ${command}. Timeout: ${params.sendTimeout}`
        );
        for (let i = 0; i < retryCount; i++) {
            try {
                if (!this.isConnected) {
                    this.debug(
                        'TelnetConnection.execute: not connected, trying to reconnect'
                    );
                    await this.connect();
                    if (!this.isConnected) {
                        this.debug(
                            'TelnetConnection.execute: reconnection failed'
                        );
                        return Promise.reject('Reconnection failed');
                    }
                }
                let result = await this.telnet.send(command, {
                    timeout: params.sendTimeout,
                });
                while (
                    result.includes(
                        this.deviceConfiguration.messagePageSeparator
                    )
                ) {
                    result = result.replace(
                        new RegExp(
                            this.deviceConfiguration.messagePageSeparator,
                            'g'
                        ),
                        ''
                    );
                    result += await this.telnet.send(' ');
                }
                return result;
            } catch (error) {
                this.debug(
                    `TelnetConnection.execute: command execution failed. Error ${error}! Attempt ${
                        i + 1
                    }`
                );
                if (i < retryCount - 1) {
                    this.debug('TelnetConnection.execute: retrying');
                } else {
                    this.debug('TelnetConnection.execute: all attempts failed');
                    throw error;
                }
            }
        }
    }

    onError(error: Error) {
        this.debug('TelnetConnection.onError: ' + error.message);
        this.telnet.end();
    }

    onTimeout() {
        this.debug(
            `TelnetConnection.onTimeout: Host ${this.params.host} socket timeout. (This is only to notify that the socket has been idle)`
        );
    }

    onLoginFailed() {
        this.debug('TelnetConnection.onLoginFailed: login failed');
        this.telnet.end();
    }
}
