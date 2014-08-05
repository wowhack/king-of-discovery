/**
 * Created by Aleksandar on 2014-08-05.
 */
module.exports={
    getUserPoint:function(user,timeStarted,answers) { // @TODO SHOULD BE ASYNCHRONOUS
        var amountOfPoints = 0;
        var amountOfCorrect = 0;
        for (var key in user.votes) {
            var obj = user.votes[key];
            amountOfPoints += obj.answered.time-timeStarted;
            if(obj.answered.answer) {
                module.exports.checkIfCorrect();
            }
        };
        return {
            "amountOfPoints":amountOfPoints
        };
    },
    checkIfCorrect:function(answer,key,answers) {
        var correctAnswer = module.exports.getCorrectAnswer(key,answers);
        return answer == correctAnswer;
    },
    getCorrectAnswer: function(key,answers) {
        return answers[key];
    }
};