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
 * @param devId device id, 0 - for all devices otherwise, only device with this id will be returned
 * @param enabled enabled flag, true - only enabled devices, false - all devices (enabled and disabled)
 */
export async function getNetworkDevices(prisma: PrismaClient, devId: number = 0, enabled: boolean = true): Promise<NetworkDevicesWithModelsAndCredentials[]> {
    const status = enabled ? {
        enabled: true
    } : {}
    let includeOptions = {
        where: {
            id: devId > 0 ? {
                equals: devId
            } : {
                gte: devId
            },
            ...status
        }
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