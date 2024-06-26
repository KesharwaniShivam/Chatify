import express from "express";
import {Server} from "socket.io";
import {createServer, get} from "http";
import 'dotenv/config'

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET", "POST"],
        credentials : true,
    },
});

const port = 4000;

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

    socket.on("username", (namee)=>{
        console.log(namee);
        socket.emit("welcome", `Welcome to CHATify ${namee}`)
    socket.broadcast.emit("welcome" , `${socket.id} -- ${namee} joined the chat`)
    })

    // ye chiz apan yaha nhi krte
        // here "welcome" is the event name, we defined
    //broadcast means usko chod ke sbko milega   
    
    socket.on("disconnect" ,()=>{
        console.log("user disconnected",socket.id);
    });
})


// app.get('/about', (req, res) =>{
//     res.send("About page")
// }) 

server.listen(process.env.PORT , ()=>{
    console.log(`server is listening at port: ${process.env.PORT}`)
})