const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

map = {};

const server = net.createServer((connection) => {
    connection.on("data", (data) => {
        const stringData = data.toString();
        console.log(stringData)
        if (stringData.startsWith("*2\r\n$4\r\nECHO\r\n")) {
            const stringRESP = stringData.substring("*2\r\n$4\r\nECHO\r\n".length, stringData.length)
            connection.write(stringRESP);
        } else if (stringData.startsWith("*2\r\n$4\r\necho\r\n")) {
            const stringRESP = stringData.substring("*2\r\n$4\r\necho\r\n".length, stringData.length)
            connection.write(stringRESP);
        } else if (stringData.startsWith("*3\r\n$4\r\nSET\r\n")) {

        } else {
            connection.write("+PONG\r\n");
        }
    })
});
// *2\r\n$4\r\necho\r\n$5\r\nworld\r\n
server.listen(6379, "127.0.0.1");
