import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdShowCpu: IDeviceCommand = {
    ...defaultCmdParams,
    command: () => {
        return "show cpu"
    },
    analyzer: (data) => {
        const regex = /(\d+)%/g;
        const match = data.match(regex);
        if (match) {
            return JSON.stringify({
                oneSecond: match[0],
                oneMinute: match[1],
                fiveMinutes: match[2],
                max: match[3]
            });
        }
        throw new Error('Invalid cpu information received');
    }
}