const { Client } = require('ssh2');
const socketIo = require('socket.io');

module.exports.init = (app, server) => {
    const io = socketIo(server);

    app.use(express.json());

    app.post('/ssh/connect', (req, res) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const ip = req.body.ip;
        const port = req.body.port;
        const username = req.body.username;
        const password = req.body.password;

        if (!ip || !port || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields: ip, port, username, or password' });
        }

        const conn = new Client();
        conn.on('ready', () => {
            console.log('SSH Connection established');
            res.json({ status: 'connected' });
        }).on('error', (err) => {
            console.error('SSH connection error:', err);
            res.status(500).send('Failed to connect');
        }).connect({
            host: ip,
            port: port || 22,
            username: username,
            password: password,
        });

        conn.on('session', (accept, reject) => {
            const session = accept();
            session.on('pty', (accept, reject, info) => {
                accept();
            });

            session.on('shell', (accept, reject) => {
                const shell = accept();
                shell.on('data', (data) => {
                    io.emit('output', data.toString());
                });

                io.on('input', (data) => {
                    shell.write(data);
                });

                shell.on('exit', () => {
                    conn.end();
                });
            });
        });
    });
};
