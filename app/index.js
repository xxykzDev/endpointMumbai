const express = require("express");
const bodyParser = require("body-parser");
const v1TransactionRoute = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/transaction", v1TransactionRoute);

app.listen(PORT, () => {
 console.log(`🚀 Server listening on port ${PORT}`);
});
