import {Prisma, PrismaClient} from "../../generated/prisma-client";

const includeDevicesWithModelsAndCredentials = {
    deviceModel: {
        include: {
            deviceType: true,
            vendor: true,
        },
    },
    deviceCredential: true,
};

const networkDevicesWithModelsAndCredentials =
    Prisma.validator<Prisma.NetworkDeviceDefaultArgs>()({include: includeDevicesWithModelsAndCredentials});

export type NetworkDevicesWithModelsAndCredentials = Prisma.NetworkDeviceGetPayload<typeof networkDevicesWithModelsAndCredentials>;

/***
 * Get all network devices from the database
 * @param prisma client instance
 * @param devId optional device id, default value is 0 for all devices
 */
export async function getNetworkDevices(prisma: PrismaClient, devId: number = 0) : Promise<NetworkDevicesWithModelsAndCredentials[]> {

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
            include: includeDevicesWithModelsAndCredentials,
            ...includeOptions
        });
    } catch (e) {
        throw new Error(`Error getting network devices: ${e}`);
    }
}