import {generic_epon} from '../generic';
import {IDeviceConfiguration} from '../../../network/interfaces/IDeviceConfiguration';
import {IOltConfiguration} from '../../../network/interfaces/IOltConfiguration';

const messageAuthFailed = 'Authentication failed';
const description = 'BDCOM P3600-08E';
export const P3600_08E: {
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
            ETH: 0,
            XGE: 6,
        },
    },
    commands: {
        ...generic_epon.commands,
    },
};
