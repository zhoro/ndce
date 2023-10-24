## About the project

This is a simple project to execute different commands on a remote network device using telnet.

## Supported devices

Supported devices:

- BDCOM OLTs

Supported BDCOM commands:

- enable
- show cpu
- show epon inactive onu
- show epon interface epon x/y:z onu ctc opt
- show epon onu information interface epon x/y
- show epon optical-transceiver-diagnostic interface epon x/y
- show mac-address-table dynamic
- show mac-address-table int x y/z:w

## Getting started

Create .env file with the following content:

```
DEBUG_MODE=ndce:main,ndce:network-device,ndce:telnet-transport
CLIENT_USERNAME=admin-x
CLIENT_PASSWORD=password-y
```

where CLIENT_USERNAME and CLIENT_PASSWORD are the credentials for the network device.

## Contact

email: ['andy@urlog.net'](mailto:andy@urlog.net)

project link: ['https://github.com/zhoro/ndce'](https://github.com/zhoro/ndce)

## License

Distributed under the MIT License. See `license.txt` for more information.
