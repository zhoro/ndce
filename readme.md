## About the project

This is a simple project to execute different commands on a remote network devices using telnet protocol.
Stores the results in a database.

## Supported devices

Supported devices:

- BDCOM OLT: `GP3600-08B`, `P3310C`, `P3310D`, `P3600-08E`, `P3600-16E`, `P3608`, `P3608-2TE`, `P3608B-08E`, `P3616-2TE`

Supported BDCOM commands:

- enable
- show cpu
- show version
- show epon|gpon active onu
- show epon|gpon inactive onu
- show epon|gpon interface epon x/y:z onu ctc opt
- show epon|gpon onu information interface epon x/y
- show epon|gpon optical-transceiver-diagnostic interface epon x/y
- show mac-address-table dynamic
- show mac-address-table int x y/z:w
- show int status x/y:z
- clear mib (clear counters)
- clear mac-address-table dynamic

New commands can be easily added by extending the `src/code/devices` modules.

## Getting started

Create .env file with the following content:

```
DEBUG_MODE=ndce:main,ndce:network-device,ndce:telnet-transport,ndce:exShEponOnuInfoInterface
CLIENT_USERNAME=admin-x
CLIENT_PASSWORD=password-y
```

Where CLIENT_USERNAME and CLIENT_PASSWORD are the default credentials for the network device.
Also set the following DB environment variables (example for postgresql):

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Apply migrations:

```
npx prisma migrate deploy --schema=./node_modules/@zhoro/ndce/prisma/schema.prisma
```

In your code import the PrismaClient class and create an instance of it:

```
import {PrismaClient} from '@zhoro/ndce';
const prisma = new PrismaClient();

```

For more information about Prisma setup environment see [here](https://pris.ly/d/getting-started).

## Usage

- `initDatabaseSample.ts` - example how to initialize or fill the database with sample data
- `start.ts` - sample commands execution
- `exCron.ts` - sample cron job execution
- `ex*` - examples for different commands

## Contact

email: ['andy@urlog.net'](mailto:andy@urlog.net)

project link: ['https://github.com/zhoro/ndce'](https://github.com/zhoro/ndce)

## License

Distributed under the MIT License. See `license.txt` for more information.
