import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';
import {IBdcomXponOptTrDiagInt} from '../generic/interfaces/IBdcomXponOptTrDiagInt';

export const cmdShowXponOptTrDiagInt = (
    portNumber: string
): IDeviceCommand<IBdcomXponOptTrDiagInt> => {
    return {
        ...defaultCmdParams,
        cmdParams: {
            sendTimeout: 15000,
        },
        command: () =>
            `show gpon optical-transceiver-diagnosis interface gpon 0/${portNumber}`,
        analyzer: (data) => {
            let input = data
                .replace(/[\b\r\n]/g, '')
                .replace(/(\s)\s*(\w)\s*(\s)/g, '$1$2');
            const regex =
                /(gpon(\d{0,3})\/(\d{0,3}):(\d{0,3})\s+(-?\d{1,2}.\d))/gm;
            const onuInfo: IBdcomXponOptTrDiagInt[] = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                const [
                    ,
                    wholeMatch,
                    xponBoard,
                    xponPort,
                    xponInterface,
                    rxPower,
                ] = match;
                const onuObject: IBdcomXponOptTrDiagInt = {
                    xponBoard: xponBoard,
                    xponPort: xponPort,
                    xponInterface: xponInterface,
                    rxPower,
                };
                onuInfo.push(onuObject);
            }
            return onuInfo;
        },
    };
};
