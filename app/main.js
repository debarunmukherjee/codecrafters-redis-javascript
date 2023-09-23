const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
    connection.on("data", (data) => {
        const stringData = data.toString();
        console.log(stringData);
        if (stringData.startsWith("*2\\r\\n$4\\r\\nECHO\\r\\n")) {
            const stringRESP = stringData.substring("*2\\r\\n$4\\r\\nECHO\\r\\n".length, stringData.length)
            const len = stringRESP.substring(1, stringRESP.indexOf("\\r"));
            connection.write(stringRESP.substring(stringRESP.indexOf("n")+1, stringRESP.indexOf("n")+1+Number(len))+"\r\n");
        } else if (stringData.startsWith("*2\\r\\n$4\\r\\necho\\r\\n")) {
            const stringRESP = stringData.substring("*2\\r\\n$4\\r\\necho\\r\\n".length, stringData.length)
            const len = stringRESP.substring(1, stringRESP.indexOf("\\r"));
            connection.write(stringRESP.substring(stringRESP.indexOf("n")+1, stringRESP.indexOf("n")+1+Number(len))+"\r\n");
        } else {
            connection.write("+PONG\r\n");
        }
    })
});
// *2\r\n$4\r\necho\r\n$5\r\nworld\r\n
server.listen(6379, "127.0.0.1");
