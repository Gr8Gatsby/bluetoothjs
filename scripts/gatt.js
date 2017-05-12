// Store Windows namespace objects
var bluetooth;
var genericAttributeProfile;
var enumeration;
var background;
var serviceProvider;
var core;
var foundation;
var streams;

// Global Variables
var op1Characteristic = null;
var op2Characteristic = null;
var resultCharacteristic = null;
var operand1 = 0;
var operand1 = 0;
var operator = 0;
var resultVal = 0;
var peripheralSupported = null;

// Wait for the DOM to finish loading
document.addEventListener("DOMContentLoaded", function () {
    // Assign namespaces to shortcuts
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

    // Create a Gatt Service
    genericAttributeProfile.GattServiceProvider.createAsync(uuid)
        .then(createServiceCompleted, createServiceError)
        .done(function () {
            console.log("Promise is finished for creating GattServiceProvider.");
        });

    // Create a Bluetooth Adapter
    bluetooth.BluetoothAdapter.getDefaultAsync()
        .then(bluetoothAdapterCompleted, bluetoothAdapterError)
        .done(function () {
            console.log("Promise is finished for Bluetooth Adapter getDefaultAsync()");
        });
});


//
// GattServiceProvider createAsync Completed
//
function createServiceCompleted(localService) {
    // TODO: implement 
    serviceProvider = localService.serviceProvider;
    var op1CharacteristicUuid = '20751f04-d067-4033-8352-24895943587d';
    var op2CharacteristicUuid ='760d4884-717e-4316-80f1-75235adb1d7a'
    var operatorCharacteristicUuid = 'f770790e-628b-410f-9b5c-39a6bd292b65';
    var resultCharacteristicUuid = '79586dd3-f6d7-48e0-945e-511d07dcca54';

    // Operand
    var gattOperandParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattOperandParameters.userDescription = "Operand Characteristic";
    gattOperandParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.write | genericAttributeProfile.GattCharacteristicProperties.writeWithoutResponse;
    gattOperandParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    // Operator
    var gattOperatorParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattOperatorParameters.userDescription = "Operator Charateristic";
    gattOperatorParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.write | genericAttributeProfile.GattCharacteristicProperties.writeWithoutResponse;
    gattOperatorParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    // Result
    var gattResultParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattResultParameters.userDescription = "Result Charateristic";
    gattResultParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.read | genericAttributeProfile.GattCharacteristicProperties.notify;
    gattResultParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    serviceProvider.service.createCharacteristicAsync(op1CharacteristicUuid, gattOperatorParameters)
        .then(createCharateristicCompleted, createCharacteristicError)
        .done();
    //addServiceCharacteristics();
}

function createCharateristicCompleted(result) {
    switch (result.characteristic.userDescription) {
        case "Operator Charateristic":
            op1Characteristic = result.characteristic;
            break;
        case "Operand Charateristic":

            break;
        case "Result Charateristic":

            break;
        default:
            console.log("ERROR: No Case Matched for createCharateristic!");

    }
  
}

function createCharacteristicError(result) {

}

//
// GattServiceProvider createAsync Error
//
function createServiceError(error) {
    throw "Error creating GattServiceProvider.";
}

//
// bluetoothAdapter createAsync Completed
//
function bluetoothAdapterCompleted(localAdapter) {

}

//
// bluetoothAdapter createAsync Error
//
function bluetoothAdapterError(error) {

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