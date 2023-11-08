import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";
import {IBdcomEponOptTrDiagInt} from "./interfaces/IBdcomEponOptTrDiagInt";

export const cmdShowEponOptTrDiagInt = (portNumber: string): IDeviceCommand<IBdcomEponOptTrDiagInt> => {
    return {
        ...defaultCmdParams,
        cmdParams: {
            sendTimeout: 15000
        },
        command: () => `show epon optical-transceiver-diagnosis interface epon 0/${portNumber}`,
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, "");
            const regex = /(epon(\d)\/(\d):(\d{0,3})\s+(-?\d{1,2}.\d))/gm;
            const onuInfo: IBdcomEponOptTrDiagInt[] = [];
            let match
            while ((match = regex.exec(input)) !== null) {
                const [, wholeMatch, eponBoard, eponPort, eponInterface, rxPower] = match;
                const onuObject: IBdcomEponOptTrDiagInt = {
                    eponBoard,
                    eponPort,
                    eponInterface,
                    rxPower
                }
                onuInfo.push(onuObject);
            }
            return onuInfo
        }
    }
}