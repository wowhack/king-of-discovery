/**
 * Created by Aleksandar on 2014-08-05.
 */
var user, answers;
var voteAlgo=require("../../../voteAlgo");
before(function(){
    user= {votes: {
            "0": {
                answered: {
                    time: 4000
                }
            },
            "1": {
                answered: {
                    time: 5000
                }

            }, "2": {
                answered: {
                    time: 6000
                }
            }
        }
    }
    answers={
        "0":"Bill Gates",
        "1":"Curt Kobain",
        "2":"Bill Clinton"
    }
})
describe("The most advancedAlgorithm",function() {
    describe("getUserPoint",function() {
        it("should be able to return how much time it has passed since user has answered", function () {
            var timeNow = 3000;
            var timeExpected = 6000;
            console.log(6000);
            var points =voteAlgo.getUserPoint(user, timeNow);
            points.amountOfPoints.should.equal(parseInt(6000));
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
});