import {PrismaClient} from '../generated/prisma-client';
import {getNetworkDevices} from '../core/utils/getNetworkDevices';

export async function getOnuInformation(
    prisma: PrismaClient,
    networkDeviceId: number = 0,
    boardNumber = 0,
    portNumber = 0,
    interfaceNumber = 0
) {
    // const prisma = new PrismaClient();
    const networkDevs = await getNetworkDevices(prisma, networkDeviceId);
    if (!networkDevs || networkDevs.length === 0) {
        throw new Error('Device not found');
    }
    let conf_id = {};

    if (networkDeviceId > 0) {
        conf_id = {
            networkDeviceId: networkDeviceId,
        };
    }

    if (boardNumber > 0) {
        conf_id = {
            ...conf_id,
            xponBoard: boardNumber,
        };
    }

    if (portNumber > 0) {
        conf_id = {
            ...conf_id,
            xponPort: portNumber,
        };
    }
    if (interfaceNumber > 0) {
        conf_id = {
            ...conf_id,
            xponInterface: interfaceNumber,
        };
    }

    return prisma.statOnuDevice.findMany({
        distinct: ['networkDeviceId', 'xponBoard', 'xponPort', 'xponInterface'],
        orderBy: [
            {createdAt: 'desc'},
            {xponBoard: 'asc'},
            {xponPort: 'asc'},
            {xponInterface: 'asc'},
            {networkDeviceId: 'asc'},
        ],
        where: {
            ...conf_id,
        },
    });
}
