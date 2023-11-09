import * as dotenv from 'dotenv';
import Debug from 'debug';
import {DeviceManagementAccess} from "./core/network/DeviceManagementAccess";
import {DeviceHost} from "./core/network/DeviceHost";
import {NetworkDevice} from "./core/network/NetworkDevice";
import {DeviceCredentials} from "./core/network/DeviceCredentials";
import {networkDevices} from "./core/devices";

dotenv.config();

const debug = Debug('ndce:main');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    const username = process.env.CLIENT_USERNAME || "admin";
    const password = process.env.CLIENT_PASSWORD || "admin";

    const host = new DeviceHost("10.12.0.58", 23);
    // const host = new DeviceHost("10.12.3.42", 23);
    const credentials: DeviceCredentials = new DeviceCredentials(username, password);
    const managementAccess = new DeviceManagementAccess(host, credentials);
    const device = new NetworkDevice(networkDevices.BDCOM.P3310D, managementAccess);

    await device.connect();
    if (device.isConnected) {
        await device.login();
    }
    if (device.isLogged) {
        await device.execute(networkDevices.BDCOM.generic.commands.cmdEnable);
        const utilization = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowCpu);
        debug(utilization);
        const epoOnuInfo = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowEponOnuInfo(0, 1));
        debug(epoOnuInfo);
        const eponOnuIntEponOnuCtcOpt = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowEponIntEponOnuCtcOpt(0,1, 1));
        debug(eponOnuIntEponOnuCtcOpt);
        const eponInactiveOnu = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowEponInactiveOnu);
        debug(eponInactiveOnu);
        const eponOptTrDiagInt = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowEponOptTrDiagInt('1'));
        debug(eponOptTrDiagInt);
        const macAddTableDynamic = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowMacAddTableDynamic);
        debug(macAddTableDynamic);
        const cmdShowMacAddTableInt = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowMacAddTableInt('epon', '0', '1', '1'));
        debug(cmdShowMacAddTableInt);
        const cmdShowMacAddTableInt2 = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowMacAddTableInt('epon', '0', '1'));
        debug(cmdShowMacAddTableInt2);
        const cmdShowMacAddTableInt3 = await device.execute(networkDevices.BDCOM.generic.commands.cmdShowMacAddTableInt('g', '0', '3'));
        debug(cmdShowMacAddTableInt3);
    }
    await device.disconnect();
}

run().catch(e => {
    console.error(e);
}).finally(() => {
    debug('finally');
});
