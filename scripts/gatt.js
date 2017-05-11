// using objects
var bluetooth;
var genericAttributeProfile;
var enumeration;
var background;
var serviceProvider;
var core;
var foundation;
var streams;

document.addEventListener("DOMContentLoaded", function () {
    // Checking if the Windows Object exists
    bluetooth = Windows.Devices.Bluetooth;
    genericAttributeProfile = Windows.Devices.Bluetooth.GenericAttributeProfile;
    enumeration = Windows.Devices.Enumeration;
    background = Windows.ApplicationModel.Background;
    // from CS sample
    core = Windows.ApplicationModel.Core;
    foundation = Windows.Foundation;
    streams = Windows.Storage.Streams;

    // Throw error if object doesn't exist
    if (typeof bluetooth == 'undefined') {throw "Bluetooth does not exist.";}
    if (typeof genericAttributeProfile == 'undefined') {throw "GenericAttributeProfile does not exist.";}
    if (typeof enumeration == 'undefined') {throw "Enumeration does not exist.";}
    if (typeof background == 'undefined') {throw "Background does not exist.";}
    if (typeof core == 'undefined') { throw "Core does not exist"; }
    if (typeof foundation == 'undefined') { throw "Foundation does not exist"; }
    if (typeof streams == 'undefined') { throw "Streams does not exist"; }

    // Need to create a guid for the service
    var uuid = '386c51fd-6806-447f-9bac-f4d491cf3731'; // generated from: https://guidgenerator.com
    
    genericAttributeProfile.GattServiceProvider.createAsync(uuid)
        .then(createServiceCompleted, createServiceError)
        .done(function (obj) {
            console.log("Promise is finised for creating GattServiceProvider.");
        });
});

//
// GattServiceProvider createAsync callbacks
//
function createServiceCompleted(obj) {
    // TODO: implement 
    serviceProvider = obj.serviceProvider;
    
    addServiceCharacteristics();
}

function createServiceError(obj) {
    throw "Error creating GattServiceProvider.";
}

//
// GattServiceProvider Characteristics
//
function addServiceCharacteristics() {
    var uuid1 = '3c4a7acf-a710-45eb-a8a8-d8052b4d5a3f';

    var props = Windows.Devices.Bluetooth.GenericAttributeProfile.GattCharacteristicProperties;
    var gattProtectionLevel = Windows.Devices.Bluetooth.GenericAttributeProfile.GattProtectionLevel;
    props.read = gattProtectionLevel.plain;

    serviceProvider.service.createCharacteristicAsync(uuid1, props);
}

//
// enums
//

var calculatorCharacteristics = {
    "Operand1":1,
    "Operand2":2,
    "Operator":3
}

var calculatorOperators = {
    "Add":1,
    "Subtract":2,
    "Multiply":3,
    "Divide":4
}