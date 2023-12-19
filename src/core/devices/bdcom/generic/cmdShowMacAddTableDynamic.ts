import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {defaultCmdParams} from "../../../network/DeviceDefaultCmdParams";
import {IBdcomMacAddTable} from "./interfaces/IBdcomMacAddTable";

export const cmdShowMacAddTableDynamic: IDeviceCommand<IBdcomMacAddTable> = {
    ...defaultCmdParams,
    cmdParams: {
        sendTimeout: 1500
    },
    command: () => 'sh mac address-table dynamic',
    analyzer: (data) => {
        let input = data.replace(/\r\n/g, " ");
        const regex = /((\d+)\s+(\S+[.-]\S+[.-]\S+)\s+(\S+)\s+((t?g(\d+)\/(\d+))|((epon|gpon)(\d+)\/(\d+):(\d+))))/gm;
        const macInfo: IBdcomMacAddTable[] = [];
        let match
        while ((match = regex.exec(input)) !== null) {
            const [, wholeMatch, vlan, mac, type, fullInterface, ethFullInt, ethBoard, ethPort, ponFullInt, ponType, ponBoard, ponPort, ponInt,] = match;
            const macObject: IBdcomMacAddTable = {
                vlan,
                mac,
                type,
                fullInterface,
                ethFullInt,
                ethBoard,
                ethPort,
                ponFullInt,
                ponBoard,
                ponPort,
                ponInt
            }
            macInfo.push(macObject);
        }
        return macInfo;
    }
}