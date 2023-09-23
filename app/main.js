const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

map = {};

const nthIndex = (str, pat, n) => {
    const L= str.length;
    let i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

const server = net.createServer((connection) => {
    connection.on("data", (data) => {
        const stringData = data.toString();
        if (stringData.startsWith("*2\r\n$4\r\nECHO\r\n")) {
            const stringRESP = stringData.substring("*2\r\n$4\r\nECHO\r\n".length, stringData.length)
            connection.write(stringRESP);
        } else if (stringData.startsWith("*2\r\n$4\r\necho\r\n")) {
            const stringRESP = stringData.substring("*2\r\n$4\r\necho\r\n".length, stringData.length)
            connection.write(stringRESP);
        } else if (stringData.startsWith("*3\r\n$3\r\nset\r\n")) {
            const stringResp = stringData.substring("*3\r\n$3\r\nset\r\n".length, stringData.length)
            const keyLen = stringResp.substring(1, stringResp.indexOf("\r"));
            const key = stringResp.substring(stringResp.indexOf("\n")+1, stringResp.indexOf("\n")+1+Number(keyLen));

            const valueResp = stringResp.substring(stringResp.indexOf("\n")+1+Number(keyLen)+2, stringResp.length);
            const valueLen = valueResp.substring(1, stringResp.indexOf("\r"));
            const value = valueResp.substring(valueResp.indexOf("\n") + 1, valueResp.indexOf("\n") + 1 + Number(valueLen));

            map[key] = {
                value: value,
                expiryInfo: {
                    setTime: Date.now(),
                    expiresIn: null
                }
            };

            connection.write("+OK\r\n");
        } else if (stringData.startsWith("*2\r\n$3\r\nget\r\n")) {
            const stringResp = stringData.substring("*2\r\n$3\r\nget\r\n".length, stringData.length)
            const keyLen = stringResp.substring(1, stringResp.indexOf("\r"));
            const key = stringResp.substring(stringResp.indexOf("\n")+1, stringResp.indexOf("\n")+1+Number(keyLen));

            const ans = map[key];
            console.log("getAns:", ans);
            if (!ans) {
                connection.write("$-1\r\n");
            } else if (ans.expiryInfo.expiresIn === null || ans.expiryInfo.expiresIn < Date.now() - ans.expiryInfo.setTime) {
                connection.write("+" + ans.value + "\r\n");
            } else {
                connection.write("$-1\r\n");
            }
        } else if (stringData.startsWith("*5\r\n$3\r\nset\r\n")) {
            console.log("stringData: " + stringData);
            const stringResp = stringData.substring("*5\r\n$3\r\nset\r\n".length, stringData.length)
            const keyLen = stringResp.substring(1, stringResp.indexOf("\r"));
            const key = stringResp.substring(stringResp.indexOf("\n")+1, stringResp.indexOf("\n")+1+Number(keyLen));
            console.log("keyLen: " + keyLen);
            console.log("key: " + key);

            const valueResp = stringResp.substring(stringResp.indexOf("\n")+1+Number(keyLen)+2, stringResp.length);
            const valueLen = valueResp.substring(1, stringResp.indexOf("\r"));
            const value = valueResp.substring(valueResp.indexOf("\n") + 1, valueResp.indexOf("\n") + 1 + Number(valueLen));
            console.log("valueResp:" + valueResp);
            console.log("valueLen:" + valueLen);
            console.log("value:" + value);

            const expiryResp = valueResp.substring(nthIndex(valueResp, "\n", 2)+9, valueResp.length);
            const expiryLen = expiryResp.substring(1, expiryResp.indexOf("\r"));
            const expiry = expiryResp.substring(expiryResp.indexOf("\n") + 1, expiryResp.indexOf("\n") + 1 + Number(expiryLen));
            console.log("expiryResp:" + expiryResp);
            console.log("expiryLen:" + expiryLen);
            console.log("expiry:" + expiry);

            map[key] = {
                value: value,
                expiryInfo: {
                    setTime: Date.now(),
                    expiresIn: Number(expiry)
                }
            };

            connection.write("+OK\r\n");
        } else {
            connection.write("+PONG\r\n");
        }
    })
});
// *5\r\n$3\r\nset\r\n$9\r\nelephants\r\n$5\r\nworld\r\n$2\r\npx\r\n$3\r\n100\r\n
// $9\r\nelephants\r\n$5\r\nworld\r\n$2\r\npx\r\n$3\r\n100\r\n
// $5\r\nworld\r\n$2\r\npx\r\n$3\r\n100\r\n
server.listen(6379, "127.0.0.1");
