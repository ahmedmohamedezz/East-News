require("dotenv").config(); // to access process.env object
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
// const crypto = require("crypto");

async function main() {
  // ONLY ONCE => generate jwt secret
  // const secret = crypto.randomBytes(64).toString("hex");
  // console.log(secret);

  // express app
  const app = express();

  // middleware
  app.use(express.json()); // to use request payload

  // routers
  app.use("/user", userRoutes);

  app.get("/", (req, res) => {
    res.status(200).json({ msg: "Success" });
  });

  try {
    await mongoose.connect(process.env.MONGO_URI);

    //* use 'npm run dev' to run the server
    app.listen(5000, () => {
      console.log("Listening on: http://localhost:5000");
    });
  } catch (error) {
    console.log(error);
  }
}

main();
