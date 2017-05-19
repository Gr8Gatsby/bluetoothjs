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
    if (typeof background === 'undefined') { throw "Background does not exist."; }

    // BLE variables
    var bluetoothLEDevice = new Windows.Devices.Bluetooth.bluetoothLEDevice();
    var selectedCharacteristic = null;

    var registeredCharacteristic = null;
    var presentationFormat = null;
});