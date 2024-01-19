import {PonType} from './IBdcomPonType';

export interface IBdcomInactiveOnu {
    xponType: PonType;
    xponBoard: number;
    xponPort: number;
    xponInterface: number;
    macAddressOnu: string;
    serialNumber: string;
    loid: string;
    status: string;
    lastRegDate: string;
    lastRegTime: string;
    lastDeregDate: string;
    lastDeregTime: string;
    lastDeregReason: string;
    absentDays: string;
    absentTime: string;
}
