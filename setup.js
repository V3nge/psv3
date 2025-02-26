const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = {};

const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

const askLimitedQuestion = (question, options) => {
    let answer = '';
    while (!options.includes(answer)) {
        answer = rl.question(`${question} (${options.join(', ')}): `);
        if (!options.includes(answer)) {
            console.log(`Invalid input. Please choose one of the following: ${options.join(', ')}`);
        }
    }
    return answer;
};

const setup = () => {
    config.environment = askLimitedQuestion('Enter environment', ['dev', 'prod']);
    config.ports = rl.question('Enter ports to run the server on (comma separated, default=7764): ');
    config.proxy = askLimitedQuestion('Configure the proxy', ['uv', 'native']);
    config.httpmin = askLimitedQuestion('Include http-min', ["y", "n"]) == "y";
    if (config.ports == "") { config.ports = "7764"; }

    rl.close();

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

    console.log('\nconfig.json contains:');
    console.log(`\tEnvironment: ${config.environment}`);
    console.log(`\tPorts: ${config.ports}`);
    console.log(`\tProxy: ${config.proxy}`);

    return config;
};

module.exports = { config: setup() };
