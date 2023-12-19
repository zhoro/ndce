import * as dotenv from "dotenv";
import Debug from "debug";
import {exCmdShowEponOnuInfoInterface} from "./exShEponOnuInfoInterface";
import {exCmdShowEponIntEponOnuCtcOpt} from "./exShEponIntEponOnuCtcOpt";
import {exCmdShEponInactiveOnu} from "./exShEponInactiveOnu";

dotenv.config();
const debug = Debug('ndce:exCron');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    await exCmdShowEponOnuInfoInterface();
    await exCmdShowEponIntEponOnuCtcOpt(1, 0, 1, 1);
    await exCmdShowEponIntEponOnuCtcOpt(2, 0, 1, 1);
    await exCmdShEponInactiveOnu();
}

debug('start');
run().catch(e => {
    console.error(e);
}).finally(() => {
    debug('end');
});
