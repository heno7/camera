const User = require("./models/users.model");
require("./index");

(async () => {
  const sampleUser = new User({
    username: "test",
    email: "test",
    password: "test",
    phoneNumber: "0328896387",
    homeServer: {
      id: "123",
      domain: "testfirst.ddns.net",
    },
  });
  await sampleUser.save();
})();
