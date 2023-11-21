import {generic} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";

const messageAuthFailed = "Authentication failed";
export const P3608B: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        ...generic.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 1,
            XGE: 2
        }
    },
    commands: {
        ...generic.commands
    }
}