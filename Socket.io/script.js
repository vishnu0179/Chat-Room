
console.log("Hello on front end");

let socket = io('ws://localhost:2347');
socket.on('connected', ()=>{
    console.log('socket formed on'+socket.id);
    
})

$(function(){
    let msglist = $('#msg');
    let sendmsg = $('#send_btn');
    let msgInput = $('#msg_input');
    let login = $('#login')
    let username = $('#username')
    let loginBtn = $('#login-btn')
    let chat = $('#chat')
    let onlineUser = $('#onlineUsers')
    let userList = $('#userList')
    let recipientInput = $('#recipient')
    let afterLogin = $('.after-login')
    let list = document.getElementById('userList')
    let user;
    
    loginBtn.click(function(){
        user = username.val();
        chat.show()
        login.hide();
        afterLogin.show();
        onlineUser.show()
        socket.emit('login',{
            user : user
        })

        socket.on('users',(data)=>{
            
            while(list.hasChildNodes()){
                list.removeChild(list.firstChild);
            }
            for(property in data)
            {
                userList.append('<li>'+ property +'</li>')
            }
        })

        socket.on('disconnectUser',(data)=>{
            while(list.hasChildNodes()){
                list.removeChild(list.firstChild);
            }
            for(property in data){
                userList.append('<li>'+ property+'</li>');
            }
        })
    })

    sendmsg.click(function(){
        socket.emit('send_msg',{
            recipient: recipientInput.val(),
            user: user,
            message : msgInput.val()
        })
    })
    
    socket.on('rcvd_msg',(data)=>{
        var dt = new Date();
        var momentTimestamp = dt.getHours() + ':' +dt.getMinutes();
        msglist.append($('<li>'+'<span>'+momentTimestamp+' </span>'+data.user+' - '+ data.message +'</li>'))
    })

    socket.on('createAlert',(data)=>{
        alert(data);
    })
})