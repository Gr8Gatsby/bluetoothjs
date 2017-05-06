//var bt = Windows.Devices.Bluetooth;
//var deviceWatcher = Windows.Devices.Enumeration.DeviceWatcher;
var deviceWatcher = null;
var devices = new Array();

// Check for the Windows namespace
if (typeof Windows !== 'undefined') {
    // The Windows APIs are projected in the DOM
}
document.addEventListener("DOMContentLoaded", function () {
    // Setup initial page state
    document.getElementById("enumerateBtn").addEventListener("click", handleEnumerateBtnClick);
    document.getElementById("reloadBtn").addEventListener("click", reload);
    hideloader();
    deviceWatcher = null;
});

function handleEnumerateBtnClick(evt) {
    console.log("enumerateBtnClick occured");
    // Check for Windows namespace
    if (typeof Windows !== 'undefined') {
        if (deviceWatcher == null) {
            deviceWatcher = Windows.Devices.Enumeration.DeviceWatcher;
            startBleDeviceWatcher();
        } else {
            
        }
    } else {
        console.log("Windows namespace is not defined")
    }
}


function startBleDeviceWatcher() {
    document.getElementById("enumerateBtnClick").innerHTML = "Scanning...";
    requestedProperties = ["System.Devices.Aep.DeviceAddress", "System.Devices.Aep.IsConnected"];
    deviceWatcher = Windows.Devices.Enumeration.DeviceInformation.createWatcher(
        'System.Devices.Aep.ProtocolId:="{bb7bb05e-5972-42b5-94fc-76eaa7084d49}"',
        requestedProperties,
        Windows.Devices.Enumeration.DeviceInformationKind.associationEndpoint);

    deviceWatcher.addEventListener("added", deviceWatcherAdded);
    deviceWatcher.addEventListener("updated", deviceWatcherUpdated);
    deviceWatcher.addEventListener("removed", deviceWatcherRemoved);
    deviceWatcher.addEventListener("enumerationcompleted", deviceWatcherEnumerationCompleted);
    deviceWatcher.addEventListener("stopped", deviceWatcherStopped);

    showloader();
    deviceWatcher.start();
}

function deviceWatcherAdded(evt) {
    console.log("deviceWatcherAdded");
    // Add device information to devices array
    devices.push(evt.detail[0]);
    document.getElementById("found").innerHTML = (devices.length);
    displayDevices();
}

function deviceWatcherUpdated(evt) {
    console.log("deviceWatcherUpdated");
}

function deviceWatcherRemoved(evt) {
    console.log("deviceWatcherRemoved");
}

function deviceWatcherEnumerationCompleted(evt) {
    console.log("deviceWatcherEnumerationCompleted");
    document.getElementById("enumerateBtnClick").innerHTML = "Start scan";
    displayDevices();
}

function deviceWatcherStopped(evt) {
    console.log("deviceWatcherStopped");
}

function displayDevices() {
    hideloader();
    var deviceAnchorElement = document.getElementById("devices");
    deviceAnchorElement.innerHTML = "";
    for (var i = 0; i < devices.length; i++) {
        var deviceDiv = document.createElement("div");
        var id = document.createAttribute("id");
        id.value = devices[i].id;
        var t = document.createTextNode(devices[i].name);
        deviceDiv.setAttributeNode(id);
        deviceDiv.appendChild(t);
        deviceAnchorElement.appendChild(deviceDiv);
    }
}

function hideloader(){
    document.getElementById("loader").style.display = 'none';
}

function showloader(){
    document.getElementById("loader").style.display = 'block';
}

function reload(){
    document.location.reload(true);
}