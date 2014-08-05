var url, response, socket;

//event callbacks
var callbacks = {
    "authentication" : null,
    "youAreNowKingOfTheDiscovery" : null
};
function createClient() {
    var url = 'http://localhost:3030/';
    console.log("Connecting to:",url);

    var socket = socketclient.connect(url);

    socket.on('connect', function(){
        socket.on('disconnect', function(){});
    });
    return socket;
};

before(function(done){
    require('../../../http.js');
    process.env.GAME_LENGTH=900000;
    process.nextTick(function(){ //connect after the server has started.
        socket = createClient();
        done();
    });
});

describe("http", function() {
    describe("connecting with client",function() {
        before(function() {
            socket.removeAllListeners("joinedRoom");
            socket.removeAllListeners("youAreTheKingOfTheDiscovery");
        });
        it.skip("should assign you with a name",function(done) {
            this.timeout(200);
            socket.on("getName",function(data){
                expect(data.name).to.exist;
                done();
            });
            socket.emit("getName");
        });
        it.skip("should be able to update chat room quantities",function() {

        });
        it.skip("should be able to join chat rooms",function(done) {
            this.timeout(2000);
            var joinRoom=Math.random();
            socket.on("joinedRoom",function(data){
                data.joinRoom.should.equal(joinRoom);
                data.count.should.equal(1);
                done();
            });
            socket.emit("joinRoom",{
                "joinRoom":joinRoom
            });
        });

        it("should be become king of discovery upon entering an empty room",function(done) {
            this.timeout(200);
            socket.on("youAreTheKingOfDiscovery",function(){
                done();
            });
            var joinRoom = "room15";
                socket.emit("joinRoom", {
                    "joinRoom": joinRoom
            });

        });
        it("should NOT become king of discovery upon entering an filled room",function(done) {
            setTimeout(function(){
                done();
            },2000);
            var joinRoom="room15";

            var otherSocket = createClient();
            otherSocket.emit("joinRoom",{"joinRoom":joinRoom});

            socket.on("youAreTheKingOfDiscovery",function(){
                expect(true).to.equal(false);
            });
            socket.emit("joinRoom",{
                "joinRoom":joinRoom
            });

        });
        it("should be able to send 3 songs and catch them broadcast",function(done) {
            this.timeout(200);
            var suggestions=[12,123,123];

            socket.on("songsHaveBeenSuggested", function(data) {
                data.songs.should.deep.equal(suggestions);
                done();
            })
            socket.emit('suggestSongs', { songs:[12,123,123] });
        });
        it("should be able to send messages but not see them itself",function(done){
            this.timeout(2000);

            var message  = Math.random();
            var joinRoom = Math.random();

            var otherSocket = createClient();
            otherSocket.emit("joinRoom",{"joinRoom":joinRoom});

            socket.on("newMessage",function(data) {

            });
            otherSocket.on("newMessage",function(data) {
                data.message.should.equal(message);
                done();
            });

            socket.on("joinedRoom",function(data){
                socket.emit("newMessage",{
                    message: message
                });
            });
            socket.emit("joinRoom",{
                "joinRoom":joinRoom
            });
        });
    })

});