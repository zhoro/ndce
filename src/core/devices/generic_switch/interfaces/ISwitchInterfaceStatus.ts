export interface ISwitchInterfaceStatus {
    ifStatus: string;
    ifLineProtocolStatus: string;
    ifSpeed: string;
    bandwidth: number;
    description: string;
    hardwareType: string;
    inRate5min: number;
    outRate5min: number;
    inRatePeak: number;
    outRatePeak: number;
    inRateCurrent: number;
    outRateCurrent: number;
    rxError: number;
    boardNum: number;
    portNum: number;
}
