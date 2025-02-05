import {defaultCmdParams} from '../../../network/DeviceDefaultCmdParams';
import {IDeviceCommand} from '../../../network/interfaces/IDeviceCommand';
import {IBdcomShowVersion} from '../generic/interfaces/IBdcomShowVersion';

export const cmdShowVersion: IDeviceCommand<IBdcomShowVersion> = {
    ...defaultCmdParams,
    command: () => {
        return 'show cpu';
    },
    analyzer: (data) => {
        const versionRegex =
            /BDCOM\(tm\)\s+(\S+)\s+Software,\s+Version\s+(\S+)\s+Build\s+(\d+)/i;
        const versionMatch = data.match(versionRegex);
        const model = versionMatch ? versionMatch[1] : '';
        const softwareVersion = versionMatch ? versionMatch[3] : '';

        const hwRegex = /hardware version:\s*([^\s]+)/i;
        const hwMatch = data.match(hwRegex);
        const hardwareVersion = hwMatch ? hwMatch[1] : '';

        const macRegex = /MAC Address:\s*([\da-f:]+)/i;
        const macMatch = data.match(macRegex);
        const macAddress = macMatch ? macMatch[1] : '';

        const serialRegex = /Serial num:\s*(\S+)/i;
        const serialMatch = data.match(serialRegex);
        const serialNumber = serialMatch ? serialMatch[1] : '';

        const showVersion: IBdcomShowVersion = {
            model,
            softwareVersion,
            hardwareVersion,
            macAddress,
            serialNumber,
        };
        return showVersion;
    },
};
