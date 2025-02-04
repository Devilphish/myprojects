const http = require('http');
const fs = require('fs').promises;

//const host = 'localhost';
const host = '192.168.5.171';
const port = 8000;

const requestListener = function (req, res)
{
    var type = "text/html";
    var file = "/ko.html";

    if (req.url.endsWith(".png")) {
        type = "image/png";
        file = req.url;
    }
    else if (req.url.endsWith(".js")) {
        type = "text/javascript";
        file = req.url;
    }
    else if (req.url == "/ko.html") {
        type = "text/html";
        file = req.url;
    }

    fs.readFile(__dirname + file)
        .then(contents => {
            console.log("serving file " + __dirname + file);
            res.setHeader("Content-Type", type);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
}

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

