## Bluetooth WinRT Sample

1. Device Watcher (basic sample working)
2. GATT Server foreground (in progress)
3. GATT Server background (not started)

## Description
This is an example project that shows how to intereact with the native Bluetooth APIs built into Windows from JavaScript. This repository will deploy code automatically to https://bluetoothjs.azurewebsites.net. Using Visual Studio you can create a [Hosted Web Application](https://developer.microsoft.com/en-us/windows/bridges/hosted-web-apps) that points to the azurewebsite URL. 

Within the Hosted Web App [Visual Studio](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15) project three things that need to be set in the package.appxmanifest file.

1. Application Tab -> Start Page set to: https://bluetoothjs.azurewebsites.net
2. Capabilities Tab -> Check the Bluetooth box
3. Content URIs Tab -> Add include rule for https://bluetoothjs.azurewebsites.net to access All WinRT (a.k.a. Windows Runtime API)