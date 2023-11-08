import {PrismaClient} from "@prisma/client";

/***
 * Get all network devices from the database
 * @param prisma client instance
 * @param devId optional device id, default value is 0 for all devices
 */
export async function getNetworkDevices(prisma: PrismaClient, devId: number = 0) {

    let includeOptions = {}
    const devices: number[] = []
    if (devId > 0) {
        devices.push(devId);
        includeOptions = {
            where: {
                id: {
                    in: devices
                }
            }
        };
    }

    return prisma.networkDevice.findMany({
        include: {
            deviceModel: {
                include: {
                    deviceType: true,
                    vendor: true
                }
            },
            deviceCredential: true
        },
        ...includeOptions
    });
}