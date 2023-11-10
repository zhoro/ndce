import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomInactiveOnu} from "./interfaces/IBdcomInactiveOnu";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdShowEponInactiveOnu: IDeviceCommand<IBdcomInactiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return "show epon inactive-onu"
    },
    analyzer: (data) => {
        let input = data.replace(/\r\n/g, "");
        const regex = /(EPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s(\S+)\s(\S+)\s(\S+)\s(\S+)\s+(\d+)(\s+)?(\.)(\d{2}:\d{2}:\d{2}))/gm
        const deregisteredONUs: any[] = [];
        let match
        while ((match = regex.exec(input)) !== null) {
            const [, wholeMatch, eponBoard, eponPort, eponInterface, macAddressOnu, status, lastRegDate, lastRegTime, lastDeregDate, lastDeregTime, lastDeregReason, absentDays, , , absentTime] = match;
            const onuObject: IBdcomInactiveOnu = {
                eponBoard: +eponBoard,
                eponPort: +eponPort,
                eponInterface: +eponInterface,
                macAddressOnu,
                status,
                lastRegDate,
                lastRegTime,
                lastDeregDate,
                lastDeregTime,
                lastDeregReason,
                absentDays,
                absentTime
            }
            deregisteredONUs.push(onuObject);
        }
        return deregisteredONUs
    }
}