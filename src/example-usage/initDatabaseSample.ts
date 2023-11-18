import {PrismaClient} from '../generated/prisma-client';

const prisma = new PrismaClient()

const vendorName = 'BDCOM';
const deviceTypeValue = 'olt';
const deviceModelValue = 'generic';
const deviceIpAddressV4 = '10.12.0.58';

async function main() {
    //search DeviceVendor
    let vendor;
    vendor = await prisma.deviceVendor.findUnique({
        where: {
            name: vendorName
        }
    });

    //add DeviceVendor
    if (!vendor) {
        try {
            const createVendor = await prisma.deviceVendor.create({
                data: {
                    name: vendorName
                }
            })
            console.log('DeviceVendor created');
            vendor = createVendor;
        } catch (e) {
            throw new Error('Error creating DeviceVendor');
        }

    } else {
        console.log('DeviceVendor already exists. Skipping...');
    }

    //search DeviceType
    let deviceType
    deviceType = await prisma.deviceType.findUnique({
        where: {
            type: deviceTypeValue
        }
    });

    //add DeviceType
    if (!deviceType) {
        try {
            const createDeviceType = await prisma.deviceType.create({
                data: {
                    type: deviceTypeValue
                }
            });
            console.log('DeviceType created');
            deviceType = createDeviceType;
        } catch (e) {
            throw new Error('Error creating DeviceType');
        }

    } else {
        console.log('DeviceType already exists. Skipping...');
    }

    //search DeviceModel
    let deviceModel
    deviceModel = await prisma.deviceModel.findUnique({
        where: {
            name: deviceModelValue,
            vendorId: vendor.id,
            deviceTypeId: deviceType.id
        }
    });

    if (!deviceModel) {
        try {
            const createDeviceModel = await prisma.deviceModel.create({
                data: {
                    name: deviceModelValue,
                    vendor: {
                        connect: {
                            id: vendor.id
                        }
                    },
                    deviceType: {
                        connect: {
                            id: deviceType.id
                        }
                    }
                }
            });
            console.log('DeviceModel created');
            deviceModel = createDeviceModel;
        } catch (e) {
            throw new Error('Error creating DeviceModel');
        }
    } else {
        console.log('DeviceModel already exists. Skipping...');
    }

    //search DeviceCredential
    const username = process.env.CLIENT_USERNAME || "admin";
    const password = process.env.CLIENT_PASSWORD || "admin";
    let deviceCredential;
    deviceCredential = await prisma.deviceCredential.findUnique({
        where: {
            id: 1
        }
    });

    //add DeviceCredential
    if (!deviceCredential) {
        try {
            const createDeviceCredential = await prisma.deviceCredential.create({
                data: {
                    username: username,
                    password: password
                }
            });
            console.log('DeviceCredential created');
            deviceCredential = createDeviceCredential;
        } catch (e) {
            throw new Error('Error creating DeviceCredential');
        }
    } else {
        console.log('DeviceCredentials already exists. Skipping...');
    }

    //search NetworkDevice
    let networkDevice;
    networkDevice = await prisma.networkDevice.findUnique({
        where: {
            accessIpAddressV4: deviceIpAddressV4,
        }
    });
    //add NetworkDevice
    if (!networkDevice) {
        try {
            networkDevice = await prisma.networkDevice.create({
                data: {
                    deviceModel: {
                        connect: {
                            id: deviceModel.id
                        }
                    },
                    accessIpAddressV4: deviceIpAddressV4,
                    accessPort: '23',
                    accessType: 'telnet',
                    deviceCredential: {
                        connect: {
                            id: deviceCredential.id
                        }
                    }
                }
            });
            console.log('NetworkDevice created');
        } catch (e) {
            throw new Error('Error creating NetworkDevice');
        }
    } else {
        console.log('NetworkDevice already exists. Skipping...');
    }
}

main().catch(e => {
    console.error(e);
}).finally(() => {
    prisma.$disconnect();
    process.exit(0);
});

