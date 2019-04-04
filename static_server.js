const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let httpServer;

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
};

function staticServer (port) {
    httpServer = http.createServer(function (req, res) {
      const parsedUrl = url.parse(req.url);

      const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
      let pathname = path.join(`${__dirname}/public/`, sanitizePath);
    
      fs.exists(pathname, function (exist) {
        if(!exist) {
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);
          return;
        }
    
        if (fs.statSync(pathname).isDirectory()) {
          pathname += '/index.html';
        }
    
        // read file from file system
        fs.readFile(pathname, function(err, data){
          if(err){
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            // based on the URL path, extract the file extention. e.g. .js, .doc, ...
            const ext = path.parse(pathname).ext;
            // if the file is found, set Content-type and send data
            res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
            res.end(data);
          }
        });
      });

    }).listen(parseInt(port));

    console.log(`Server listening on port ${port}`);

    return httpServer;
}

module.exports = staticServer;
