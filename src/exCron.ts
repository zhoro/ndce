import Debug from "debug";
import {exCmdShowEponOnuInfoInterface} from "./exShEponOnuInfoInterface";
import {exCmdShowEponIntEponOnuCtcOpt} from "./exShEponIntEponOnuCtcOpt";
import {exCmdShEponInactiveOnu} from "./exShEponInactiveOnu";

const debug = Debug('ndce:exCron');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    await exCmdShowEponOnuInfoInterface();
    await exCmdShowEponIntEponOnuCtcOpt(2, 0, 1, 1);
    await exCmdShEponInactiveOnu();
}

run().catch(e => {
    console.error(e);
}).finally(() => {
    debug('finally');
});
