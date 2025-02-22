import * as dotenv from 'dotenv';
import Debug from 'debug';
import {exCmdShowEponOnuInfoInterface} from './exShEponOnuInfoInterface';
import {exCmdShowEponIntEponOnuCtcOpt} from './exShEponIntEponOnuCtcOpt';
import {exCmdShEponInactiveOnu} from './exShEponInactiveOnu';
import {exCmdShowXponIntOnuOpt} from './exShXponIntOnuOpt';
import {exCmdShowInterfaceStatus} from './exShInterfaceStatus';
import {exCmdShEponActiveOnu} from './exShEponActiveOnu';
import {exCmdShVersion} from './exShowVersion';

dotenv.config();
const debug = Debug('ndce:exCron');
Debug.enable(process.env.DEBUG_MODE || 'false');

async function run() {
    await exCmdShVersion();
    await exCmdShowEponOnuInfoInterface();
    await exCmdShowEponIntEponOnuCtcOpt(1, 0, 1, 1);
    await exCmdShowEponIntEponOnuCtcOpt(2, 0, 1, 1);
    await exCmdShEponInactiveOnu();
    await exCmdShEponActiveOnu();
    await exCmdShowXponIntOnuOpt(0);
    await exCmdShowInterfaceStatus(0);
}

debug('start');
run()
    .catch((e) => {
        console.error(e);
    })
    .finally(() => {
        debug('end');
    });
