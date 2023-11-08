import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdEnable: IDeviceCommand<boolean> = {
    ...defaultCmdParams,
    command: () => {
        return "enable"
    },
    analyzer: () => {
        return true
    }
}