// server.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs";
import { extname } from "node:path";
import  pool  from './db.js'
import { json } from "node:stream/consumers";
import { WebSocketServer } from "ws";


const server = createServer(async (req, res) => {
  const filePath = "./public" + (req.url === "/" ? "/index.html" : req.url);

  if(req.url == '/items' && req.method=="GET")
  {
    try{
    var result = await pool.query('select * from items');
    var items= result.rows;
    res.writeHead(200,{'content-Type':'application/json'});
    res.end(JSON.stringify(items))
    }catch(err)
    {
      console.log("the error is "+err)
      res.writeHead(500,{'content-Type':'text/plain'})
      res.end("ther is an error")

    }
return ;
  }
  if (req.method === "DELETE" && req.url.startsWith("/items/")) {
    const id = req.url.split("/")[2];
  

    try{
   await pool.query("Delete from items where id = "+id)
      res.writeHead(200,{'Content-Type' : 'application/json'})
      res.end(JSON.stringify({sucess : true}))
       broadcast({ type: "deleted", item: "something change" });
      return 
    }catch(err)
    {

      console.log(err)
      res.writeHead(500)
      res.end(JSON.stringify({sucess :false}))
    }
  }

if((req.method =="PUT")&& (req.url.startsWith("/items/")))
{
var id = req.url.split("/")[2]
      try{await pool.query(
                  "UPDATE items SET completed = true WHERE id ="+id,
                 
              );
              res.writeHead(200,{'Content-Type' :'application/json'});
              res.end(JSON.stringify({sucess:true}))
               broadcast({ type: "updated", item: "something change" });
              return 
      }catch(err)
        {
            console.log(err)
            res.writeHead(500);
            res.end(JSON.stringify({sucess:false}))

        }
   
}


if (req.method === "POST" && req.url === "/items") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
        try {
            const { name } = JSON.parse(body); 

            const result = await pool.query(
                "INSERT INTO items (name) VALUES ('"+name+"') "
                
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success : true})); 
             broadcast({ type: "added", item: "something change" });

            return;
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
        }
    });
    return 
}






  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("File not found");
    }

    const ext = extname(filePath);
    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript"
  
    };

    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(data);
  });
});
const wss = new WebSocketServer({ server });
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(message));
    }
  });
}
server.listen(3000, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:3000");
});
