import {IDeviceConfiguration} from '../../../network/interfaces/IDeviceConfiguration';
import {DeviceType} from '../../../network/DeviceType';
import {DeviceAccessType} from '../../../network/DeviceAccessType';
import {cmdShowCpu} from '../generic/cmdShowCpu';
import {cmdEnable} from '../generic/cmdEnable';
import {cmdShowXponOnuInfo} from './cmdShowXponOnuInfo';
import {cmdShowXponIntXponOnuOpt} from './cmdShowXponIntXponOnuOpt';
import {cmdShowXponInactiveOnu} from './cmdShowXponInactiveOnu';
import {cmdShowXponOptTrDiagInt} from './cmdShowXponOptTrDiagInt';
import {cmdShowMacAddTableDynamic} from '../generic/cmdShowMacAddTableDynamic';
import {cmdShowMacAddTableInt} from '../generic/cmdShowMacAddTableInt';
import {PonType} from '../generic/interfaces/IBdcomPonType';
import {IOltConfiguration} from '../../../network/interfaces/IOltConfiguration';
import {cmdShowIntStatus} from './cmdShowIntStatus';
import {cmdShowXponActiveOnu} from './cmdShowXponActiveOnu';
import {cmdShowVersion} from './cmdShowVersion';
import {cmdClearMib} from '../generic/cmdClearMib';
import {cmdClearMacAddressTableDynamic} from '../generic/cmdClearMacAddressTableDynamic';

const type: DeviceType = 'olt';

const ponType: PonType = 'gpon';

const description: string = 'BDCOM Generic OLT 8xGPON';

// device access type: telnet or ssh
const deviceAccessTypes: DeviceAccessType = 'telnet';

// message used for authentication failed detection in telnet or ssh session
const messageAuthFailed: string = 'Authentication failed';

// message used for login prompt detection in telnet or ssh session
const messageLoginPrompt = 'Username:';

// default page separator for commands like "show running-config" and used for pagination
const messageMoreResponse: string = '--More--';

// 0 - master device board (interface 0/x). If device has only one board, then board number is 0.
// Otherwise, board number starts from 0, and you'll need to add to array all board numbers.
const boards = [0];

// ports count for each type of ports
// PON - xPON ports
// GE - Gigabit Ethernet ports
// ETH - Fast Ethernet ports
// XGE - 10 Gigabit Ethernet ports
const portsCount = {
    PON: 8,
    GE: 8,
    ETH: 0,
    XGE: 4,
};

export const generic_gpon: {
    configuration: IDeviceConfiguration & IOltConfiguration;
    commands: any;
} = {
    configuration: {
        type,
        ponType,
        description,
        deviceAccessTypes,
        messageAuthFailed,
        messageLoginPrompt,
        messagePageSeparator: messageMoreResponse,
        portsCount,
        boards,
    },
    commands: {
        cmdShowCpu: cmdShowCpu,
        cmdEnable: cmdEnable,
        cmdShowXponOnuInfo: cmdShowXponOnuInfo,
        cmdShowXponIntOnuCtcOpt: cmdShowXponIntXponOnuOpt,
        cmdShowXponInactiveOnu: cmdShowXponInactiveOnu,
        cmdShowXponOptTrDiagInt: cmdShowXponOptTrDiagInt,
        cmdShowMacAddTableDynamic: cmdShowMacAddTableDynamic,
        cmdShowMacAddTableInt: cmdShowMacAddTableInt,
        cmdShowIntStatus: cmdShowIntStatus,
        cmdShowXponActiveOnu: cmdShowXponActiveOnu,
        cmdShowVersion: cmdShowVersion,
        cmdClearMib: cmdClearMib,
        cmdClearMacAddressTableDynamic: cmdClearMacAddressTableDynamic,
    },
};
