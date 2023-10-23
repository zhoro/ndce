import {IDeviceConfiguration} from "../../../network/interfaces/IDeviceConfiguration";
import {DeviceType} from "../../../DeviceType";
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
const deviceAccessTypes: DeviceAccessType = "telnet";
const messageAuthFailed: string = "Authentication failed";
const messageMoreResponse: string = "--More--";
export const generic: { configuration: IDeviceConfiguration, commands: any } = {
    configuration: {
        type,
        deviceAccessTypes,
        messageAuthFailed,
        messagePageSeparator: messageMoreResponse
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