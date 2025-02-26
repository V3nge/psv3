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
    return new Promise(async (resolve) => {
        let answer = '';
        while (!options.includes(answer)) {
            answer = await askQuestion(`${question} (${options.join(', ')}): `);
            if (!options.includes(answer)) {
                console.log(`Invalid input. Please choose one of the following: ${options.join(', ')}`);
            }
        }
        resolve(answer);
    });
};

const setup = async () => {
    config.environment = await askLimitedQuestion('Enter environment', ['dev', 'prod']);
    config.ports = await askQuestion('Enter ports to run the server on (comma separated, default=7764): ');
    config.proxy = await askLimitedQuestion('Configure the proxy', ['uv', 'native']);
    config.httpmin = await askLimitedQuestion('Include http-min', ["y", "n"]) === "y";
    if (config.ports === "") { config.ports = "7764"; }

    rl.close();

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

    console.log('\nconfig.json contains:');
    console.log(`\tEnvironment: ${config.environment}`);
    console.log(`\tPorts: ${config.ports}`);
    console.log(`\tProxy: ${config.proxy}`);

    return config;
};

setup();
