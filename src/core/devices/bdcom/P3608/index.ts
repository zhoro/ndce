import {generic_epon} from '../generic';
import {IDeviceConfiguration} from '../../../network/interfaces/IDeviceConfiguration';
import {IOltConfiguration} from '../../../network/interfaces/IOltConfiguration';

const messageAuthFailed = 'Authentication failed';
const description = 'BDCOM P3608';
export const P3608: {
    configuration: IDeviceConfiguration & IOltConfiguration;
    commands: any;
} = {
    configuration: {
        ...generic_epon.configuration,
        messageAuthFailed,
        description,
        portsCount: {
            ...generic_epon.configuration.portsCount,
            PON: 8,
            GE: 8,
            ETH: 1,
            XGE: 0,
        },
    },
    commands: {
        ...generic_epon.commands,
    },
};
