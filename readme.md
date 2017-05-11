## Bluetooth WinRT Sample

# Device Watcher
# GATT Server foreground (in progress)
# GATT Server background (not started)

## Description
This is an example project that shows how to intereact with the native Bluetooth APIs built into Windows from JavaScript. This repository will deploy code automatically to https://bluetoothjs.azurewebsites.net. Using Visual Studio you can create a [Hosted Web Application](https://developer.microsoft.com/en-us/windows/bridges/hosted-web-apps) that points to the azurewebsite URL. 

Within that project three things that need to be set in the package.appxmanifest file.

1. Application Tab -> Start Page set to: https://bluetoothjs.azurewebsites.net
2. Capabilities Tab -> Check the Bluetooth box
3. Content URIs Tab -> Add include rule for https://bluetoothjs.azurewebsites.net to access All WinRT.

