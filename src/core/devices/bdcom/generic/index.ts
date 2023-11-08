import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";
import {DeviceType} from "../../../network/DeviceType";
import {DeviceAccessType} from "../../../network/DeviceAccessType";
import {cmdShowCpu} from "./cmdShowCpu";
import {cmdEnable} from "./cmdEnable";
import {cmdShowEponOnuInfo} from "./cmdShowEponOnuInfo";
import {cmdShowEponIntEponOnuCtcOpt} from "./cmdShowEponIntEponOnuCtcOpt";
import {cmdShowEponInactiveOnu} from "./cmdShowEponInactiveOnu";
import {cmdShowEponOptTrDiagInt} from "./cmdShowEponOptTrDiagInt";
import {cmdShowMacAddTableDynamic} from "./cmdShowMacAddTableDynamic";
import {cmdShowMacAddTableInt} from "./cmdShowMacAddTableInt";

const type: DeviceType = 'olt';

// device access type: telnet or ssh
const deviceAccessTypes: DeviceAccessType = "telnet";

// message used for authentication failed detection in telnet or ssh session
const messageAuthFailed: string = "Authentication failed";

// default page separator for commands like "show running-config" and used for pagination
const messageMoreResponse: string = "--More--";

// 0 - master device board (interface 0/x). If device has only one board, then board number is 0.
// Otherwise, board number starts from 0, and you'll need to add to array all board numbers.
const boards = [0];

// ports count for each type of ports
// PON - xPON ports
// GE - Gigabit Ethernet ports
// ETH - Fast Ethernet ports
// XGE - 10 Gigabit Ethernet ports
const portsCount = {
    PON: 4,
    GE: 6,
    ETH: 0,
    XGE: 0
};

export const generic: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        type,
        deviceAccessTypes,
        messageAuthFailed,
        messagePageSeparator: messageMoreResponse,
        portsCount,
        boards
    },
    commands: {
        cmdShowCpu: cmdShowCpu,
        cmdEnable: cmdEnable,
        cmdShowEponOnuInfo: cmdShowEponOnuInfo,
        cmdShowEponIntEponOnuCtcOpt: cmdShowEponIntEponOnuCtcOpt,
        cmdShowEponInactiveOnu: cmdShowEponInactiveOnu,
        cmdShowEponOptTrDiagInt: cmdShowEponOptTrDiagInt,
        cmdShowMacAddTableDynamic: cmdShowMacAddTableDynamic,
        cmdShowMacAddTableInt: cmdShowMacAddTableInt
    }
}