require("dotenv").config(); // to access process.env object
const express = require("express");
const mongoose = require("mongoose");

// express app
const app = express();

// middleware
app.use(express.json());  // to use request payload

app.get("/", (req, res) => {
  res.status(200).json({msg: "Success"})
})
// db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //* use 'npm run dev' to run the server
    app.listen(5000, () => {
      console.log("Listening on: http://localhost:5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
