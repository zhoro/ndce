import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomOnuInterfaceEponOpticalDetails} from "./interfaces/IBdcomOnuInterfaceDetails";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";

export const cmdShowEponIntEponOnuCtcOpt = (portNumber: string, interfaceNumber: string): IDeviceCommand => {
    return {
        ...defaultCmdParams,
        command: () => `show epon int epon0/${portNumber}:${interfaceNumber} onu ctc optical-transceiver-diagnosis`,
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, "");
            const regex = /:\s(-?\d+.?\d+?)/gm;
            const onuInfo: any[] = [];
            let match
            while ((match = regex.exec(input)) !== null) {
                const [, value] = match;
                onuInfo.push(value);
            }
            if (onuInfo.length !== 5) throw new Error('Invalid onuInfo information received');
            const onuDetails: IBdcomOnuInterfaceEponOpticalDetails = {
                opTemperature: onuInfo[0],
                opVoltage: onuInfo[1],
                opBiasCurrent: onuInfo[2],
                opTxPower: onuInfo[3],
                opRxPower: onuInfo[4],
            }
            return JSON.stringify(onuDetails)
        }
    }
}