import {generic_epon} from '../generic';
import {IDeviceConfiguration} from '../../../network/interfaces/IDeviceConfiguration';
import {IOltConfiguration} from '../../../network/interfaces/IOltConfiguration';

const messageAuthFailed = 'Authentication failed';
export const P3310D: {
    configuration: IDeviceConfiguration & IOltConfiguration;
    commands: any;
} = {
    configuration: {
        ...generic_epon.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic_epon.configuration.portsCount,
            PON: 4,
            GE: 6,
            ETH: 0,
            XGE: 0,
        },
    },
    commands: {
        ...generic_epon.commands,
    },
};
