import {generic} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";

const messageAuthFailed = "Authentication failed";
export const P3310D: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        ...generic.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic.configuration.portsCount,
            PON: 4,
            GE: 6,
            ETH: 0,
            XGE: 0
        }
    },
    commands: {
        ...generic.commands
    }
}