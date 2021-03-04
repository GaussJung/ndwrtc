'use strict';

// 위의 use strict 미명기시 오류발생 

var express = require('express');
var router 	= express.Router();

/* GET users listing.  ( ex : 데이터베이스 접속 )
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
});

*/
 
// F30 ================  웹소켓  ========================= 
 // 호출주소 
 // 일반접속  :  ws://serverip:1000/socket
 // 보안접속  :  wss://serverip:1000/socket

 
const WebSocket = require('ws'); 

var allmcnt   = 0;     // 전체 메시지 수량 
var conncnt   = 0;     // 소켙 접속 횟수 (전체)
var socketPort = 1000; 

const webSkt = new WebSocket.Server({
  port: 1000,
});


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

// F31-a. socket connection test 
webSkt.on('connection', (wskt, request) => {
      
    // console.log(`C09. Conn Url ${request.url}`);
    let conuri =  request.url; 

    console.log( "SC10 conuri=" + conuri  ); 

    let pfnow     = 0.0;        // 현재 시간 millisec 
    let curmcnt   = 0.0;        // 현재메시지 수량 
  
    conncnt++;  // 현재 접속 수량증대 

    wskt.send('C10 Connected To Rocket WebSocket V1.4 conncnt=' + conncnt);

    // F33-1. binding message 
    wskt.on('message', (indata) => {

      let fmessage  = "";

      // 현재시간 ( millisec )
      pfnow = process.hrtime(); 
      curmcnt++;  // 현재메시지 수량 
      allmcnt++;  // 전체 메시지 접속수량 증대 
    
      // console.log( "SC90 indata=" + JSON.stringify(indata) ); 
  
      // SF05. Parse Message 
      try {
        // fmessage = JSON.parse(indata);
        fmessage = indata; 
        // console.log( "SC91 success fmessage=" + indata ); 
      } 
      catch (err) {
        sendError(wskt, 'Wrong format Err SE-150 err=' + err);
        return;
      }
      // EOF SF05. 
      let metaStr = "V1.4 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
      let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
    
      console.log( "SC92 finalMsg=" + finalMsg ); 

      wskt.send(finalMsg); 
      
    });
    // EOF F33-1. message binding 


});
// EOF F31-a 
 
module.exports = router;

