const readline = require('readline-sync');
const fs = require('fs');

const config = {};

const askQuestion = (question) => {
    return readline.question(question);
};

const askLimitedQuestion = (question, options) => {
    let answer = '';
    while (!options.includes(answer)) {
        answer = readline.question(`${question} (${options.join(', ')}): `);
        if (!options.includes(answer)) {
            console.log(`Invalid input. Please choose one of the following: ${options.join(', ')}`);
        }
    }
    return answer;
};

const setup = () => {
    config.environment = askLimitedQuestion('Enter environment', ['dev', 'prod']);
    config.ports = askQuestion('Enter ports to run the server on (comma separated, default=7764): ');
    config.proxy = askLimitedQuestion('Configure the proxy', ['uv', 'native']);
    config.httpmin = askLimitedQuestion('Include http-min', ["y", "n"]) === "y";
    if (config.ports === "") { config.ports = "7764"; }

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

    console.log('\nconfig.json contains:');
    console.log(`\tEnvironment: ${config.environment}`);
    console.log(`\tPorts: ${config.ports}`);
    console.log(`\tProxy: ${config.proxy}`);

    return config;
};

module.exports = { config: setup() };