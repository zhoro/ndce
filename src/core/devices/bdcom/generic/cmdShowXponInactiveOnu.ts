import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomInactiveOnu} from "./interfaces/IBdcomInactiveOnu";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdShowXponInactiveOnu: IDeviceCommand<IBdcomInactiveOnu> = {
    ...defaultCmdParams,
    command: () => {
        return "show epon inactive-onu"
    },
    analyzer: (data) => {
        let input = data.replace(/[\b\r\n]/g, "").replace(/(\s)\s*(\w)\s*(\s)/g, "$1$2");
        const regex = /(EPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s(\S+)\s(\S+)\s(\S+)\s(\S+)\s+(\d+)(\s+)?(\.)(\d{2}:\d{2}:\d{2}))/gm
        const deregisteredONUs: any[] = [];
        let match
        while ((match = regex.exec(input)) !== null) {
            const [, wholeMatch, xponBoard, xponPort, xponInterface, macAddressOnu, status, lastRegDate, lastRegTime, lastDeregDate, lastDeregTime, lastDeregReason, absentDays, , , absentTime] = match;
            const onuObject: IBdcomInactiveOnu = {
                xponType: "epon",
                xponBoard: +xponBoard,
                xponPort: +xponPort,
                xponInterface: +xponInterface,
                loid: "",
                serialNumber: "",
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