# Drug-counterfeiting project

Instructions
Commands to bootstrap the network(Terminal 1)
Go to the drug counterfeiting project using command:
 cd workspace/pharma-net/network 
Command to automatically create crypto-material and channel artifacts:
 ./fabricNetwork.sh generate


Command to automatically start docker containers, to create channel, to make peers join the channel and also update the anchor peers for each organisation:
./fabricNetwork.sh up


Log into the chaincode container using command(Terminal 2):
         docker exec -it chaincode /bin/bash
Command to download all  node.js smart contract dependencies:
 npm install 
Start the node.js smart contract using command:
 npm run start-man

 Command to install and instantiate the chaincode(Terminal 3):
 ./fabricNetwork.sh install 

Go to the application directory using command(Terminal 4):
 cd workspace/pharma-net/application 
Start the node.js smart application using command(update generated crypto-keys in key path required to add identity to wallet):
node .

Commands to run test collections:
Initiate postman and select collections using path
/home/neetu/workspace/pharma-net/test
Test Case 1: Initiation
Add a manufacturer with the following details: Name: ‘Sun Pharma’ CRN number: ‘MAN001’ Location: ‘Chennai’

Add a transporter with the following details: Name: ‘FedEx’ CRN number: ‘TRA001’ Location: ‘Delhi 
Add a transporter with the following details: Name: ‘Blue Dart’ CRN number: ‘TRA002’ Location: ‘Bangalore’

Add a distributor with the following details: Name: ‘VG Pharma’ CRN number: ‘DIST001’ Location: ‘Vizag’

Add a retailer with the following details: Name: ‘upgrad’ CRN number: ‘RET002’ Location: ‘Mumbai’

Add 4 strips of a drug named ‘Paracetamol’ with serial number starting from ‘001’ to ‘004’.




Test Case 2: Supply Chain.
Part a: Purchase Order raised by ‘VG Pharma’ to purchase 3 strips of paracetamol from ‘Sun Pharma’. 

Shipment created by ‘Sun Pharma’ in response to the raised purchase order. ‘FedEx’ acts as the transporter.

‘FedEx’ delivers the shipment to ‘VG pharma’.

Part b: Purchase Order raised by ‘upgrad’ to purchase 2 strips of paracetamol from ‘VG Pharma’.


Shipment created by ‘VG Pharma’ in response to the raised purchase order. ‘Blue Dart’ acts as the transporter.

‘Blue Dart’ delivers the shipment to ‘upgrad’.

Part c: A customer named ‘Akash’ with Aadhar Number 'AAD001' buys 1 paracetamol strip from the retailer ‘upgrad’.

Test Case 3: History Track Down
View the history of the drug named paracetamol serial no. 001. 

Check the current state of the drug named paracetamol , serial no. 001




