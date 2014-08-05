module.exports={
    "getRootUrl": function() {
        return "http://localhost:"+this.getPort()+"/";
    },
    "getPort": function() {
        return process.env.PORT || 3000;
    }
};