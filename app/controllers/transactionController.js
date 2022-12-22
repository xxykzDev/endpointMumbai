const { ethers } = require("ethers");
const CONTRACTADDRESS = "0x7C313Be3e72139B98125Fb08E06C51Fc5172a53f";
const CONTRACTABI = require("../ABI.json");
let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei

// PROVIDER PARA ACCEDER A READ/WRITE BLOCKCHAIN
const provider = new ethers.providers.JsonRpcProvider(
 `https://blissful-icy-breeze.matic-testnet.discover.quiknode.pro/748898f2a28277a78af5e4f13e696172a9b9fb61/`
);

const changeNumber = async (req, res) => {
 // creamos el signer
 const signer = new ethers.Wallet(req.body.private, provider);
 //  instanciamos el smart contract
 const contract = new ethers.Contract(CONTRACTADDRESS, CONTRACTABI, signer);
 //  hacemos un fetch de lectura(no modifica estado en blolckchain)
 const actualNumber = await contract.getNumber();
 console.log("The actualNumber is: " + actualNumber);
 //  creamos el try catch para enviar la trx
 try {
  // creamos la conexion signer - contract
  const xx = contract.connect(signer);
  // creamos la tx que ejecutara el metodo changeNumber de nuestro smart contract
  const tx = await xx.changeNumber(req.body.newNumber, {
   maxFeePerGas,
   maxPriorityFeePerGas,
  });
  // esperamos la ejecucion por parte de los nodos de nuestra operacion
  await tx.wait();
  console.log(tx);
  // guardamos el hash de nuestra transaccion
  const hash = tx.hash;
  console.log("minando trx");
  // cnstruimos la url para verificar en mumbai con nuestro hash
  console.log(`transaction hash: https://mumbai.polygonscan.com/tx/${tx.hash}`);
  const newNumber = await contract.getNumber();
  console.log("The newNumber is: " + newNumber);
  // chequeamos si esta confirmada nuestra trx
  const isTransactionMined = async () => {
   // nos fijamos que tenamos un receipt para nuestro hash
   const txReceipt = await provider.getTransactionReceipt(hash);
   if (txReceipt && txReceipt.blockNumber) {
    console.log("confirmations: ", txReceipt.confirmations);
    return txReceipt;
   }
  };
  isTransactionMined();
  // enviamos la respuesta del endpoint
  res.send({
   transactionLink: `https://mumbai.polygonscan.com/tx/${tx.hash}`,
   transactionData: tx,
  });
 } catch (error) {
  console.log(error);
 }
};

module.exports = {
 changeNumber,
};
