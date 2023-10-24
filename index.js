const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the Database!");
  })
  .catch((err) => {
    console.log("could not connect to MongoDB");
    console.log(err);
  });

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`App running on port ${process.env.PORT}`);
});