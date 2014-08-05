/**
 * Created by Aleksandar on 2014-08-05.
 */
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
process.env.PORT = process.env.PORT || 3000;
var port = process.env.PORT;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/app'));

io.on('connection', function (socket) {
    socket.username = "hello";
    socket.channel = null;

    socket.on("getDetails",function(){
        socket.emit("getDetails",{
            name:socket.username
        });
    });

    // when the client emits 'new message', this listens and executes
    socket.on('newMessage', function (data) {
        var socketChannelIsNotSet = socket.channel==null;
        console.log("hello",socketChannelIsNotSet)
        if (socketChannelIsNotSet) {

        } else {

            var data = {
                username: socket.username,
                message: data.message
            };
            console.log("socket.channel",socket.channel);
            socket.broadcast.to(socket.channel).emit('newMessage', data);
            //socket.emit("newMessage",data);
        }
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
    });
    socket.on('joinRoom',function(data){
        var joinRoom = data.joinRoom;
        socket.channel=joinRoom;

        var roomCount = Object.keys(io.sockets.adapter.rooms[joinRoom] || []).length;

        var roomIsEmpty = roomCount == 0;
        if (roomIsEmpty) {
            socket.emit("youAreTheKingOfDiscovery",{"hello":"hi"});
        }
        socket.join(joinRoom,function(){
            socket.emit("joinedRoom", {
                joinRoom: joinRoom,
                count: roomCount+1
            });
        });
    });

});