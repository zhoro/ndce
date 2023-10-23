import {generic} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";

const messageAuthFailed = "Authentication failed";
export const P3310D : { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        ...generic.configuration,
        messageAuthFailed
    },
    commands: {
        ...generic.commands
    }
}