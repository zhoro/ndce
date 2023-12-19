import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomOnuDevice} from "../generic/interfaces/IBdcomOnuDevice";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";
import {StatOnuDevice} from "../../../../generated/prisma-client";

/***
 * This command is used to show gpon onu info interface
 * @param boardNumber - default value is 0
 * @param portNumber - port number
 */
export const cmdShowXponOnuInfo = (boardNumber: number = 0, portNumber: number): IDeviceCommand<StatOnuDevice> => {
    return {
        ...defaultCmdParams,
        command: () => {
            return `show gpon onu-info int gpon${boardNumber}/${portNumber}`;
        },
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, "");
            const regex = /(GPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s?(\S+)?)/gm
            const onuDevices: any[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const [, wholeMatch, gponBoard, gponPort, gponInterface, vendorId, modelId, serialNumberOnu, loid, status, configStatus, activeDate, activeTime] = match;
                const onuObject: IBdcomOnuDevice = {
                    xponType: "gpon",
                    serialNumberOnu,
                    configStatus,
                    macAddressOnu: "",
                    xponBoard: +gponBoard,
                    xponPort: +gponPort,
                    xponInterface: +gponInterface,
                    vendorId,
                    modelId,
                    description: "",
                    bindType: "",
                    status,
                    deregReason: "",
                };
                onuDevices.push(onuObject);
            }
            return onuDevices
        }
    }
}