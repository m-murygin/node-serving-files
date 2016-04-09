 'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'
};

const hostname = '127.0.0.1';
const port = 8000;

http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;
    let fileName =path.join(process.cwd(), unescape(uri));
    console.log('Loading ', uri);
    console.log('FileName ', fileName);
    
    let stats;
    try {
        stats = fs.statSync(fileName);
    } catch (err) {
        console.log(err);
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('File Not Found');
        res.end();
        return;
    }

    if (stats.isFile()) {
        console.log('isFile');
        let extension = path.extname(fileName).split('.').reverse()[0];
        let mimeType = MIME_TYPES[extension];

        res.writeHead(200, {'Content-type': mimeType});

        let fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if(stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });

        res.end();
    } else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('500 Internal Error happend');
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});