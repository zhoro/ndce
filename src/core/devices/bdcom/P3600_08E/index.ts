import {generic} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";

const messageAuthFailed = "Authentication failed";
export const P3600_08E: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        ...generic.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 0,
            XGE: 6
        }
    },
    commands: {
        ...generic.commands
    }
}