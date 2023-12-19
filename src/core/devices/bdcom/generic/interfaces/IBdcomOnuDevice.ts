import {PonType} from "./IBdcomPonType";

export interface IBdcomOnuDevice {
    xponType: PonType
    xponBoard: number;
    xponPort: number;
    xponInterface: number;
    vendorId: string;
    modelId: string;
    macAddressOnu: string;
    serialNumberOnu: string;
    loid?: string;
    activeTime?: string;
    description: string;
    bindType: string;
    status: string;
    configStatus?: string;
    deregReason: string;
}