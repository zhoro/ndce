import {exCmdShowEponOnuInfoInterface} from "./exShEponOnuInfoInterface";
import Debug from "debug";

const debug = Debug('ndce:exCron');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    await exCmdShowEponOnuInfoInterface(5, 0);
}

run().catch(e => {
    console.error(e);
}).finally(() => {
    debug('finally');
});
