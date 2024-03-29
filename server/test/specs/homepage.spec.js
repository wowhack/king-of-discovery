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
        beforeEach(function() {
            socket.removeAllListeners("joinedRoom");
            socket.removeAllListeners("youAreTheKingOfDiscovery");
            socket.removeAllListeners("getDetails");
            socket.removeAllListeners("newMessage");

        });
        it("should assign you with a name",function(done) {
            this.timeout(200);
            socket.on("getDetails",function(data){
                expect(data.name).to.exist;
                done();
            });
            socket.emit("getDetails");
        });
        it("should be able to update chat room quantities",function() {

        });
        it("should be able to join chat rooms",function(done) {
            this.timeout(2000);
            var joinRoom=Math.random();
            socket.on("joinedRoom",function(data){
                data.joinRoom.should.equal(joinRoom);
                data.count.should.equal(0);
                done();
            });
            socket.emit("joinRoom",{
                "joinRoom":joinRoom
            });
        });
        it("should NOT become king of discovery upon entering an filled room",function(done) {
            setTimeout(function(){
                done();
            },2000);
            var joinRoom="room15";

            var otherSocket = createClient();
            otherSocket.emit("joinRoom",{"joinRoom":joinRoom});
            otherSocket.on("youAreTheKingOfDiscovery",function(){
                done();
            });
            socket.on("youAreTheKingOfDiscovery",function(){
                expect(true).to.equal(false);
            });
            setTimeout(function() {socket.emit("joinRoom",{
                "joinRoom":joinRoom
                 })
                },100
            );

        });
        it.skip("should be able to send 3 songs and catch them broadcast",function(done) {
            this.timeout(2000);
            console.log("hello");
            socket.on("tracksHaveBeenSuggested", function(data) {
                done();
            });
            socket.on("joinedRoom",function() {
                console.log("hello");
                socket.emit('suggestTracks', { tracks: []});
            });
            socket.emit("joinRoom", {
                "joinRoom": "3123123"
            });

        });
        /*it("should finish contest after one second.",function(done) {
            this.timeout(5000);
            console.log("hello");
            socket.on("finished", function(data) {
                done();
            });
            socket.on("joinedRoom",function() {
                console.log("hello");
                socket.emit('suggestTracks', { tracks: []});
            });
            socket.emit("joinRoom", {
                "joinRoom": "3123123"
            });
        });*/
        /*it("should be able to send messages but not see them itself",function(done){
            this.timeout(2000);

            var message  = Math.random();
            var joinRoom = Math.random();

            var otherSocket = createClient();

            socket.on("newMessage",function(data) {
                expect(true).to.equal(false);
            });
            otherSocket.on("newMessage",function(data) {
                console.log("message recieved");
                data.message.should.equal(message);
                done();
            });

            socket.on("joinedRoom",function(data){
                setTimeout(function(){
                    console.log("Message sent",message);
                    socket.emit("newMessage",{
                        message: message
                    });
                },100);
            });
            console.log("joinRoom",joinRoom)
            otherSocket.emit("joinRoom",{"joinRoom":joinRoom});
            socket.emit("joinRoom",{
                "joinRoom":joinRoom
            });
        });*/
    })

});