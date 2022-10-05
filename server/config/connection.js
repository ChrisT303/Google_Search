const mongoose = require("mongoose");
require("dotenv").config();

// added new database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/book_search",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;

// mongodb+srv://deftonechris:zarblat@cluster0.f3y28om.mongodb.net/book_search?retryWrites=true&w=majority
