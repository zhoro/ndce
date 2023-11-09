export interface IBdcomOnuDevice {
    eponBoard: number;
    eponPort: number;
    eponInterface: number;
    vendorId: string;
    modelId: string;
    macAddressOnu: string;
    description: string;
    bindType: string;
    status: string;
    deregReason: string;
}