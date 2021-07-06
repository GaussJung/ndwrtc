'use strict';

// 위의 use strict 미명기시 오류발생 

var express = require('express');
var router 	= express.Router();
const WebSocket = require('ws'); 

var webSkt = new WebSocket.Server({
  server: httpsServer, 
  path: "/socket"
});
 
// F30 ================  웹소켓  ========================= 
 // 호출주소 
 // 일반접속  :  ws://serverip:1010/socket
 // 보안접속  :  wss://serverip:1010/socket
 
var allmcnt   = 0;     // 전체 메시지 수량 
var conncnt   = 0;     // 소켙 접속 횟수 (전체)
//var socketPort = 1001; // 소켙 주소 1000로 설정 

// F92. socket connection 설정   webSkt : 글로벌로 설정 
webSkt.on('connection', (wskt) => {
  
  let pfnow     = 0.0;        // 현재 시간 millisec 
  let curmcnt   = 0.0;        // 현재메시지 수량 

  conncnt++;  // 현재 접속 수량증대 

  wskt.send(' Connected To Socket SecureWebSocket V1.715 conncnt=' + conncnt);

  // F92-A. binding message 
  wskt.on('message', (indata) => {

    let fmessage  = "";

    // 현재시간 ( millisec )
    pfnow = process.hrtime(); 
    curmcnt++;  // 현재메시지 수량 
    allmcnt++;  // 전체 메시지 접속수량 증대 

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
    let metaStr = "V1.21 wss Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
    let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
  
    console.log( "SC92 finalMsg=" + finalMsg ); 

    wskt.send(finalMsg); 
  
  });
  // EOF F33-1. message binding 

});
// EOF F92-A. binding message 


// F93. 소켙오류처리 
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
// EOF F93 

module.exports = router;

