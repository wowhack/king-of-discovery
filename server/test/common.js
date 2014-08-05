global.url = require("url");
global.chai = require('chai');
global.testUtils = require('./testUtils');
global.expect = global.chai.expect;
global.should = global.chai.should();

process.env.PORT = process.env.PORT || 3030;

var exit = process.exit;

process.exit = function () {
    setTimeout(function () {
        exit();
    }, 200);
};

require('../../http.js');