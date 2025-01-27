import {generic_epon} from '../generic';
import {IDeviceConfiguration} from '../../../network/interfaces/IDeviceConfiguration';
import {IOltConfiguration} from '../../../network/interfaces/IOltConfiguration';

const messageAuthFailed = 'Authentication failed';
const description = 'BDCOM P3608B';
export const P3608B: {
    configuration: IDeviceConfiguration & IOltConfiguration;
    commands: any;
} = {
    configuration: {
        ...generic_epon.configuration,
        messageAuthFailed,
        portsCount: {
            ...generic_epon.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 1,
            XGE: 2,
        },
    },
    commands: {
        ...generic_epon.commands,
    },
};
