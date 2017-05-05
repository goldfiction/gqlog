/**
 * Created by happy on 3/4/17.
 */

// please make sure you add a fixed version number for this module to package.json when referencing
// so your app does not break when this module updates

var gqemail=require('gqemail');
var emailit=gqemail.emailit;
var fs=require("fs");
var file=null;

var setting={
    level:1, // logging level, change to higher to reduce logging
    sendError:null, // set this value to "a@bc.com" will send error log to that email
    logFile:"develop.log",  // the file to append log to
    logTime:true  // whether to log time in logs
};

function set(setting_in){
    setting_in=setting_in||{};
    for(var i in setting_in){
        setting[i]=setting_in[i];
    }
    return setting;
}

function get(){
    return setting;
}

function tryLogFile(msg){
    if(setting.logFile){
        setTimeout(function(){
            msg+="\n";
            fs.appendFile(setting.logFile,msg,function(e){
                if(e)
                    console.log(e);
            })
        },1);
    }
}

function tidyMsg(msg,prepend,postpend){
    prepend=prepend||"";
    postpend=postpend||"";
    if(typeof msg=="object"){
        msg=JSON.stringify(msg,null,2);
    }else{
        msg=msg+"";
    }
    msg=prepend+msg+postpend;
    if(setting.logTime){
        var date=new Date().toISOString();
        msg=date+"\n"+msg
    }
    return msg;
}

function tryLog(msg,prepend,postpend){
    if(msg){
        setTimeout(function(){
            msg=tidyMsg(msg,prepend,postpend);
            console.log(msg);
            tryLogFile(msg);
        },1);
    }
    return msg;
}

function tryEmail(msg,prepend,postpend){
    if(msg){
        msg=tidyMsg(msg,prepend,postpend);
        setTimeout(function(){
            emailit({
                to:setting.sendError||"notify553@gmail.com",
                text:msg,
                html:msg
            })
        },1)
    }
}

function error(error,level){
    level=level||5;
    if(error && level>=setting.level) {
        if(error.stack) {
            var stack = error.stack;
            error = JSON.stringify(error, null, 2);
            error += "\n" + stack;
        }
        else{
            error = JSON.stringify(error, null, 2);
        }
        tryLog(error,"Error: ");
        if (setting.sendError)
            tryEmail(error,"Error: ")
    }
    return error;
}

function log(msg,level){
    //1 - Low Level
    //2 - Debug
    //3 - Info
    //4 - Warning
    //5 - Error
    level=level||2;
    if(level>=setting.level)
        tryLog(msg, "Log: ");
    return msg;
}

function globalOverride(){
    global.log=log;
    global.error=error;
}

globalOverride();

exports.set=set;
exports.get=get;
exports.error=error;
exports.log=log;
exports.globalOverride=globalOverride;