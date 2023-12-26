import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomOnuInterfaceXponOpticalDetails} from "./interfaces/IBdcomOnuInterfaceDetails";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

/***
    * @description Show epon int epon<boardNumber>/<portNumber>:<interfaceNumber> onu ctc optical-transceiver-diagnosis
    * @param boardNumber default value is 0
    * @param portNumber
    * @param interfaceNumber
    */
export const cmdShowXponIntXponOnuOpt = (boardNumber: number = 0, portNumber: number, interfaceNumber: number): IDeviceCommand<IBdcomOnuInterfaceXponOpticalDetails> => {
    return {
        ...defaultCmdParams,
        command: () => `show epon int epon${boardNumber}/${portNumber}:${interfaceNumber} onu ctc optical-transceiver-diagnosis`,
        analyzer: (data) => {
            let input = data.replace(/[\b\r\n]/g, "").replace(/(\s)\s*(\w)\s*(\s)/g, "$1$2");
            const regex = /:\s(-?\d+.?\d+?)/gm;
            const onuInfo: any[] = [];
            let match
            while ((match = regex.exec(input)) !== null) {
                const [, value] = match;
                onuInfo.push(value);
            }
            const onuDetails: IBdcomOnuInterfaceXponOpticalDetails = {
                opTemperature: onuInfo[0] || "",
                opVoltage: onuInfo[1] || "",
                opBiasCurrent: onuInfo[2] || "",
                opTxPower: onuInfo[3] || "",
                opRxPower: onuInfo[4] || "",
            }
            return onuDetails;
        }
    }
}