import {IDeviceCommand} from "../../../network/interfaces/IDeviceCommand";
import {IBdcomMacAddTable} from "./interfaces/IBdcomMacAddTable";

export const cmdShowMacAddTableInt = (intType: string, boardNum: string, portNum: string, intNum?: string): IDeviceCommand => {
    return {
        cmdParams: {
            sendTimeout: 1500
        },
        command: () => {
            if (intType.includes('pon') && intNum != undefined) {
                return `sh mac address-table interface ${intType} ${boardNum}/${portNum}:${intNum}`
            }
            return `sh mac address-table interface ${intType} ${boardNum}/${portNum}`
        },
        analyzer: (data) => {
            let input = data.replace(/\r\n/g, " ");
            const regex = /((\d+)\s+(\S+[.-]\S+[.-]\S+)\s+(\S+)\s+((g(\d+)\/(\d+))|(epon(\d+)\/(\d+):(\d+))))/gm;
            const macInfo: any[] = [];
            let match
            while ((match = regex.exec(input)) !== null) {
                const [, wholeMatch, vlan, mac, type, fullInterface, ethFullInt, ethBoard, ethPort, ponFullInt, ponBoard, ponPort, ponInt,] = match;
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
            return JSON.stringify(macInfo);
        }
    }
}