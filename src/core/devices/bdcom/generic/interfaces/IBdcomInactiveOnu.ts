export interface IBdcomInactiveOnu {
    eponBoard: number;
    eponPort: number;
    eponInterface: number;
    macAddressOnu: string;
    status: string;
    lastRegDate: string;
    lastRegTime: string;
    lastDeregDate: string;
    lastDeregTime: string;
    lastDeregReason: string;
    absentDays: string;
    absentTime: string;
}