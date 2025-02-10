import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdClearMacAddressTableDynamic: IDeviceCommand<boolean> = {
    ...defaultCmdParams,
    command: () => {
        return 'clear mac address-table dynamic';
    },
    analyzer: () => {
        return true;
    },
};
