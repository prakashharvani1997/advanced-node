jest.setTimeout(80000);

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://prakashharvani:JyNEEIBvVKuEgKoH@cluster0.f1zaj.mongodb.net/blog_dev", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

afterAll(async () => {
  await mongoose.disconnect();
});
