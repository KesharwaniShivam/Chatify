import express from "express";
import {Server} from "socket.io";
import {createServer, get} from "http";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "POST"],
        credentials : true,
    },
});

const port = process.env.PORT || 3000;

app.get('/' , (req, res) =>{
    res.send("hello")
})

io.on("connection", (socket)=>{                                      //"connection" is the pre-build event
    console.log("User connnected");
    console.log("ID :",socket.id);

    socket.on("message", ({room, message})=>{
        console.log(message);
        io.to(room).emit("receive-msg", message)
    });

    // ye chiz apan yaha nhi krte
    // socket.emit("welcome", "Welcome to the server")
    // socket.broadcast.emit("welcome" , `${socket.id} joined the server`)    // here "welcome" is the event name, we defined
    //broadcast means usko chod ke sbko milega   
    
    socket.on("disconnect" ,()=>{
        console.log("user disconnected",socket.id);
    });
})


// app.get('/about', (req, res) =>{
//     res.send("About page")
// }) 

server.listen(port , ()=>{
    console.log(`server is listening at port: ${port}`)
})