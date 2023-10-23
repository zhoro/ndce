import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomOnuDevice} from "./interfaces/IBdcomOnuDevice";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdShowEponOnuInfo = (portNumber: string): IDeviceCommand => {
    return {
        ...defaultCmdParams,
        command: () => {
            return `show epon onu-info int epon0/${portNumber}`;
        },
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, "");
            const regex = /(EPON(\d)\/(\d):(\d{0,3})\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+))/gm
            const onuDevices: any[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const [, wholeMatch, eponBoard, eponPort, eponInterface, vendorId, modelId, macAddressOnu, description, bindType, status, deregReason] = match;
                const onuObject: IBdcomOnuDevice = {
                    eponBoard,
                    eponPort,
                    eponInterface,
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
            return JSON.stringify(onuDevices)
        }
    }
}