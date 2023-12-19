import {generic_epon} from "../generic";
import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";
import {generic_gpon} from "../generic-gpon";
import {IOltConfiguration} from "../../../network/interfaces/IOltConfiguration";

const messageAuthFailed = "Authentication failed";

export const GP3600_08B: { configuration: IDeviceConfiguration & IOltConfiguration, commands: any } = {
    configuration: {
        ...generic_gpon.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic_epon.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 0,
            XGE: 4
        }
    },
    commands: {
        ...generic_gpon.commands
    }
}