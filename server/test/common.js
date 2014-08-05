global.url = require("url");
global.chai = require('chai');
global.socketclient = require("socket.io-client");
global.expect = global.chai.expect;
global.should = global.chai.should();
global.assert = global.chai.assert;
process.env.PORT = process.env.PORT || 3030;

var exit = process.exit;

process.exit = function () {
    setTimeout(function () {
        exit();
    }, 200);
};

