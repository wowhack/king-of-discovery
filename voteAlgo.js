/**
 * Created by Aleksandar on 2014-08-05.
 */
module.exports={
    getUserPoint:function(user,timeStarted,answers) { // @TODO SHOULD BE ASYNCHRONOUS
        var amountOfPoints = 0;
        var amountOfCorrect = 0;
        if (!user) {
            return {
                "amountOfPoints": amountOfPoints,
                "amountOfCorrect": amountOfCorrect
            };
        }

        for (var key in user.votes) {
            var obj = user.votes[key];
            //TODO

            amountOfPoints += 90000 - (obj.answered.time-timeStarted);

            if (module.exports.checkIfCorrect(obj.answered.name,key,answers)) {
                amountOfCorrect++;
            };
        };
        if (amountOfCorrect==3) {
            user.totalPoints = user.totalPoints || 0;
            user.totalPoints += amountOfPoints;
        };
        return {
            "amountOfPoints": amountOfPoints,
            "amountOfCorrect": amountOfCorrect
        };
    },
    checkIfCorrect:function(answer,key,answers) {
        var correctAnswer = module.exports.getCorrectAnswer(key,answers);
        return answer == correctAnswer;
    },
    getCorrectAnswer: function(key,answers) {
        return answers[key];
    },
    loopThrough:function(connecteds,socketIdsOfPersonsInRoom,timeStarted,answers) {
        var results=[];
        for (var key in socketIdsOfPersonsInRoom) {
            console.log("connecteds",connecteds);
            console.log("socketIds",socketIdsOfPersonsInRoom);
            if (!connecteds) {
                console.log("connectds not set");
                return [];
            }
            console.log("connectedsKey",connecteds[key]);
            try {
                var userResult = module.exports.getUserPoint(connecteds[key], timeStarted, answers);
                var result = {
                    "amountOfPoints": userResult.amountOfPoints,
                    "amountOfCorrect": userResult.amountOfCorrect,
                    socket: connecteds[key]
                };
            } catch (err) {
                var result = {
                    "amountOfPoints": 0,
                    "amountOfCorrect": 0,
                    socket: connecteds[key]
                };
            }
                results.push(result);



        }
        return results;
    },
    getMinimum:function(results) {
        var lowest = 0;

        if (results.length==0) {
            console.log("results empty");
            return null;
        }
        for (var i = 1; i < results.length; i++ ) {
            var lowestObj = results[lowest];
            var currentObj = results[i];
            if (currentObj.amountOfCorrect > lowestObj.amountOfCorrect) {
                lowest=i;
            } else if (currentObj.amountOfCorrect == lowestObj.amountOfCorrect) {
                if (currentObj.amountOfPoints>lowestObj.amountOfPoints) {
                    lowest=i;
                }
            }
        }
        console.log("results",results)
        return results[lowest];
    },"getHillData":function(connecteds,socketIdsOfPersonsInRoom) {
        var results=[];
        for (var key in socketIdsOfPersonsInRoom) {
            if (!connecteds) {
                return [];
            }
            var socket = connecteds[key];
            var result = {
                "username":socket.username,
                "points":socket.totalPoints
            }
            results.push(result);
        }
        return results;
    }

};