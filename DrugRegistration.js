"use strict";

const {
    Contract
} = require("fabric-contract-api");

class DrugRegistrationContract extends Contract {
    //constructor to provide a name to the Smartcontract 
    constructor() {
       // Provide a custom name to refer to this smart contract, drug registration
  super("org.pharma-network.drugRegistration");
    }

    /* ****** All custom functions are defined below ***** */

    // This is a basic user defined function used at the time of instantiating the smart contract
    // to print the success message on console

    async instantiate(ctx) {
        console.log("Pharmanet Chaincode is Instantiated");
    }

  /**
     * Add drug
     * @param ctx - The transaction context object
     * @param drugName - Name of the drug
     * @param serialNo - drug serial no.
     * @param mfgDate - drug manufacturing date
     * @param expDate - drug expiry date
     * @param companyCRN - company CRN
     * @returns - new drug object 
     */
// This function is used by any organisation registered as a ‘manufacturer’ to register a new drug on the ledger
  
    async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {
        try {
            if (ctx.clientIdentity.getMSPID() != "manufacturerMSP") {
                return {
                    error: "Manufacturer Org can only add drugs on the pharma-network"
                };
            }
            //To create composite key for storing drug asset
            const productIDKey = ctx.stub.createCompositeKey(
                "org.pharma-network.productIDKey",
                [serialNo, drugName]
            );
            //To fetch manufacturer details 
            let manufacturerCompKey = await ctx.stub.getStateByPartialCompositeKey(
                "org.pharma-network.companyId",
                [companyCRN]
            );
            //To get the manufacturer Key from partial composite key using key.value.key 
            let manuKey = await manufacturerCompKey.next();

            let newDrugObj = {
                productID: productIDKey,
                name: drugName,
                manufacturer: manuKey.value.key,
                manufacturingDate: mfgDate,

                expiryDate: expDate,
                owner: manuKey.value.key,
                shipment: "",
            };

            let dataBuffer = Buffer.from(JSON.stringify(newDrugObj));
            //storing the new drug object on the ledger 
            await ctx.stub.putState(productIDKey, dataBuffer);
            return newDrugObj;

        } catch (err) {
            return {
                error: "Invalid input parameters",
                errorTrace: err.toString()
            };
        }

    }
}
module.exports = DrugRegistrationContract;