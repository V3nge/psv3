const { NodeSSH } = require('node-ssh');
const socketIo = require('socket.io');
const express = require('express');

module.exports.init = (app, server) => {
    const io = socketIo(server, {
        secure: true,  // Ensure it's using wss:// for WebSocket connections
    });
    app.use(express.json());

    let shell = null;  // Global variable to hold the shared shell session
    let ssh = null;    // Global variable to hold the shared SSH session

    // Handle incoming WebSocket connections
    io.on('connection', (socket) => {
        console.log('Client connected via WebSocket');

        socket.on('input', (data) => {
            console.log(`Received input from client: ${data}`);
            if (shell) {
                console.log('Sending input to SSH shell');
                shell.write(data); // Send the input to the SSH shell
            } else {
                console.log('Shell not ready yet');
            }
        });

        // When the client disconnects
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    app.post('/ssh/connect', async (req, res) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const { ip, port, username, password } = req.body;

        if (!ip || !port || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields: ip, port, username, or password' });
        }

        let shell;
        if (ssh) {
            return res.status(400).json({ error: 'SSH session already established' });
        }

        try {
            // Establish SSH connection
            ssh = new NodeSSH();
            await ssh.connect({
                host: ip,
                username: username,
                password: password,
                port: port || 22,
            });
            console.log('SSH Connection established');
            res.json({ status: 'connected' });

            // Create a shared shell session
            shell = await ssh.requestShell();
            console.log("Shell connected...");
            io.emit('output', 'Shell connected...\n');

            // Listen for incoming data from SSH session and broadcast to all clients
            shell.on('data', (data) => {
                io.emit('output', data.toString());
            });

            // When the shell exits, dispose the SSH connection
            shell.on('exit', () => {
                console.log('Shell exited');
                ssh.dispose();
                ssh = null;
                shell = null;
            });

        } catch (err) {
            console.error('SSH connection error:', err);
            res.status(500).send('Failed to connect');
        }
    });
};
