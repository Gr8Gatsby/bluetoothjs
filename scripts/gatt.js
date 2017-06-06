var api = { // Object to store common references
    bluetooth: null,
    genericAttributionProfile: null,
    enumeration: null,
    deviceWatcher: null,
    devices: new Array(),
    services: new Array()
}
// Setup the API references, check for undefined namespaces, and check for the bluetooth adapter
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

    document.getElementById("reloadBtn").addEventListener("click", reload);
});
// Display the bluetooth support from the adapter
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
// Handle error from bluetooth adapter
function bluetoothAdapterFailed(error) {
    renderDataToDOM("Error", error);
}
// this function starts scanning for BlueTooth Devices
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
// Handle new bluetooth device being discovered
function deviceWatcherAdded(evt) {
    //console.log("deviceWatcherAdded");
    // Add device information to devices array
    api.devices.push(evt.detail[0]);
    // Show UI for device
    renderDataToDOM("----", "----");
    renderDataToDOM("name", evt.detail[0].name);
    renderDeviceConnectButtonToDOM(evt.detail[0].id);
    renderDataToDOM("id", evt.detail[0].id);
    renderDataToDOM("Signal Strength", evt.detail[0].properties['System.Devices.Aep.SignalStrength']);
    renderDataToDOM("Can Pair", evt.detail[0].pairing.canPair);
}

function deviceWatcherUpdated(evt) {
    
    //renderDataToDOM("updated", evt.detail[0].id);
    
    //console.log("deviceWatcherUpdated");
}

function deviceWatcherRemoved(evt) {

    renderDataToDOM("removed", evt.detail[0].id);

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
// add a connect button to the HTML DOM with a registered click callback
function renderDeviceConnectButtonToDOM(id) {
    var buttonElem = document.createElement("button");
    buttonElem.setAttribute("id", id);
    buttonElem.appendChild(document.createTextNode("Connect"));
    buttonElem.addEventListener('click', function () { connectToDevice(id); });
    document.body.appendChild(buttonElem);
}
// Handle connecting to a specific device
function connectToDevice(id) {
    var bluetoothLEDevice = api.bluetooth.BluetoothLEDevice.fromIdAsync(id)
        .then(deviceFromIdAsyncCompleted, deviceFromIdAsyncError)
        .done(console.log("Promise is finished for fromIdAsync"));
}
// Successful connection to device
function deviceFromIdAsyncCompleted(device) {
    if (device.getGattServicesAsync != 'undefined') {
        device.getGattServicesAsync(api.bluetooth.BluetoothCacheMode.uncached)
            .then(getGattServicesCompleted, getGattServicesError)
            .done(console.log("Promise is finised for getGattServicesAsync"));
    } else {
        console.log("No GattServices")
    }
}
// Error connecting to device
function deviceFromIdAsyncError(error) {
    //TODO: Error message
}
// Check for Gatt Services
async function getGattServicesCompleted({ services, status }) {
    if (status != 0) {
        return; // Status greater than zero is 
    }
    // Access Windows Runtime namespaces
    const {GenericAttributeProfile, BluetoothCacheMode} = api.bluetooth;
    for (let service of services) {                     // Iterate through services
        api.services.push(service);                     // Store reference to service
        const { characteristics } = await service.getCharacteristicsAsync(GenericAttributeProfile.GattSharingMode.exclusive)
        // interact with the characteristics
        for (let characteristic of characteristics) {   // Iterate through characteristics
            const { protocolError, value } = await characteristic.readValueAsync(BluetoothCacheMode.uncached)
            if (protocolError == 2) {                   // Handle common error
                console.log("Error: ReadNotPermitted");
            } else {                                    // Read values
                if (value.length > 0) {
                    let arr = new Uint8Array(value.length);
                    let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(value);
                    dataReader.readBytes(arr)
                    dataReader.close();
                }
                // Log value
                console.log("Value: " + value);
            }
        }
    }
}
// Handle GattServicesError
function getGattServicesError(obj) {
    //TODO: Error message
}

function reload(){
    document.location.reload(true);
}