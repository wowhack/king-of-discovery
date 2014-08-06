/**
 * Created by Aleksandar on 2014-08-05.
 */
// Setup basic express server
var express = require('express');
var voteAlgo = require('./voteAlgo');
var randomName=require('./server/randomNameGenerator');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
process.env.PORT = process.env.PORT || 3000;
var port = process.env.PORT;
var channels={
    //qwdkwek:{ [0] -- [1] -- ..}
};
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/app'));

io.on('connection', function (socket) {
    socket.username = randomName();
    socket.channel = null;

    socket.on("getDetails",function(){
        socket.emit("getDetails",{
            name:socket.username
        });
    });

    // when the client emits 'new message', this listens and executes
    socket.on('newMessage', function (data) {
        var socketChannelIsNotSet = socket.channel==null;
        if (socketChannelIsNotSet) {
            socket.emit();
        } else {
            var data = {
                username: socket.username,
                message: data.message
            };
            socket.broadcast.to(socket.channel).emit('newMessage', data);
        }
    });
    socket.on("guess",function(data){
        socket.votes = socket.votes || {};
        socket.votes[data.votes.index] = {
            answered: {
                time: new Date().getTime(),
                name: data.votes.artist
            }
        };
    });
    socket.on('suggestTracks', function (data) {
        channels[socket.channel] = {
            "votedata" : data
        };
        setTimeout(function(){
            var socketIdsOfPersonsInRoom = io.nsps["/"].adapter.rooms[socket.channel]; //@TODO make sure we are connected.
            var answers={};
            for(var i = 0; i < channels[socket.channel].votedata.tracks.length; i++) {
                var artists = channels[socket.channel].votedata.tracks[i].artists;
                var correctAnswer="";
                for (var j = 0; j<artists.length;j++) {
                    if (artists[j].correct) {
                        correctAnswer=artists[j].name;
                    }
                }
                answers[i]=correctAnswer;
            }

            var results=voteAlgo.loopThrough(io.sockets.connected,socketIdsOfPersonsInRoom,new Date().getTime(),answers);

            var winner = voteAlgo.getMinimum(results);
            console.log("winner",winner);
            if (winner) {
                winner.socket.emit("youAreTheKingOfDiscovery",{
                   "whatup" : true
                });
                winner.socket.broadcast.to(socket.channel).emit("youHaveNotWon",{
                    "answer":answers
                });
            }
            //io.sockets.in(socket.channel).emit("finished",data);
        },10000);
        socket.broadcast.to(socket.channel).emit("tracksHaveBeenSuggested",data);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        var chatCount=Object.keys(io.sockets.adapter.rooms[socket.channel] || []);
        if (chatCount==0) {
            channels[socket.channel]={};
        }
    });

    socket.on('joinRoom',function(data){
        var joinRoom = data.joinRoom;
        socket.channel=joinRoom;

        var roomCount = Object.keys(io.sockets.adapter.rooms[joinRoom] || []).length;

        var roomIsEmpty = roomCount == 0;

        if (roomIsEmpty) {
            socket.emit("youAreTheKingOfDiscovery",{ });
        }

        socket.join(joinRoom,function(){
            socket.emit("joinedRoom", {
                "joinRoom": joinRoom,
                count: roomCount
            });
        });
    });

});