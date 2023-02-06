// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC1aac05ad237b3d8685e0431d4d6d88e8";
const authToken = "e0540b0b40597c01054d020d11c609c8";
const client = require("twilio")(accountSid, authToken);

// client.messages
//   .create({
//     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: "+15304643977",
//     to: "+84328896387",
//   })
//   .then((message) => console.log(message.sid));
function generatePassCode() {
  let passCode = "";
  for (let i = 0; i < 7; i++) {
    let number = Math.floor(10 * Math.random());
    passCode += number;
  }
  return passCode;
}

function sendPassCode(to, passCode) {
  customerPhone = "+84" + to.slice(1);
  client.messages
    .create({
      body: passCode,
      from: "+15304643977",
      to: customerPhone,
    })
    .then((message) => console.log(message.sid));
}

module.exports = { generatePassCode, sendPassCode };
