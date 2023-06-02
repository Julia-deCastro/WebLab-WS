const WebSocket = require('ws');

function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

let host = "";
let port = "";
let connect = false;

function onMessage(ws, data) {
  const parsedData = JSON.parse(data);
  console.log("🚀 ~ onMessage ~ parsedData:", parsedData);
  if (parsedData.c === "connection") {
    host = parsedData.host;
    port = parsedData.port;
    connect = true;
  }

if (connect) {
  const wsc = new WebSocket(`ws://${host}:${port}`);

  wsc.on('message', function message(data) {
    console.log('received from wsc: %s', data);
    ws.send(data.toString()); // Envie a mensagem recebida para o cliente ws
  });

  wsc.on('error', console.error);
    console.log(parsedData.c)
  if (parsedData.c === "env") {
  wsc.on('open', function open() {
    wsc.send(JSON.stringify({
      "c": 1
    }));
  });
}

if (parsedData.c === "stp") {
    wsc.on('open', function open() {
      wsc.send(JSON.stringify({
        "c": 0
      }));
    });
  }

  wsc.on('close', function close() {
    console.log('connection closed');
  });

  // Mantenha a troca de mensagens com o novo servidor em loop
  ws.on('message', function message(data) {
    wsc.send(data);
  });
}
}

function onConnection(ws, req) {
  ws.on('message', data => onMessage(ws, data));
  ws.on('error', error => onError(ws, error));
  console.log(`onConnection`);
}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server
  });

  wss.on('connection', onConnection);

  console.log(`App Web Socket Server is running!`);
  return wss;
}
