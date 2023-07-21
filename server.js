var express  = require('express')
var http = require('http');

let path = require('path')
let fs = require('fs')
var app = express()
var server = http.createServer(app)
let io = require('socket.io')(server)
let res;

let userOnline=[];
let Collection = []

app.use(express.static('public'))
app.set('view engine','ejs')

app.get('/',(r,res)=>{

  res.render('home')

})
io.on('connection',socket=>{
  socket.on('typing',(receiver)=>{
    const g = userOnline.find(user=>user.name === receiver)
  socket.to(g.socketId).emit('typing')
    
  })
  socket.on('notyping',(receiver)=>
  {
    const g = userOnline.find(user=>user.name === receiver)
  
   socket.to(g.socketId).emit('notyping')
  })
  socket.on('getStream',(id,receiver,sender)=>{
    const g = userOnline.find(user=>user.name === receiver)

socket.to(g.socketId).emit('takeStream',id,receiver,sender)
  })
  socket.on('user-connected', (userId,receiver,sender) => {
   
    let g = userOnline.find(user=>user.name==receiver)
  
 socket.to(g.socketId).emit('user-connected', userId,sender) // Tell everyone else in the room that we joined
})
    
  

    socket.emit('existName',Collection)   

    
  
    socket.on('userName',(name)=>{
     
   let   userinfo= {
       
        socketId:socket.id,
        name:name
      }
userOnline.push(userinfo)
     Collection.push(name)
     socket.broadcast.emit('existName',Collection)
     io.emit('namescollection',Collection)
       
    })
    socket.on('chat_msg',(msg,receiver,sender)=>{
    
      const g = userOnline.find(user=>user.name == receiver)
    
      socket.to(g.socketId).emit('chat_message',msg,sender)
    })
    socket.on('metadata',(metadata,receiver)=>{
      const g = userOnline.find(user=>user.name === receiver)
  
  
       
     socket.to(g.socketId).emit('newmetadata',metadata)
      
    })
    socket.on('chunks',(chunks,receiver)=>{
      const g = userOnline.find(user=>user.name === receiver)
   
    socket.to(g.socketId).emit('newchunks',chunks)
     
    })
    socket.on('userCam',(sender)=>{
      const g = userOnline.find(user=>user.name == sender)
    
     socket.to(g.socketId).emit('no_access')
    })
    socket.on('disconnect',()=>{
  
        let index= userOnline.findIndex(users=>{return users.socketId === socket.id})
        if (userOnline[index]) {
           Collection.splice((Collection.findIndex(names=>{return userOnline[index].name === names})),1)
        
        io.emit('namescollection',Collection)
        }

      
      
    })
})

server.listen(3000)
