"use strict";

const {
  Contract
} = require("fabric-contract-api");

class ViewLifeCycle extends Contract {
  constructor() {
    // Provide a custom name to refer to this smart contract, view lifecycle.
    super("org.pharma-network.viewLifeCycle");
  }

  //All the custom functions are listed below

  // This is a basic user defined function used at the time of instantiating the smart contract
  // to print the success message on console

  async instantiate(ctx) {
    console.log("Pharmanet Chaincode is Instantiated");
  }

  //all custom fucntions

  /**
   * ViewHistory 
   * @param ctx - The transaction context object
   * @param drugName- Name of drug
   * @param serialNo- serial number of drug
   * @returns - Trnasaction history
   */
// This function is used to view the entire history of drug transaction
  async viewHistory(ctx, drugName, serialNo) {
    try {
      const productIDKey = ctx.stub.createCompositeKey(
        "org.pharma-network.productIDKey",
        [serialNo, drugName]
      );

      //getHistoryForKey() retrieves the history for a state by returning the set of stored values, including the transaction identifiers that performed the state update, allowing the transactions to be read from the blockchain.
      let transactionHistory = await ctx.stub.getHistoryForKey(productIDKey);
      let allDrugtransactions = [];
      while (true) {
        let res = await transactionHistory.next();
        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString("utf8"));

          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
          allDrugtransactions.push(jsonRes);
        }
        if (res.done) {
          console.log("end of data");
          await transactionHistory.close();
          console.info(allDrugtransactions);
          return allDrugtransactions;
        }
      }
    } catch (err) {
      return {
        error: "Invalid input parameters",
        errorTrace: err.toString()
      };
    }
  }

  /**
   *View drug current state 
   * @param ctx - The transaction context object
   * @param drugName- Name of drug
   * @param serialNo - Serial no. of drug
   * @returns - Drug object
   */
  // This function is used to view the current state of drug.
  async viewDrugCurrentState(ctx, drugName, serialNo) {
    try {
      const productIDKey = ctx.stub.createCompositeKey("org.pharma-network.productIDKey",[serialNo, drugName]
      );
      let data_Buffer = await ctx.stub
             .getState(productIDKey)
             .catch((err) => {console.log(err);
      });
      return JSON.parse(data_Buffer.toString());
    } catch (err) {
      return {
        error: "Invalid input parameters",
        errorTrace: err.toString()
      };
    }
  }
}
module.exports = ViewLifeCycle;