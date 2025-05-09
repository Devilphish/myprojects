const http = require('http');
const fs = require('fs').promises;

//const host = 'localhost';
//const host = '192.168.5.115';
//const host = '23.124.26.26';
//const host = global.location.hostname;
//const host = global.hostname;
const port = 31420;

const requestListener = function (req, res)
{
    var type;
    var file;

    if (req.url.endsWith(".png")) {
        type = "image/png";
        file = req.url;
    }
    else if (req.url.endsWith(".js")) {
        type = "text/javascript";
        file = req.url;
    }
    else if (req.url == "/ko.html" || req.url == "/") {
        type = "text/html";
        file = "/ko.html";
    }
    else if (req.url == "/foo.html" || req.url == "/") {
        type = "text/html";
        file = "/foo.html";
    }
    else {
        res.writeHead(404);
        res.end("Invalid file type " + req.url);

        console.log("Invalid file type " + req.url);

        return;
    }

    fs.readFile(__dirname + file)
        .then(contents => {
            console.log("serving file " + __dirname + file);
            res.setHeader("Content-Type", type);
            res.setHeader("Pragma", "public");
            res.setHeader("Cache-Control", "max-age=86400");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(404);
            res.end(err.toString());

            return;
        });
}

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

