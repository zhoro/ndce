import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';

export const cmdClearMib: IDeviceCommand<boolean> = {
    ...defaultCmdParams,
    command: () => {
        return 'clear mib';
    },
    analyzer: () => {
        return true;
    },
};
