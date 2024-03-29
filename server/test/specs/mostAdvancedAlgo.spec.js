/**
 * Created by Aleksandar on 2014-08-05.
 */
var user, answers, socketConnections, connectionStrings;
var voteAlgo=require("../../../voteAlgo");
before(function(){
    user={votes: {
            "0": {
                answered: {
                    time: 4000,
                    name: "Bill Gates"
                }
            },
            "1": {
                answered: {
                    time: 5000,
                    name: "Curt Kobain"
                }

            }, "2": {
                answered: {
                    time: 6000,
                    name: "Bill Clinton"
                }
            }
        }
    }
    answers={
        "0":"Bill Gates",
        "1":"Curt Kobain",
        "2":"Bill Clinton"
    }
    connecteds={
        "123":user
    }
    socketIdsOfPersonsInRoom={"123":true};
})
describe("The most advancedAlgorithm",function() {
    describe("getUserPoint",function() {
        it("should be able to return how much time it has passed since user has answered", function () {
            var timeNow = 3000;
            var timeExpected = 6000;
            var points =voteAlgo.getUserPoint(user, timeNow,answers);
            points.amountOfPoints.should.equal(parseInt(6000));
            points.amountOfCorrect.should.equal(3);
        })
    });
    describe("getCorrectAnswer",function() {
        it("should return correct answer when we give it the key",function(){
            var timeNow = new Date().getTime();
            var answer = voteAlgo.getCorrectAnswer("0",answers);
            answer.should.be.equal(answers["0"]);
        });
        it("should return correct answer when we give it the key",function(){
            var timeNow = new Date().getTime();
            var correctAnswer = voteAlgo.getCorrectAnswer("1",answers);
            correctAnswer.should.be.equal(answers["1"]);
        });
    });
    describe("checkIfCorrect",function() {
        it("should return true when the user has answered correctly",function(){
            var answer = voteAlgo.checkIfCorrect(answers[0],"0",answers);
            answer.should.equal(true);
        });
        it("should return false when the user has answered uncorrectly",function(){
            var answer = voteAlgo.checkIfCorrect("billiga jeans","0",answers);
            answer.should.equal(false);
        });
    });
    describe("loopThrough",function(){
        it("should loop through all alternatives",function() {
            var results = voteAlgo.loopThrough(connecteds, socketIdsOfPersonsInRoom,3000,answers);
            expect(results[0].amountOfPoints).to.equal(6000);
            expect(results[0].amountOfCorrect).to.equal(3);

        });
    })
    describe("getMinimum",function(){
        it("should return 123",function() {
            var results= voteAlgo.loopThrough(connecteds, socketIdsOfPersonsInRoom,3000,answers);
            console.log("results",results);
            var result = voteAlgo.getMinimum(results);
            console.log("result",result);
            expect(results[0].amountOfPoints).to.equal(6000);
            expect(results[0].amountOfCorrect).to.equal(3);

        });
    })
});