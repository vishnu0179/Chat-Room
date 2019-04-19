const express = require('express');
const socketio = require('socket.io')
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use('/', express.static('./'));
/*
app.get('/',(req,res)=>{
    res.send("Hello world");
});*/

let userSockets = {}

io.on('connection',(socket)=>{
    console.log('New socket has been formed on '+socket.id);
    socket.emit('connected'); 
    
    socket.on('login',(data)=>{
        //username is in data.user
        userSockets[data.user] = socket.id;
        io.emit('users', userSockets)
    })

    socket.on('disconnect',(reason)=>{
        
        
        for(property in userSockets)
        {      
            if(userSockets[property]==socket.id)
            {
                delete userSockets[property];              
            }
        }
        io.emit('disconnectUser', userSockets)
    })

    socket.on('send_msg',(data)=>{
        
        if(data.recipient!=''){
            let rcptSocket = userSockets[data.recipient];
            if(rcptSocket==undefined){
                socket.emit('createAlert','User offline/not Available')
            }
            else{
                io.to(rcptSocket).emit('rcvd_msg',data);
                socket.emit('rcvd_msg',data);
            }            
        }
        else{
            //if we use io.emit() everyone gtes the data
            io.emit('rcvd_msg',data)
            //socket.broadcast.emit('rcvd_msg',data);
            //if we use the broadcast.emit all other user instead of the sender gets the data
        }
        
    })
})

server.listen(2347,()=> console.log("Website live"));