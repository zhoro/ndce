import {DeviceType} from '../../network/DeviceType';
import {DeviceAccessType} from '../../network/DeviceAccessType';
import {IDeviceConfiguration} from '../../network/interfaces/IDeviceConfiguration';
import {cmdShowMacAddTableInt} from '../bdcom/generic/cmdShowMacAddTableInt';

const type: DeviceType = 'switch';

// device access type: telnet or ssh
const deviceAccessTypes: DeviceAccessType = 'telnet';

// message used for authentication failed detection in telnet or ssh session
const messageAuthFailed: string = 'Authentication failed';

// message used for login prompt detection in telnet or ssh session
const messageLoginPrompt = 'Username:';

// default page separator for commands like "show running-config" and used for pagination
const messagePageSeparator: string = '--More--';

// 0 - master device board (interface 0/x). If device has only one board, then board number is 0.
// Otherwise, board number starts from 0, and you'll need to add to array all board numbers.
const boards = [0];

const portsCount = {
    PON: 0,
    GE: 2,
    ETH: 24,
    XGE: 0,
};

export const generic_switch: {
    configuration: IDeviceConfiguration
    commands: any;
} = {
    configuration: {
        type,
        deviceAccessTypes,
        messageAuthFailed,
        messageLoginPrompt,
        messagePageSeparator,
        portsCount,
        boards,
    },
    commands: {},
};