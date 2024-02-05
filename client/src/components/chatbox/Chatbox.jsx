
import {io} from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    
  } from "../ui/card"
  import { Button } from '../ui/button'
  import { Label } from '../ui/label'
  import { Input } from '../ui/input'



function Chatbox() {
  const socket = useMemo(()=>(io("http://localhost:3000")), []);

  const[message, setMessage] = useState("")

  const handleInput = (e)=>{
    setMessage(e.target.value);
  }

  const handleSub = (e)=>{
    e.preventDefault();              // preventDefault karne se ,if input field change hoga to page reload nhi hoga , otherwise page reload ho jayega
    socket.emit("message", message)
    setMessage("");
  }

  useEffect(() => {
    
    socket.on("connect", ()=>{
      console.log("connected",socket.id)
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
    <div className='flex justify-center items-center h-screen '>
    <Card className=" w-[400px] bg-zinc-900 border-none">

     
      <CardContent>
        <form onSubmit={handleSub}>
          <div className="grid w-full items-center gap-4 mt-5">
            <div className="flex flex-col space-y-1.5 text-slate-300 ">
              <Label htmlFor="roomId" >Room ID</Label>
              <Input className="" id="roomId" placeholder="Enter room ID here" />
            </div>
            <div className="flex flex-col space-y-1.5 text-slate-300">
              <Label htmlFor="name">Typebox</Label>
              <Input value={message} 
              onChange={(e)=> setMessage(e.target.value)} 
              id="name" 
              placeholder="Type your message here" />
            </div>
            <Button type="submit" variant ="destructive">Send</Button>
          </div>
        </form>
      </CardContent> 
      
    </Card>
    </div>
    </>
  )
}

export default Chatbox