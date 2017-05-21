var api = {
    bluetooth: null,
    genericAttributionProfile: null,
    enumeration: null,
    deviceWatcher: null,
    devices: new Array()
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
    var requestedProperties = ["System.Devices.Aep.DeviceAddress", "System.Devices.Aep.IsConnected"];
    api.deviceWatcher = Windows.Devices.Enumeration.DeviceInformation.createWatcher(
        'System.Devices.Aep.ProtocolId:="{bb7bb05e-5972-42b5-94fc-76eaa7084d49}"',
        null, //requestedProperties,
        Windows.Devices.Enumeration.DeviceInformationKind.associationEndpoint);

    api.deviceWatcher.addEventListener("added", deviceWatcherAdded);
    api.deviceWatcher.addEventListener("updated", deviceWatcherUpdated);
    api.deviceWatcher.addEventListener("removed", deviceWatcherRemoved);
    api.deviceWatcher.addEventListener("enumerationcompleted", deviceWatcherEnumerationCompleted);
    api.deviceWatcher.addEventListener("stopped", deviceWatcherStopped);

    api.deviceWatcher.start();
}

function deviceWatcherAdded(evt) {
    console.log("deviceWatcherAdded");
    // Add device information to devices array
    api.devices.push(evt.detail[0]);
    renderDataToDOM("id", evt.detail[0].id);
    renderDeviceConnectButtonToDOM(evt.detail[0].id);
    renderDataToDOM("name", evt.detail[0].name);
    renderDataToDOM("kind", evt.detail[0].kind);
    renderDataToDOM("Can Pair", evt.detail[0].pairing.canPair);
    renderDataToDOM("Protection Level", evt.detail[0].pairing.protectionLevel);
    //renderDataToDOM("Is Default", evt.detail[0].isDefault);
    //renderDataToDOM("Is Enabled", evt.detail[0].isEnabled);
}

function deviceWatcherUpdated(evt) {
    console.log("deviceWatcherUpdated");
}

function deviceWatcherRemoved(evt) {
    console.log("deviceWatcherRemoved");
}

function deviceWatcherEnumerationCompleted(evt) {
    console.log("deviceWatcherEnumerationCompleted");
}

function deviceWatcherStopped(evt) {
    console.log("deviceWatcherStopped");
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

function getGattServicesCompleted(obj) {

}

function getGattServicesError(obj) {

}