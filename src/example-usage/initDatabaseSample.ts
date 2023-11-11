import {PrismaClient} from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient()

async function main() {
    //search DeviceVendor
    let vendor;
    vendor = await prisma.deviceVendor.findUnique({
        where: {
            name: 'BDCOM'
        }
    });

    //add DeviceVendor
    if (!vendor) {
        try {
            const createVendor = await prisma.deviceVendor.create({
                data: {
                    name: 'BDCOM'
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
            type: 'olt'
        }
    });

    //add DeviceType
    if (!deviceType) {
        try {
            const createDeviceType = await prisma.deviceType.create({
                data: {
                    type: 'olt'
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
            name: 'general',
            vendorId: vendor.id,
            deviceTypeId: deviceType.id
        }
    });

    if (!deviceModel) {
        try {
            const createDeviceModel = await prisma.deviceModel.create({
                data: {
                    name: 'generic',
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
            accessIpAddressV4: '10.12.0.58',
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
                    accessIpAddressV4: '10.12.0.58',
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

