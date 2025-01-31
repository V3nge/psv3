const { NodeSSH } = require('node-ssh');
const socketIo = require('socket.io');
const express = require('express');

module.exports.init = (app, server) => {
    const io = socketIo(server, {
        secure: true,  // Ensure it's using wss:// for WebSocket connections
    });
    app.use(express.json());

    // Handle incoming WebSocket connections
    io.on('connection', (socket) => {
        // console.log('Client connected via WebSocket');

        let ssh = null;     // SSH session specific to this socket (client)
        let shell = null;   // Shell specific to this socket (client)

        socket.on('input', (data) => {
            // console.log(`Received input from client: ${data}`);
            if (shell) {
                // console.log('Sending input to SSH shell');
                shell.write(data); // Send the input to this client's SSH shell
            } else {
                // console.log('Shell not ready yet');
            }
        });

        // When the client disconnects
        socket.on('disconnect', () => {
            // console.log('Client disconnected');
            // Cleanup SSH session when the client disconnects
            if (shell) {
                shell.exit();
            }
            if (ssh) {
                ssh.dispose();
            }
        });

        // When the client requests to connect via SSH
        socket.on('ssh/connect', async (data) => {
            const { ip, port, username, password } = data;

            if (!ip || !port || !username || !password) {
                socket.emit('error', 'Missing required fields: ip, port, username, or password');
                return;
            }

            try {
                // Create a new SSH session for this client
                ssh = new NodeSSH();
                await ssh.connect({
                    host: ip,
                    username: username,
                    password: password,
                    port: port || 22,
                });
                // console.log(`SSH Connection established for client`);

                // Create a new shell session for this client
                shell = await ssh.requestShell();
                // console.log("Shell connected for client...");
                socket.emit('output', 'Shell connected...\n');

                // Listen for incoming data from SSH session and send to this client only
                shell.on('data', (data) => {
                    socket.emit('output', data.toString());
                });

                // When the shell exits, clean up the session
                shell.on('exit', () => {
                    // console.log('Shell exited for client');
                    ssh.dispose();
                    ssh = null;
                    shell = null;
                });

            } catch (err) {
                console.error('SSH connection error:', err);
                socket.emit('error', 'Failed to connect');
            }
        });
    });
};
