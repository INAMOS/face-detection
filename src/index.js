const server=require("./server/server");
const PORT=server.get('port');

server.listen(PORT,()=>{

    console.log("Server runing on port "+PORT);

})
