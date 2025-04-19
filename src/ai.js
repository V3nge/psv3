const fs = require("fs");
const OpenAI = require('openai');

var keys;
if (fs.existsSync('./secret.txt')) {
  keys = fs.readFileSync('./secret.txt', 'utf8').split("\n");
  
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
} else {
  console.info("[AI.JS]: NOTE: NO secret.txt, insert keys with each ending with a newline. (please do not include blank lines)");
}

async function createCompletion(messagesAi) {
  if(keys == undefined) {
    return "";
  }

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