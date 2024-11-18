import {PonType} from './IBdcomPonType';
export interface IBdcomActiveOnu {
    xponType: PonType;
    xponBoard: number;
    xponPort: number;
    xponInterface: number;
    macAddressOnu: string;
    serialNumber: string;
    status: string;
    lastRegDate: string;
    lastRegTime: string;
    lastDeregDate: string;
    lastDeregTime: string;
    lastDeregReason: string;
    aliveTime: string;
    aliveDays: string;
}
