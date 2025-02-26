const express = await import('express'); 
const { createProxyMiddleware } = await import('http-proxy-middleware'); 
const http = await import('http'); 
const https = await import('https'); 
const fs = await import('fs'); 
const path = await import('path'); 
const axios = await import('axios'); 
const WebSocket = await import('ws'); 
const net = await import('net'); 
const dgram = await import('dgram'); 
const { Resolver } = await import('dns2'); 
const SMTPServer = await import('smtp-server').SMTPServer; 
const FtpSrv = await import('ftp-srv'); 
const url = await import('url'); 
const { affixSlash, timedError, timedLog, certoptions } = await import('./shared'); 

const app = express(); 

const PORT = 7765;
const DNS_PORT = 53; 
const UDP_PORT = 9090; 
const TCP_PORT = 9091; 
const SMTP_PORT = 2525; 
const FTP_PORT = 2121; 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/sw.js', (req, res) => { 
    res.setHeader('Content-Type', 'application/javascript'); 
    res.send(`  
        self.addEventListener('fetch', event => { 
            const url = new URL(event.request.url); 
            if (!url.href.startsWith(location.origin)) { 
                const proxyUrl = \`${req.protocol}://${req.headers.host}/proxy?url=\${encodeURIComponent(url.href)}\`; 
                event.respondWith(fetch(proxyUrl, { method: event.request.method, headers: event.request.headers })); 
            } 
        }); 
    `); 
}); 

app.use('/proxy', async (req, res, next) => { 
    const targetUrl = req.query.url; 
    const proxyIp = req.query.proxy; 
    
    if (!targetUrl) { 
        return res.status(400).send('Missing URL parameter'); 
    } 
    
    if (proxyIp) { 
        return createProxyMiddleware({ 
            target: targetUrl, 
            changeOrigin: true, 
            agent: new http.Agent({ proxy: proxyIp }), 
        })(req, res, next); 
    } else { 
        try { 
            const response = await axios({ 
                method: req.method, 
                url: targetUrl, 
                headers: req.headers, 
                data: req.body, 
                responseType: 'stream', 
            }); 
            response.data.pipe(res); 
        } catch (error) { 
            res.status(500).send(`Request failed: ${error.message}`); 
        } 
    } 
}); 

const dnsServer = new Resolver(); 
dnsServer.serve(DNS_PORT); 
dnsServer.on('request', (request, response) => { 
    const domain = request.questions[0].name; 
    response.answers.push({ 
        name: domain, 
        type: 'A', 
        class: 'IN', 
        ttl: 300, 
        address: '8.8.8.8', 
    }); 
    response.send(); 
}); 
timedLog(`DNS Server running on port ${DNS_PORT}`, true); 

const tcpServer = net.createServer(socket => { 
    socket.once('data', data => { 
        const remoteSocket = net.createConnection({ host: 'example.com', port: 80 }); 
        socket.pipe(remoteSocket).pipe(socket); 
    }); 
}); 
tcpServer.listen(TCP_PORT, () => timedLog(`TCP Proxy listening on port ${TCP_PORT}`, true)); 

const udpServer = dgram.createSocket('udp4'); 
udpServer.on('message', (msg, rinfo) => { 
    timedLog(`UDP Message: ${msg}`, true); 
    udpServer.send(msg, rinfo.port, rinfo.address); 
}); 
udpServer.bind(UDP_PORT, () => timedLog(`UDP Proxy listening on port ${UDP_PORT}`, true)); 

const httpsServer = https.createServer(certoptions, app); 
httpsServer.listen(PORT, () => timedLog(`HTTPS Proxy running on port ${PORT}`, true)); 

const wsServer = new WebSocket.Server({ server: httpsServer, path: '/ws' }); 
wsServer.on('connection', ws => { 
    ws.on('message', message => ws.send(`Echo: ${message}`)); 
}); 
timedLog(`WebSocket Server (WSS) running on path /ws`, true); 

const smtpServer = new SMTPServer({ 
    onData(stream, session, callback) { 
        stream.pipe(process.stdout); 
        stream.on('end', callback); 
    } 
}); 
smtpServer.listen(SMTP_PORT, () => timedLog(`SMTP Proxy running on port ${SMTP_PORT}`, true)); 

const ftpServer = new FtpSrv({ 
    url: `ftp://0.0.0.0:${FTP_PORT}`, 
    anonymous: true 
}); 
ftpServer.on('login', ({ connection, username, password }, resolve, reject) => { 
    timedLog(`FTP Login: ${username}`, true); 
    resolve({ root: '/' }); 
}); 
ftpServer.listen().then(() => timedLog(`FTP Proxy running on port ${FTP_PORT}`, true)); 
