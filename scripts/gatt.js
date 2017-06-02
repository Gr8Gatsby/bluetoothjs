var api = {
    bluetooth: null,
    genericAttributionProfile: null,
    enumeration: null,
    deviceWatcher: null,
    devices: new Array(),
    services: new Array()
}

document.addEventListener("DOMContentLoaded", function () {
    api.bluetooth = Windows.Devices.Bluetooth;
    api.genericAttributionProfile = Windows.Devices.Bluetooth.GenericAttributeProfile;
    api.enumeration = Windows.Devices.Enumeration;
    api.deviceWatcher = Windows.Devices.Enumeration.DeviceWatcher;

    if (typeof api.bluetooth === 'undefined') { throw "app.bluetooth is undefined"; }
    if (typeof api.genericAttributionProfile === 'undefined') { throw "app.genericAttributionProfile is undefined"; }
    if (typeof api.enumeration === 'undefined') { throw "app.enumeration is undefined"; }
    if (typeof api.deviceWatcher === 'undefined') { throw "app.deviceWatcher is undefined"; }

    api.devices = new Array();
    api.bluetooth.BluetoothAdapter.getDefaultAsync()
        .then(bluetoothAdapterCreated, bluetoothAdapterFailed);
});

function bluetoothAdapterCreated(adapter) {
    renderDataToDOM("Bluetooth Address", adapter.bluetoothAddress);
    renderDataToDOM("DeviceID", adapter.deviceId);
    renderDataToDOM("Is Advertisement Offload Supported", adapter.isAdvertisementOffloadSupported);
    renderDataToDOM("Is Peripheral Role Supported", adapter.isPeripheralRoleSupported);
    renderDataToDOM("Is Low Energy Supported", adapter.isLowEnergySupported);
    renderDataToDOM("Is Central Role Supported", adapter.isCentralRoleSupported);
    renderDataToDOM("Is Classis Supported", adapter.isClassicSupported);

    // start a device watcher
    startDeviceWatcher();
}

function bluetoothAdapterFailed(error) {
    renderDataToDOM("Error", error);
}

function startDeviceWatcher() {
    var requestedProperties = ["System.Devices.Aep.DeviceAddress", "System.Devices.Aep.IsConnected","System.Devices.Aep.SignalStrength"];
    api.deviceWatcher = Windows.Devices.Enumeration.DeviceInformation.createWatcher(
        'System.Devices.Aep.ProtocolId:="{bb7bb05e-5972-42b5-94fc-76eaa7084d49}"',
        requestedProperties,
        Windows.Devices.Enumeration.DeviceInformationKind.associationEndpoint);

    api.deviceWatcher.addEventListener("added", deviceWatcherAdded);
    api.deviceWatcher.addEventListener("updated", deviceWatcherUpdated);
    api.deviceWatcher.addEventListener("removed", deviceWatcherRemoved);
    api.deviceWatcher.addEventListener("enumerationcompleted", deviceWatcherEnumerationCompleted);
    api.deviceWatcher.addEventListener("stopped", deviceWatcherStopped);

    api.deviceWatcher.start();
}

function deviceWatcherAdded(evt) {
    //console.log("deviceWatcherAdded");
    // Add device information to devices array
    api.devices.push(evt.detail[0]);
    if (evt.detail[0].name === "Tesla") {
        renderDataToDOM("----", "----");
        renderDataToDOM("name", evt.detail[0].name);
        renderDeviceConnectButtonToDOM(evt.detail[0].id);
        renderDataToDOM("id", evt.detail[0].id);
        renderDataToDOM("Signal Strength", evt.detail[0].properties['System.Devices.Aep.SignalStrength']);
        renderDataToDOM("Can Pair", evt.detail[0].pairing.canPair);
        //renderDataToDOM("kind", evt.detail[0].kind);
        //renderDataToDOM("Protection Level", evt.detail[0].pairing.protectionLevel);
        //renderDataToDOM("Is Default", evt.detail[0].isDefault);
        //renderDataToDOM("Is Enabled", evt.detail[0].isEnabled);

        evt.detail[0].getGlyphThumbnailAsync()
            .then(glyphCompleted, glyphError)
    }
}

function glyphCompleted(image) {
    if (image.size > 0) {
        //TODO get image
    }
}

function glyphError(obj) {

}

function deviceWatcherUpdated(evt) {
    if (evt.detail[0].name === "Tesla") {
        renderDataToDOM("updated", evt.detail[0].id);
    }
    //console.log("deviceWatcherUpdated");
}

function deviceWatcherRemoved(evt) {
    if (evt.detail[0].name === "Tesla") {
        renderDataToDOM("removed", evt.detail[0].id);
    }
    //console.log("deviceWatcherRemoved");
}

function deviceWatcherEnumerationCompleted(evt) {
    console.log("deviceWatcherEnumerationCompleted");
    console.log(api.devices);
}

function deviceWatcherStopped(evt) {
    //console.log("deviceWatcherStopped");
}

// Helper function to display data
function renderDataToDOM(label, text) {
    var infoElem = document.createElement("div");
    infoElem.setAttribute("class", "labelContainer");
    var labelElem = document.createElement("span");
    var textElem = document.createElement("span");

    labelElem.setAttribute("class", "label");

    var labelElemText = document.createTextNode(label + ":");
    var textElemText = document.createTextNode(text);
    labelElem.appendChild(labelElemText);
    textElem.appendChild(textElemText);
    infoElem.appendChild(labelElem);
    infoElem.appendChild(textElem);
    document.body.appendChild(infoElem);
}

function renderDeviceConnectButtonToDOM(id) {

    var buttonElem = document.createElement("button");
    buttonElem.setAttribute("id", id);
    buttonElem.appendChild(document.createTextNode("Connect"));
    buttonElem.addEventListener('click', function () { connectToDevice(id); });
    document.body.appendChild(buttonElem);
}

function connectToDevice(id) {
    var bluetoothLEDevice = api.bluetooth.BluetoothLEDevice.fromIdAsync(id)
        .then(deviceFromIdAsyncCompleted, deviceFromIdAsyncError)
        .done(console.log("Promise is finished for fromIdAsync"));
}

function deviceFromIdAsyncCompleted(device) {
    device.getGattServicesAsync(api.bluetooth.BluetoothCacheMode.uncached)
        .then(getGattServicesCompleted, getGattServicesError)
        .done(console.log("Promise is finised for getGattServicesAsync"));
}

function deviceFromIdAsyncError(error) {

}

function getGattServicesCompleted(service) {
    if (service.status == 0) {
        
        if (service.services.length > 0) {
            for (i = 0; i < service.services.length; i++) {
                api.services.push(service.services[i]);
                console.log("Opening " + service.services[i]);
                service.services[i].getCharacteristicsAsync(api.bluetooth.GenericAttributeProfile.GattSharingMode.exclusive)
                    .then(function (characteristic) {
                        for (i = 0; i < characteristic.characteristics.length; i++) {
                            characteristic.characteristics[i].readValueAsync(api.bluetooth.BluetoothCacheMode.uncached)
                                .then(function (value) {
                                    if (value.protocolError == 2) {
                                        console.log("Error: ReadNotPermitted");
                                    } else {
                                        console.log("Value: " + value.value);
                                    }
                                })
                        }
                    }, function (error) {

                    }) 
                
                    //.openAsync(api.bluetooth.GenericAttributeProfile.GattSharingMode.sharedReadOnly)
                    //.then(function (gattServiceOpenAsyncCompleted, gattServiceOpenAsyncError) {
                    //    if (gattServiceOpenAsyncCompleted == 1) {

                    //    }
                    //})
                    //.done(console.log("Promise for gattSerivceOpenAsync is finished"))
            }
        } else {
            console.log("GattService: No services available");
        }
    } else {
        //TODO:?
    }
}

function getGattServicesError(obj) {

}

function gattServiceOpenAsyncCompleted(connection) {

}

function gattServiceOpenAsyncError(obj) {

}