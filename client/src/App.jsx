import './App.css';
import {io} from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Card, CardContent, CardFooter } from './components/ui/card';
import { motion } from "framer-motion"



function App() {
  const socket = useMemo(()=>(io("https://chatify-wr17.onrender.com")), []);   //useMemo because component rerender ho rha tha to page reload ho ja rha tha ,useMEmo component rerender pe page reload nhi krta
  // const socket2 = useMemo(()=>(io("http://localhost:3000/")), []);   //useMemo because component rerender ho rha tha to page reload ho ja rha tha ,useMEmo component rerender pe page reload nhi krta

  const[message, setMessage] = useState("")
  const[room, setRoom] = useState("");
  const[socketId, setSocketId] = useState("");
  const[messages, setMessages] = useState([]);
  const[welmsg, setWelmsg] = useState("");
  const[namee, setNamee] = useState("");
  const[showmsg, setShowmsg] = useState([]);


  const[alertboxStatus, setAlertboxStatus] = useState(true);



  // const handleInput = (e)=>{
  //   setMessage(e.target.value);
  // }

  const handleSub = (e)=>{
    e.preventDefault();              // preventDefault karne se ,if input field change hoga to page reload nhi hoga , otherwise page reload ho jayega
    socket.emit("message", {message, room})
    setShowmsg(message);
    setMessage("");
  }
  const nameSubmit = (e)=>{
    e.preventDefault();
    socket.emit("username", namee);
    
  }
  const hadleClick = ()=>{
    setMessages([]);
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


    socket.on("welcome", (d)=>{                // same EVENT NAME we have to use here
      setWelmsg(d);
      console.log(d)
    });

    //user ko disconnect kb karayenge jb component "unmount" hoga
    //return is a clean up function in useEffect
    // means jb page refresh karenge to usse pehle ye clean up function chal jayega

    return ()=> {
      socket.disconnect();
    };

  }, []);
  return (
    <>

    <motion.div initial={{ opacity: 0}}
      animate={{ opacity: 1, }} 
      transition={{ duration: 1 }} >
    
      <div  className={` ${alertboxStatus ? 'overLay' : '' }`}></div>
      <div className={`${alertboxStatus ? 'alertBox' : ''}`}> 
      <h3 className={`${alertboxStatus ? 'textCenter' : 'textHide'} text-md font-light tracking-tighter `}>YOU WILL NEED A ROOM ID TO CHAT</h3>
      <form onSubmit={nameSubmit}>
      <input type="text"
      className={`${alertboxStatus ? 'nameForm' : 'hidden'}`}
      value={namee}
      onChange={(e)=> setNamee(e.target.value)}
      placeholder='Enter your name'/>
      
      <Button size='sm' type="submit" onClick ={()=> setAlertboxStatus(false) } className={`${alertboxStatus ? 'btnCenter' : "hidden"}`}>Submit</Button>
      </form>
      </div>
    </motion.div>  
      
       <motion.div initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }} 
       className={`text-orange-500 lobster font-semibold text-5xl fixed p-7 hover:scale-110 hover:transition-all ${alertboxStatus ? '' : "animate-none"}`}>
       <h1>CHATify</h1> 
       </motion.div>
      
       <motion.h1 initial={{ opacity: 0, x: -70 }} // Initial animation state
      animate={{ opacity: 1, x: 0 }} // Animation when component mounts
      transition={{ duration: 6 }} 
       className='text-zinc-100 top-52 ml-[365px] relative text-2xl mb-2 font-normal lobster tracking-wide'>
        {welmsg}
        </motion.h1>
      
    
    <div className='flex  justify-center items-center h-screen  '>
    <Card className=" w-[400px] bg-zinc-900 border-none">

     
      <CardContent>
        <form onSubmit={handleSub}>
          <div className="grid w-full items-center gap-4 mt-5">
            <div className="flex flex-col space-y-1.5 text-slate-300 ">
             
              <h1 className='text-xl text-orange-400 font-serif font-medium '>{socketId}</h1>
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

      <div className='text-white ml-6'>
        {showmsg}
        </div>

      <div className='py-2 px-7 ml-14'>
        
      {messages.map((msg, i)=>(
        <p key={i} className={`text-slate-200  `}>{msg}</p>   
      ))}
      </div>

      <Button onClick={hadleClick} className="ml-72 mt-4 inline " size="sm" variant="destructive">Clear Chat</Button>
    </div>
    </div>
    </>
  
  )
}

export default App
