const { Client } = require('ssh2');
const socketIo = require('socket.io');
const express = require('express');

module.exports.init = (app, server) => {
    const io = socketIo(server);
    app.use(express.json());

    app.post('/ssh/connect', (req, res) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const { ip, port, username, password } = req.body;

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

                io.emit('output', 'Recieved pty...\n');
            });

            session.on('shell', (accept, reject) => {
                const shell = accept();

                io.emit('output', 'Shell connected...\n');

                // Listen for incoming data from SSH session
                shell.on('data', (data) => {
                    // Emit the terminal output to all connected clients
                    console.log(`3:${data}`);
                    io.emit('output', data.toString());
                });

                // Handling client input (to send to the SSH shell)
                io.on('input', (data) => {
                    console.log(`4:${data}`);
                    shell.write(data);
                });

                // When the shell exits, close the connection
                shell.on('exit', () => {
                    conn.end();
                });
            });
        });
    });
};
