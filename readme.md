## Bluetooth Windows Runtime (WinRT) Sample
1. Device Watcher (basic sample working)
2. GATT Server foreground (basic sample working) - Requires a device with Bluetooth 4.1 advertising a Gatt Service.
3. Bluetooth client (basic sample working)

## Description
This is an example project that shows how to intereact with the native Bluetooth APIs built into Windows from JavaScript. This repository will deploy code automatically to https://bluetoothjs.azurewebsites.net. Using Visual Studio you can create a [Hosted Web Application](https://developer.microsoft.com/en-us/windows/bridges/hosted-web-apps) that points to the azurewebsite URL. 

## Creating a Hosted Web Application
Within the Hosted Web App [Visual Studio](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15) project three things that need to be set in the package.appxmanifest file.

1. Application Tab -> Start Page set to: https://bluetoothjs.azurewebsites.net
2. Capabilities Tab -> Check the Bluetooth box
3. Content URIs Tab -> Add include rule for https://bluetoothjs.azurewebsites.net to access All WinRT (a.k.a. Windows Runtime APIs)