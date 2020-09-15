const mongoose = require("mongoose");
const db = process.env.MONGO_DB;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...\n");
  } catch (err) {
    console.log(err.massage);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
