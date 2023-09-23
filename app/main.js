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
        } else if (stringData.startsWith("*3\r\n$3\r\nset\r\n")) {
            const stringResp = stringData.substring("*2\r\n$4\r\necho\r\n".length, stringData.length)
            const keyLen = stringResp.substring(1, stringResp.indexOf("\r"));
            const key = stringResp.substring(stringResp.indexOf("\n")+1, stringResp.indexOf("n")+1+Number(keyLen));
            const valueResp = stringResp.substring(stringResp.indexOf("n")+1+Number(keyLen)+2);
            const valueLen = valueResp.substring(1, stringResp.indexOf("\r"));
            const value = valueResp.substring(valueResp.indexOf("\n")+1, valueResp.indexOf("n")+1+Number(valueLen));
            console.log(key)
            console.log(value)
            map[key] = value;
            connection.write("+OK\r\n");
        } else {
            connection.write("+PONG\r\n");
        }
    })
});
// *2\r\n$4\r\necho\r\n$5\r\nworld\r\n
server.listen(6379, "127.0.0.1");
