const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let config = {};

function askQuestionSync(question, callback) {
    rl.question(question, (answer) => {
        callback(answer);
    });
}

function askLimitedQuestionSync(question, options, callback) {
    function ask() {
        rl.question(`${question} (${options.join(', ')}): `, (answer) => {
            if (options.includes(answer)) {
                callback(answer);
            } else {
                console.log(`Invalid input. Please choose one of the following: ${options.join(', ')}`);
                ask();
            }
        });
    }
    ask();
}

function setupSync(callback) {
    askLimitedQuestionSync('Enter environment', ['dev', 'prod'], (env) => {
        config.environment = env;

        askQuestionSync('Enter ports to run the server on (comma separated, default=7764): ', (ports) => {
            config.ports = ports === "" ? "7764" : ports;

            askLimitedQuestionSync('Configure the proxy', ['uv', 'native'], (proxy) => {
                config.proxy = proxy;

                askLimitedQuestionSync('Include http-min', ["y", "n"], (httpmin) => {
                    config.httpmin = httpmin === "y";

                    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

                    console.log('\nconfig.json contains:');
                    console.log(`\tEnvironment: ${config.environment}`);
                    console.log(`\tPorts: ${config.ports}`);
                    console.log(`\tProxy: ${config.proxy}`);

                    rl.close();
                    callback(config);
                });
            });
        });
    });
}

let exportedConfig;
setupSync((result) => {
    exportedConfig = result;
});

module.exports = {
    config: exportedConfig,
    setup: () => {
        setupSync((result) => {
            exportedConfig = result;
            return result;
        });
        return exportedConfig;
    }
};