import {PrismaClient} from "../../generated/prisma-client";

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

    try {
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
    } catch (e) {
        throw new Error(`Error getting network devices: ${e}`);
    }
}