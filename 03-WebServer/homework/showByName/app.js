var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
http.createServer((request , response) =>{
    fs.readFile(`${__dirname}/images/${request.url}.jpg`,
    (err , data) =>{
        if(err){
            response.writeHead(404, {'content-type': 'text/plain'})
            response.end('Hubo un error ,not found')
        }
        else{
            response.writeHead(200 , {'content-type':'image/jpg'})
            response.end(data)
        }
    })
}).listen(3000, '127.0.0.1')