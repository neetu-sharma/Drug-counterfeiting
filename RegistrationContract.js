"use strict";

const {
  Contract
} = require("fabric-contract-api");

class RegistrationContract extends Contract {
  constructor() {
     // Provide a custom name to refer to this smart contract, registration
     super("org.pharma-network.registration");
  }
  //All the custom functions are listed below

  // This is a basic user defined function used at the time of instantiating the smart contract
  // to print the success message on console
  async instantiate(ctx) {
    console.log("Pharmanet Chaincode is Instantiated");
  }

  
  /**
   * Register company
   * @param ctx - The transaction context object
   * @param companyCRN - ID for company 
   * @param companyName - Name of the company 
   * @param location -  location of the company
   * @param organisationRole - This field will take follwing roles: Manufacturer,Distributor, Retailer and Transporter 
   * @returns - new company object 
   */
  // This function will be used to register new entities on the ledger. 
   
  async registerCompany(
    ctx,
    companyCRN,
    companyName,
    location,
    organisationRole
  ) {
    try {
      //To create composite key for companyid
      const companyIdKey = ctx.stub.createCompositeKey(
        "org.pharma-network.companyId",
        [companyCRN, companyName]
      );

      //To fetch the company details
      let fetchCompanyDetail = await ctx.stub
        .getState(companyIdKey)
        .catch((err) => console.log(err));

      //to check if a company is already exist
      try {

        let fetchCompanyData = JSON.parse(fetchCompanyDetail.toString());
        return {
          error: "Company already exist"
        };
      } catch (err) {
        let hierarchyKey;
        let newCompanyObject;
        if (
          organisationRole == "Manufacturer" ||
          organisationRole == "Distributor" ||
          organisationRole == "Retailer"
        ) {
          if (organisationRole == "Manufacturer") {
            hierarchyKey = 1;
          } else if (organisationRole == "Distributor") {
            hierarchyKey = 2;
          } else {
            hierarchyKey = 3;
          }

          newCompanyObject = {
            companyID: companyIdKey,
            name: companyName,
            location: location,
            organisationRole: organisationRole,
            hierarchyKey: hierarchyKey,
          };

          //No Hierarchy Key is required for Transporter 
        } else if (organisationRole == "Transporter") {
          newCompanyObject = {
            companyID: companyIdKey,
            name: companyName,
            location: location,
            organisationRole: organisationRole,
          };
        } else {
          return {
            error: "Invalid organization role"
          };
        }

        let dataBuffer = Buffer.from(JSON.stringify(newCompanyObject));
        console.log(newCompanyObject);
        await ctx.stub.putState(companyIdKey, dataBuffer);

        return newCompanyObject;
      }
    } catch (err) {
      return {
        error: "invalid input parameters.",
        errorTrace: err.toString()
      };
    }
  }
}
module.exports = RegistrationContract;