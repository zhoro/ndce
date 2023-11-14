export interface IBdcomMacAddTable {
    vlan: string,
    mac: string,
    type: string,
    fullInterface: string,
    ethFullInt: string | undefined,
    ethBoard: string | undefined,
    ethPort: string | undefined,
    ponFullInt: string | undefined,
    ponBoard: string | undefined,
    ponPort: string | undefined,
    ponInt: string | undefined
}