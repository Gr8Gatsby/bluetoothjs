var bluetooth;
var genericAttributeProfile;
var enumeration;
var background;


document.addEventListener("DOMContentLoaded", function () {

    // Assign namespaces to shortcuts
    bluetooth = Windows.Devices.Bluetooth;
    genericAttributeProfile = Windows.Devices.Bluetooth.GenericAttributeProfile;
    enumeration = Windows.Devices.Enumeration;
    background = Windows.ApplicationModel.Background;

    // Throw error if object doesn't exist
    if (typeof bluetooth === 'undefined') { throw "Bluetooth does not exist."; }
    if (typeof genericAttributeProfile === 'undefined') { throw "GenericAttributeProfile does not exist."; }
    if (typeof enumeration === 'undefined') { throw "Enumeration does not exist."; }

    // BLE variables
    var bluetoothLEDevice = bluetooth.BluetoothLEDevice.fromIdAsync("BluetoothLE#BluetoothLEb4:ae:2b:d7:0b:ed-c6:0d:eq:54:a1:15")
        .then(deviceFromIdAsyncCompleted, deviceFromIdAsyncError)
        .done(console.log("Promise is finished for fromIdAsync"));

});

function deviceFromIdAsyncCompleted (device) {

}

function deviceFromIdAsyncError (error) {

}