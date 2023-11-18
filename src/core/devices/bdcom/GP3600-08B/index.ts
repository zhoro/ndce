import {generic} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";

const messageAuthFailed = "Authentication failed";
export const GP3600_08B: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        ...generic.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 0,
            XGE: 4
        }
    },
    commands: {
        ...generic.commands
    }
}