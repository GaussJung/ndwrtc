'use strict';
 
var express = require('express');

var router 	= express.Router();

var Hashtable = require('jshashtable');

// F30 ================  웹소켓  ========================= 
// 호출주소 
// 일반접속  :  ws://serverip:1001/socket
// 보안접속  :  wss://serverip:1001/socket
 
const WebSocket = require('ws');    // 소켙라이브러리 호출 

var allmcnt   = 0;                  // 전체 메시지 수량 
var conncnt   = 0;                  // 소켙 접속 횟수 (전체)
var socketPort = 1001; 
var wshashtable = new Hashtable();  // 웹소켙 객체추가 

// 메인에서 해시테이블 상태확인 
global.wshashtable = wshashtable;

const webSkt = new WebSocket.Server({
  port: socketPort,
});
 

// F17. 소켙상태확인 
function checkSocketArr() {
    
    let currWss; 
    let currDeviceid; 
      
    let i = 0;
    let acnt = 0; 

    for ( i in wshashtable ) {
        acnt++; 
    }; 
    /*
    if ( wshashtable == null || wshashtable == undefined ) {
        console.log("SK11 wshash is null"); 
        return false; 
    };

    // 소켙내 접속수량 
    acnt = Object.keys(wshashtable).length; 

    // 소켙 해시내에 데이터가 없음. 
    if ( acnt == 0 ) {
        console.log("SK12no connection"); 
        return false; 
    };
*/ 
    console.log("SK135 Yes socket acnt=" + acnt); 
/*
    // ex) 디바이스 오브젝트 dObj = {"deviceid":"111111","opentm":"08:30:00","closetm":"03:00:00"} 
    for( i = 0; i < acnt ; i++ ) {

        dvObj =  wshashtable[0]; 

        console.log("DV11 dobj=" + JSON.stringify(dvObj) ); 
    
        currWss = dvObj.deviceid; 
    
        console.log("DV12 Device currDeviceid=" + currDeviceid); 
 
 
    }; 
    */ 
}; 



// F30. socket Error  
const sendError = (wskt, errmessage) => {

  const messageObject = {
     type: 'ERROR',
     payload: errmessage,
  };

  let outMsg = JSON.stringify(messageObject); 

  console.log("SC100 Error outMsg=" + outMsg); 

  // Send Error Msg 
  wskt.send(JSON.stringify(messageObject));

};
// EOF F30. 


// F29. 디바이스 분리 ws://121.11.23.3/socket?deviceid=10004&user=james --> 10004
function getDeviceId(srcURL) {

    let tmpStr = ""; 
    console.log("P10 URL=" + srcURL);
    // aaa.replace(/(.+)\.html/,"\\$1");
    
    // 인자값이 있을 경우 진행함. 
    if (srcURL.indexOf("?") === -1 ) {
         return ""; 
    }
    else {
        // deviceid인자확인 
        tmpStr = srcURL.replace(/.+deviceid=([^&]+).*/,"$1"); 
        console.log("P20 deviceid=" + tmpStr);
    }; 
}; 

// F31. 기기 오픈 전달  
function checkOpenMsg(deviceArr) {
    
    let currlWss; 
    let currDeviceid; 
    let dvObj = {};  // 디바이스 객체  
    let i = 0;
    let acnt = deviceArr.length; 

    // ex) 디바이스 오브젝트 dObj = {"deviceid":"111111","opentm":"08:30:00","closetm":"03:00:00"} 
    for( i = 0; i < acnt ; i++ ) {

        dvObj =  deviceArr[i] ; 

        console.log("DV11 dobj=" + JSON.stringify(dvObj) ); 
    
        currDeviceid = dvObj.deviceid; 
    
        console.log("DV12 Device currDeviceid=" + currDeviceid); 
 
 
    }; 
    
}; 


// F41-a. 웹소켙접속 메시지 (전달)
webSkt.on('connection', (wskt, request) => {
      
    // console.log(`C09. Conn Url ${request.url}`);
    let conuri =  request.url; 

    let deviceid = conuri.replace(/.+deviceid=([^&]+).*/,"$1");

    console.log( "SC10 conuri=" + conuri + " / deviceid=" + deviceid); 

    let pfnow     = 0.0;        // 현재 시간 millisec 

    let curmcnt   = 0.0;        // 현재메시지 수량 
   
    // 웹소켙 접속시 정보를 추가함. 
    wshashtable.put(deviceid, wskt);

    conncnt++;                  // 현재 접속 수량증대 

    wskt.send('Connected To mi WebSocket V1.4 conncnt=' + conncnt);

    wskt.send(' DEVICE STATUS SET=' +  deviceStatusSet.getResulSetStr() );
   
    let deviceSetArr = deviceStatusSet.getResulSetArr();  // 목록 배열 호출 
    let deviceSetCnt = deviceSetArr.length;  
    console.log( "DV98 Arr size=" + deviceSetArr.length); 

    // 열림 대상 확인 
    if ( deviceSetCnt > 0 ) {
        //checkOpenMsg(deviceSetArr); 
    }; 

    // 소켙상태 확인 
    checkSocketArr(); 

     // F33-1. binding message 
     wskt.on('message', (indata) => {

        let fmessage  = "";
        let deviceSetTmp = deviceStatusSet.getResulSetStr();  // 목록 값 호출 

        // 소켙상태 확인 
        //checkSocketArr(); 

        // 현재시간 ( millisec )
        pfnow = process.hrtime(); 
        curmcnt++;  // 현재메시지 수량 
        allmcnt++;  // 전체 메시지 접속수량 증대 
    
        console.log( "SC90 indata=" + JSON.stringify(indata) ); 
        // SF05. Parse Message 
        try {
            // fmessage = JSON.parse(indata);
            fmessage = indata; 
            //console.log( "SC91 success fmessage=" + indata ); 
        } 
        catch (err) {
            sendError(wskt, 'Wrong format Err SE-150 err=' + err);
            return;
        }
        // EOF SF05. 
        let metaStr = "V1.4 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
        
        let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
     
        console.log("D11K deviceSetTmp=" + deviceSetTmp ); 

        if ( deviceSetTmp != null && deviceSetTmp.length > 0 ) {
            // 소켙통신으로 기기 목록 DB결과 내보냄 
            finalMsg += "\n" + deviceSetTmp;
            console.log( "D11G finalMsg=" + finalMsg ); 
        }; 

        wskt.send(finalMsg); 
    
  });
  // EOF F33-1. message binding 
 
});
// EOF F41-a 
 
module.exports = router;

