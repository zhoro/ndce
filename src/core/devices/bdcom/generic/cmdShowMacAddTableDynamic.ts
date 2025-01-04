import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';
import {IBdcomMacAddTable} from './interfaces/IBdcomMacAddTable';

export const cmdShowMacAddTableDynamic: IDeviceCommand<IBdcomMacAddTable> = {
    ...defaultCmdParams,
    cmdParams: {
        sendTimeout: 1500,
    },
    command: () => 'sh mac address-table dynamic',
    analyzer: (data) => {
        const input = data
            .replace(/[\b\r\n]/g, '')
            .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
        const regex =
            /((\d+)\s+(\S+[.-]\S+[.-]\S+)\s+(\S+)\s+((t?g(\d+)\/(\d+))|((epon|gpon)(\d{0,3})\/(\d{0,3}):(\d{0,3}))))/gm;
        const matches = [...input.matchAll(regex)];
        const macInfo = matches.map((match) => {
            const [
                ,
                ,
                vlan,
                mac,
                type,
                fullInterface,
                ethFullInt,
                ethBoard,
                ethPort,
                ponFullInt,
                ponType,
                ponBoard,
                ponPort,
                ponInt,
            ] = match;
            return {
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
                ponInt,
            };
        });
        return macInfo;
    },
};
