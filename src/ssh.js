const { NodeSSH } = require('node-ssh');
const socketIo = require('socket.io');
const express = require('express');

module.exports.init = (app, server) => {
    const io = socketIo(server, {
        secure: true,  // Ensure it's using wss:// for WebSocket connections
    });
    app.use(express.json());

    app.post('/ssh/connect', async (req, res) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const { ip, port, username, password } = req.body;

        if (!ip || !port || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields: ip, port, username, or password' });
        }

        const ssh = new NodeSSH();
        
        try {
            // Establish SSH connection
            await ssh.connect({
                host: ip,
                username: username,
                password: password,
                port: port || 22,
            });
            console.log('SSH Connection established');
            res.json({ status: 'connected' });
            
            // Use the shell
            const shell = await ssh.requestShell();
            console.log("Shell connected...");
            io.emit('output', 'Shell connected...\n');
            
            // Listen for incoming data from SSH session
            shell.on('data', (data) => {
                io.emit('output', data.toString());
            });

            // Handle input from the client
            io.on('connection', (socket) => {
                socket.on('input', (data) => {
                    console.log(`Client input: ${data}`); // This should print the data
                    shell.write(data); // Send the data to the SSH shell
                });

                // When the shell exits, close the connection
                shell.on('exit', () => {
                    console.log('Shell exited');
                    ssh.dispose();
                });
            });
        } catch (err) {
            console.error('SSH connection error:', err);
            res.status(500).send('Failed to connect');
        }
    });
};
