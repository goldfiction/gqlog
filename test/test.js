/**
 * Created by happy on 4/26/17.
 */
var assert=require('assert')
var gqlog

before(function(done){
    gqlog=require('../gqlog.js')
    done()
})

it("should be able to log",function(done){
    gqlog.log("hello")
    done()
})

it("should be able to error",function(done){
    try{
        var ddd=require("broken code")
    }catch(e){
        gqlog.error(e)
        setTimeout(function(){
            done()
        },2000)
    }
})

it("should be able to debug",function(done){
    gqlog.debug("hello")
    done()
})

it("should be able to get/set/log to file",function(done){
    var setting=gqlog.get()
    setting.logFile="application.log";
    gqlog.debug(setting)
    gqlog.log("this should be logged to a file")
    setTimeout(function(){
        done()
    },2000)
})