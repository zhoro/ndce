import * as dotenv from 'dotenv';
import Debug from 'debug';
import {DeviceManagementAccess} from "../core/network/DeviceManagementAccess";
import {DeviceHost} from "../core/network/DeviceHost";
import {NetworkDevice} from "../core/network/NetworkDevice";
import {DeviceCredentials} from "../core/network/DeviceCredentials";
import {networkDevices} from "../core/devices";

dotenv.config();

const debug = Debug('ndce:main');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    const username = process.env.CLIENT_USERNAME || "admin";
    const password = process.env.CLIENT_PASSWORD || "admin";

    const host = new DeviceHost("10.12.0.99", 23);
    // const host = new DeviceHost("10.12.3.42", 23);
    const credentials: DeviceCredentials = new DeviceCredentials(username, password);
    const managementAccess = new DeviceManagementAccess(host, credentials);
    const device = new NetworkDevice(networkDevices.BDCOM.GP3600_08B, managementAccess);

    await device.connect();
    if (device.isConnected) {
        await device.login();
    }
    if (device.isLogged) {
        await device.execute(networkDevices.BDCOM.GP3600_08B.commands.cmdEnable);
        const utilization = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowCpu);
        debug(utilization);
        const epoOnuInfo = await device.execute(networkDevices.BDCOM.GP3600_08B.commands.cmdShowXponOnuInfo(0, 1));
        debug(epoOnuInfo);
        const eponOnuIntEponOnuCtcOpt = await device.execute(networkDevices.BDCOM.GP3600_08B.commands.cmdShowXponIntEponOnuCtcOpt(0, 1, 1));
        debug(eponOnuIntEponOnuCtcOpt);
        const eponInactiveOnu = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowXponInactiveOnu);
        debug(eponInactiveOnu);
        const eponOptTrDiagInt = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowXponOptTrDiagInt('1'));
        debug(eponOptTrDiagInt);
        const macAddTableDynamic = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowMacAddTableDynamic);
        debug(macAddTableDynamic);
        const cmdShowMacAddTableInt = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowMacAddTableInt('gpon', '0', '1', '1'));
        debug(cmdShowMacAddTableInt);
        const cmdShowMacAddTableInt2 = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowMacAddTableInt('gpon', '0', '1'));
        debug(cmdShowMacAddTableInt2);
        const cmdShowMacAddTableInt3 = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowMacAddTableInt('g', '0', '3'));
        debug(cmdShowMacAddTableInt3);
        const cmdShowMacAddTableInt4 = await device.execute(networkDevices.BDCOM.generic_gpon.commands.cmdShowMacAddTableInt('tg', '0', '4'));
        debug(cmdShowMacAddTableInt4);
    }
    await device.disconnect();
}

run().catch(e => {
    console.error(e);
}).finally(() => {
    debug('finally');
});
