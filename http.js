/**
 * Created by Aleksandar on 2014-08-05.
 */
// Setup basic express server
var express = require('express');
var voteAlgo = require('./voteAlgo');


var hardcodedAnswers = null; //TODO

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
        channels[socket.channel].futureAnswers = data;
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {

        if (!socket.channel){
            return;
        }

        var roomCount = Object.keys(io.sockets.adapter.rooms[socket.channel] || []).length;
        if (roomCount == 0){
            clearInterval(channels[socket.channel].interval);
        }
    });

    socket.on('joinRoom',function(data){
        var joinRoom = data.joinRoom;
        socket.channel=joinRoom;

        var roomCount = Object.keys(io.sockets.adapter.rooms[joinRoom] || []).length;

        var roomIsEmpty = roomCount == 0;

        if (roomIsEmpty) {
            socket.emit("youAreTheFutureKingOfDiscovery",{

            });
            channels[joinRoom] = {};
            channels[joinRoom].interval = setInterval(roomTick(joinRoom), 10000);
            channels[joinRoom].futureKing = socket;
        }

        socket.join(joinRoom,function(){
            socket.emit("joinedRoom", {
                "joinRoom": joinRoom,
                count: roomCount
            });
        });
    });

});


var pass = 1;

var roomTick = function(channelId){
    return function() {

        console.log("\n\n\n");
        console.log("PASS "+pass);
        console.log("------\n");
        pass += 1;

        var channel = channels[channelId];

        // check results of just finisehd round
        var socketIdsOfPersonsInRoom = io.nsps["/"].adapter.rooms[channelId];
        var filtered = {};
        for (var key in socketIdsOfPersonsInRoom) {
            if (channel.king && key == channel.king.id){
                continue;
            }
            if (channel.futureKing && key == channel.futureKing.id){
                continue;
            }
            filtered[key] = socketIdsOfPersonsInRoom[key];
        }

        var winner = channel.king;

        if (channel.answers && Object.keys(filtered).length > 0) {

            trackData = channel.answers;
            var finalAnswers = [];

            for (var i = 0; i < trackData.tracks.length; i++) {
                var track = trackData.tracks[i];
                for (var j = 0; j < track.artists.length; j++) {
                    if (track.artists[j].correct){
                        finalAnswers.push(track.artists[j].name);
                        break;
                    }
                };
            };

            var results=voteAlgo.loopThrough(io.sockets.connected,socketIdsOfPersonsInRoom,new Date().getTime(),finalAnswers);

            winner = voteAlgo.getMinimum(results).socket || winner;

        }

        if (channel.futureAnswers) {
            console.log("There are answers");
            channel.futureKing.broadcast.to(channelId).emit("tracksHaveBeenSuggested",channel.futureAnswers);
        }

        
        if (winner) {

            console.log("There is a winner!!!");

            //Move on to the next round
            channel.answers = channel.futureAnswers || hardcodedAnswers;
            channel.futureAnswers = null;

            channel.king = channel.futureKing;
            channel.futureKing = winner;
        
            winner.emit("youAreTheFutureKingOfDiscovery",{});
            if (channel.king){
                channel.king.emit("youAreTheKingOfDiscovery",{});
            }

        } else {

            console.log("There is no winner :(");
            channel.king = channel.futureKing;
            channel.futureKing = null;
            channel.king.emit("youAreTheKingOfDiscovery",{});
            channel.answers = channel.futureAnswers || hardcodedAnswers;
            channel.futureAnswers = null;            
        }

        


    }
}
