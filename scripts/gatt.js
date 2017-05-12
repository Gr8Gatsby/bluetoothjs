// Store Windows namespace objects
var bluetooth;
var genericAttributeProfile;
var enumeration;
var background;
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
var serviceProvider;

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
    var op2CharacteristicUuid = '760d4884-717e-4316-80f1-75235adb1d7a';
    var operatorCharacteristicUuid = 'f770790e-628b-410f-9b5c-39a6bd292b65';
    var resultCharacteristicUuid = '79586dd3-f6d7-48e0-945e-511d07dcca54';

    // Operand
    var gattOperandParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattOperandParameters.userDescription = "Operand Characteristic";
    gattOperandParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.write | genericAttributeProfile.GattCharacteristicProperties.writeWithoutResponse;
    gattOperandParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    // Operator
    var gattOperatorParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattOperatorParameters.userDescription = "Operator Characteristic";
    gattOperatorParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.write | genericAttributeProfile.GattCharacteristicProperties.writeWithoutResponse;
    gattOperatorParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    // Result
    var gattResultParameters = new genericAttributeProfile.GattLocalCharacteristicParameters();
    gattResultParameters.userDescription = "Result Characteristic";
    gattResultParameters.characteristicProperties = genericAttributeProfile.GattCharacteristicProperties.read | genericAttributeProfile.GattCharacteristicProperties.notify;
    gattResultParameters.writeProtectionLevel = genericAttributeProfile.GattProtectionLevel.plain;

    // Create Operand Characteristic for operand 1
    serviceProvider.service.createCharacteristicAsync(op1CharacteristicUuid, gattOperandParameters)
        .then(createCharateristicCompleted, createCharacteristicError)
        .done(function () {
            console.log("Promise is finished for createCharacteristic Async")
        });

    // Create Operand Characteristic for operand 2
    serviceProvider.service.createCharacteristicAsync(op2CharacteristicUuid, gattOperandParameters)
        .then(createCharateristicCompleted, createCharacteristicError)
        .done(function () {
            console.log("Promise is finished for createCharacteristic Async")
        });

    // Create Operand Characteristic for operator
    serviceProvider.service.createCharacteristicAsync(operatorCharacteristicUuid, gattOperatorParameters)
        .then(createCharateristicCompleted, createCharacteristicError)
        .done(function () {
            console.log("Promise is finished for createCharacteristic Async")
        });

    // Create an integer format
    var intFormat = genericAttributeProfile.GattPresentationFormat.fromParts(8, 0, 0, 0, 0);
    gattResultParameters.presentationFormats.append(intFormat);

    // Create Operand Characteristic for result
    serviceProvider.service.createCharacteristicAsync(resultCharacteristicUuid, gattResultParameters)
        .then(createCharateristicCompleted, createCharacteristicError)
        .done(function () {
            console.log("Promise is finished for createCharacteristic Async")
        });

    //GattServiceProviderAdvertisingParameters
    //serviceProvider
    var advParamters = new genericAttributeProfile.GattServiceProviderAdvertisingParameters();
    advParamters.isConnectable = peripheralSupported;
    advParamters.isDiscoverable = true;

    serviceProvider.addEventListener("advertisementstatuschanged", serviceProviderAdvertismentStatusChanged);
    serviceProvider.startAdvertising(advParamters);

}

function createCharateristicCompleted(result, params) {
    switch (result.characteristic.userDescription) {
        case "Operand Characteristic":
            if (result.characteristic.uuid == '20751f04-d067-4033-8352-24895943587d') {
                op1Characteristic = result.characteristic;
                op1Characteristic.addEventListener("writerequested", op1WriteRequested);
            } else if (result.characteristic.uuid == '760d4884-717e-4316-80f1-75235adb1d7a') {
                op2Characteristic = result.characteristic;
                op2Characteristic.addEventListener("writerequested", op2WriteRequested);
            }
            break;
        case "Operator Characteristic":
            operatorCharacteristic = result.characteristic;
            operatorCharacteristic.addEventListener("writerequested", operatorWriteRequested);
            break;
        case "Result Characteristic":
            resultCharacteristic = result.characteristic;
            resultCharacteristic.addEventListener("readrequested", resultReadRequested);
            resultCharacteristic.addEventListener("subscribedclientschanged", resultSubscribedClientsChanged);
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

function op1WriteRequested(obj) {

}

function op2WriteRequested(obj) {

}

function operatorWriteRequested(obj) {

}

function resultReadRequested(obj) {

}

function resultSubscribedClientsChanged(obj) {

}

function serviceProviderAdvertismentStatusChanged(obj) {

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