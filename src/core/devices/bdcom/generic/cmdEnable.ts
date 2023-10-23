import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdEnable: IDeviceCommand = {
    ...defaultCmdParams,
    command: () => {
        return "enable"
    },
    analyzer: () => {
        return undefined
    }
}