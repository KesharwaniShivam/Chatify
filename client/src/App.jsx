import './App.css';
import {io} from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Card, CardContent, CardFooter } from './components/ui/card';



function App() {
  const socket = useMemo(()=>(io("https://chatify-wr17.onrender.com")), []);   //useMemo because component rerender ho rha tha to page reload ho ja rha tha ,useMEmo component rerender pe page reload nhi krta

  const[message, setMessage] = useState("")
  const[room, setRoom] = useState("");
  const[socketId, setSocketId] = useState("");
  const[messages, setMessages] = useState([]);

  const[alertboxStatus, setAlertboxStatus] = useState(true);

  // const handleInput = (e)=>{
  //   setMessage(e.target.value);
  // }

  const handleSub = (e)=>{
    e.preventDefault();              // preventDefault karne se ,if input field change hoga to page reload nhi hoga , otherwise page reload ho jayega
    socket.emit("message", {message, room})
    setMessage("");
  }

  useEffect(() => {
    
    socket.on("connect", ()=>{
      setSocketId(socket.id);
      console.log("connected",socket.id)
    });

    socket.on("receive-msg" ,(data)=>{
      setMessages((messages)=> [...messages, data] )
      console.log(data)
    });

    // socket.on("welcome", (d)=>{                // same EVENT NAME we have to use here
    //   console.log(d)
    // });

    //user ko disconnect kb karayenge jb component "unmount" hoga
    //return is a clean up function in useEffect
    // means jb page refresh karenge to usse pehle ye clean up function chal jayega

    return ()=> {
      socket.disconnect();
    };

  }, []);
  return (
    <>

    <div>
    
      <div  className={` ${alertboxStatus ? 'overLay' : '' }`}></div>
      <div className={`${alertboxStatus ? 'alertBox' : ''}`}> 
      <h3 className={`${alertboxStatus ? 'textCenter' : 'textHide'} text-md font-light tracking-tighter `}>YOU WILL NEED A ROOM ID TO CHAT</h3>
      <Button size='lg' onClick ={()=> setAlertboxStatus(false) } className={`${alertboxStatus ? 'btnCenter' : "hidden"}`}>OKAY</Button>
      </div>
    </div>  
      
       <div className={`text-orange-500 font-[lobster] font-semibold text-5xl fixed p-7 hover:scale-110 hover:transition-all ${alertboxStatus ? 'animate-bounce' : "animate-none"}`}>
        CHATify
       </div>
       
    
    <div className='flex  justify-center items-center h-screen  '>
    <Card className=" w-[400px] bg-zinc-900 border-none">

     
      <CardContent>
        <form onSubmit={handleSub}>
          <div className="grid w-full items-center gap-4 mt-5">
            <div className="flex flex-col space-y-1.5 text-slate-300 ">
             
              <h1 className='text-xl text-orange-400 font-serif '>{socketId}</h1>
              <Label htmlFor="roomId" >Room ID</Label>
              <Input 
              value={room}
              onChange={(e)=> setRoom(e.target.value)}
              className="" id="roomId" 
              placeholder="Enter room ID here" />
            </div>
            <div className="flex flex-col space-y-1.5 text-slate-300">
              <Label htmlFor="name">Typebox</Label>
              <Input 
              value={message} 
              onChange={(e)=> setMessage(e.target.value)} 
              id="name" 
              placeholder="Type your message here" />
            </div>
            <Button type="submit" variant ="destructive">Send</Button>
          </div>
        </form>
      </CardContent> 
      
      
    </Card>
    <div className='h-64 w-[400px] bg-zinc-900 rounded-xl ml-4 hover:bg-zinc-800 focus:ring-slate-800'>
      <h1 className='text-orange-500 font-semibold pt-4 text-xl items-center text-center font-mono'>Replies</h1>
      <div className='py-4 px-8'>
      {messages.map((msg, i)=>(
        <div key={i} className={`text-slate-200 `}>{msg}</div>   
      ))}
      </div>
    </div>
    </div>
    </>
  
  )
}

export default App
