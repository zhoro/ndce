import {PrismaClient} from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient()

async function main() {
    //add DeviceVendor
    let vendor
    vendor = await prisma.deviceVendor.findUnique({
        where: {
            name: 'BDCOM'
        }
    });
    if (!vendor) {
        vendor = await prisma.deviceVendor.create({
            data: {
                name: 'BDCOM'
            }
        }).then(() => {
            console.log('DeviceVendor created');
        }).catch(e => {
            console.error(e);
        });
    } else {
        console.log('DeviceVendor already exists. Skipping...');
    }
    // add DeviceType
    let deviceType
    deviceType = await prisma.deviceType.findUnique({
        where: {
            type: 'olt'
        }
    });

    if (!deviceType) {
        //add DeviceType
        deviceType = await prisma.deviceType.create({
            data: {
                type: 'olt'
            }
        }).then(() => {
            console.log('DeviceType created:');
        }).catch(e => {
            console.error(e);
        });
    } else {
        console.log('DeviceType already exists. Skipping...');
    }
// add DeviceModel
    let deviceModel
    deviceModel = await prisma.deviceModel.findUnique({
        where: {
            name: 'general',
            vendorId: vendor.id,
            deviceTypeId: deviceType.id
        }
    });

    if (!deviceModel) {
        deviceModel = await prisma.deviceModel.create({
            data: {
                name: 'general',
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
        }).then(() => {
            console.log('DeviceModel created ');
        }).catch(e => {
            console.error(e);
        });
    } else {
        console.log('DeviceModel already exists. Skipping...');
    }

    // add DeviceCredential
    const username = process.env.CLIENT_USERNAME || "admin";
    const password = process.env.CLIENT_PASSWORD || "admin";
    let deviceCredential;
    deviceCredential = await prisma.deviceCredential.findUnique({
        where: {
            id: 1
        }
    });
    if (!deviceCredential) {
        deviceCredential = await prisma.deviceCredential.create({
            data: {
                username: username,
                password: password
            }
        }).then(() => {
            console.log('DeviceCredentials created ');
        }).catch(e => {
            console.error(e);
        });
    } else {
        console.log('DeviceCredentials already exists. Skipping...');
    }

    // add NetworkDevice
    let networkDevice;
    networkDevice = await prisma.networkDevice.findUnique({
        where: {
            accessIpAddressV4: '10.12.0.58',
        }
    });
    if (!networkDevice) {
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
                        id: 1
                    }
                }
            }
        }).then(() => {
            console.log('NetworkDevice created ');
        }).catch(e => {
            console.error(e);
        });
    }

}

main().then(() => {
    prisma.$disconnect();
}).catch(e => {
    console.error(e);
}).finally(() => {
    prisma.$disconnect();
    process.exit(0);
});

