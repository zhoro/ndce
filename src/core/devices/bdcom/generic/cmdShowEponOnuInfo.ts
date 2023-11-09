import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomOnuDevice} from "./interfaces/IBdcomOnuDevice";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";
import {StatOnuDevice} from "@prisma/client";

/***
 * This command is used to show epon onu info interface
 * @param boardNumber - default value is 0
 * @param portNumber - port number
 */
export const cmdShowEponOnuInfo = (boardNumber: number = 0, portNumber: number): IDeviceCommand<StatOnuDevice> => {
    return {
        ...defaultCmdParams,
        command: () => {
            return `show epon onu-info int epon${boardNumber}/${portNumber}`;
        },
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, "");
            const regex = /(EPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+))/gm
            const onuDevices: any[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const [, wholeMatch, eponBoard, eponPort, eponInterface, vendorId, modelId, macAddressOnu, description, bindType, status, deregReason] = match;
                const onuObject: IBdcomOnuDevice = {
                    eponBoard: +eponBoard,
                    eponPort: +eponPort,
                    eponInterface: +eponInterface,
                    vendorId,
                    modelId,
                    macAddressOnu,
                    description,
                    bindType,
                    status,
                    deregReason,
                };
                onuDevices.push(onuObject);
            }
            return onuDevices
        }
    }
}