import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";
import {IBdcomCpuUtilization} from "./interfaces/IBdcomCpuUtilization";

export const cmdShowCpu: IDeviceCommand<IBdcomCpuUtilization> = {
    ...defaultCmdParams,
    command: () => {
        return "show cpu"
    },
    analyzer: (data) => {
        const regex = /(\d+)%/g;
        const match = data.match(regex);
        if (match) {
            const cpuUtilization: IBdcomCpuUtilization = {
                oneSecond: match[0],
                oneMinute: match[1],
                fiveMinutes: match[2],
                max: match[3]
            };
            return cpuUtilization
        }
        throw new Error('Invalid cpu information received');
    }
}