const fs = require("fs");
const OpenAI = require('openai');

var keys = fs.readFileSync('./secret.txt', 'utf8').split("\n");

var openais = [];

// console.log("Keys: ");
keys.forEach(key => {
  openais.push(new OpenAI({
    apiKey: key.trim(),
    baseURL: "https://api.aimlapi.com/v1"
  }));
//   console.log(`${key.trim()}`);
})
// console.log("");

async function createCompletion(messagesAi) {
  const completion = await openais[Math.floor(Math.random() * openais.length)].chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messagesAi,
    store: true,
  });

  return completion.choices[0].message;
}

module.exports = {
    createCompletion: createCompletion
}