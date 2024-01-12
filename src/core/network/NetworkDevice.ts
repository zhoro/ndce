import Debug from 'debug';
import {DeviceManagementAccess} from "./DeviceManagementAccess";
import {TelnetConnection} from "./transport/TelnetConnection";
import {IDeviceConnection} from "./interfaces/IDeviceConnection";
import {IDeviceCommand} from "./interfaces/IDeviceCommand";
import {IDevice} from "./interfaces/IDevice";

export class NetworkDevice {
    private debug;
    private transport: IDeviceConnection;

    get isConnected(): boolean {
        return this.transport.isConnected;
    }

    get isLogged(): boolean {
        return this.transport.isLogged;
    }

    /***
     * NetworkDevice constructor
     * @param device
     * @param managementAccess
     */
    constructor(public device: IDevice, public managementAccess: DeviceManagementAccess) {

        this.debug = Debug('ndce:network-device');
        Debug.enable(process.env.DEBUG || 'false');

        switch (device.configuration.deviceAccessTypes) {
            case "telnet":
                this.transport = new TelnetConnection(device.configuration);
                break;
            default:
                throw new Error("Unknown device access type");
        }

        this.transport.initialize({
            username: managementAccess.credentials.username,
            password: managementAccess.credentials.password,
            host: managementAccess.host.ipAddress,
            port: managementAccess.host.port,
            shellPrompt: '',
            timeout: 5000,
            sendTimeout: 1000,
            terminalWidth: 132,
            pageSeparator: device.configuration.messagePageSeparator
        })
    }

    async connect() {
        try {
            if (!this.transport.isConnected) {
                await this.transport.connect().catch(e => {
                    console.error('NetworkDevice.connect exception: ' + e);
                }).finally(() => {
                    this.debug('NetworkDevice.connect: finally')
                });
            }
        } catch (e) {
            console.error('NetworkDevice.connect: ' + e);
        }
    }

    async login() {
        try {
            if (this.transport.isConnected) {
                const result = await this.transport.login(this.device.configuration.messageAuthFailed, this.device.configuration.messageLoginPrompt);
                if (!this.transport.isLogged) {
                    this.debug('NetworkDevice.login: ' + result)
                    return Promise.reject(this.device.configuration.messageAuthFailed)
                }
            } else {
                console.error('NetworkDevice.login: device is not connected');
                return Promise.reject(this.device.configuration.messageAuthFailed)
            }
        } catch (e) {
            console.error('NetworkDevice.login: ' + e);
            return Promise.reject(this.device.configuration.messageAuthFailed)
        }
    }

    async execute(cmd: IDeviceCommand<any>) {
        try {
            if (this.transport.isConnected && this.transport.isLogged) {
                const deviceCommand = cmd.command();
                const data = await this.transport.execute(deviceCommand, cmd.cmdParams);
                return cmd.analyzer(data)
            } else {
                console.error('NetworkDevice.execute: device is not connected/authorized');
                return Promise.reject()
            }
        } catch (e) {
            console.error('NetworkDevice.execute: ' + e);
            return Promise.reject()
        }
    }

    async disconnect() {
        try {
            if (this.transport.isConnected) {
                await this.transport.disconnect().catch(e => {
                    console.error('NetworkDevice.disconnect exception: ' + e);
                }).finally(() => {
                    this.debug('NetworkDevice.disconnect: finally')
                });
            }
        } catch (e) {
            console.error('NetworkDevice.disconnect: ' + e);
        }
    }
}