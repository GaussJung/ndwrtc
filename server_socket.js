/*
- PrgId : UT-ND-1000 
- PrgName : server_socket.js at ndwrtc  
- Date : 2021. 07. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v2.21 
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo npm start server_socket.js  ( or sudo forever start server.js )  
2) stop : sudo killall node ( including other node service instances )
- 사용포트 : 3000 
*/ 

// ============================================== F10. 기본 라이브러리 / 변수   ==============================================
'use strict'; 

const fs = require('fs');               // 파일처리 (인증서읽기)
// const httpsConnect = require('https');  // 보안접속 
const httpConnect = require('http');    // 일반접속 (not 보안)
const express = require('express');     // 익스프레스 라이브러리
const cors = require('cors');
const app = express();                 // 노드 익스프레스앱   
 
// API라우터 설정  
var memberRouter  = require('./routes/member');         // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');        // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');            // 직원관리 라우터  
var userManageRouter  = require('./routes/userManage'); // 사용자API 라우터 
 
// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
 
// ============================================== F15. 인증서설정    ==============================================

 

// ============================================== F20. 앱설정    ==============================================
// F21. 바디파서 설정 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 

// cors설정 
app.use(cors({
    origin: '*' 
}));

// F22. 라우팅 설정 ------------------------------------------------------------------------------------------------ 
// 인원목록 라우팅 
app.use('/api/member', memberRouter);
 
// 비상호출 라우팅 
app.use('/api/emergency', emgRouter);                    

// 목록호출 라우팅 
app.use('/api/emp', empSetRouter);   

// 사용자 라우팅 (api테스트)
app.use('/api/user', userManageRouter );   
 
// F22. 정적 데이터 설정 ---------------------------------------------------------------------------------------------
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
   
// ============================================== F80. 서버생성 및 Listen ============================================== 
// http 접속 서버 생성 ( not https )
const httpServer = httpConnect.createServer(app);
 
let webPort = 3000; 

httpServer.listen(webPort, () => {
	 console.log('MyServer HTTP Server running on port ' + webPort);
});
 
// 웹소켙 라우팅 처리 
const webSocket = require("./routes/webSocketPort"); 
// 웹소켙은 서버와 동일 포트 사용 (80, 443) 혹은 지정 
// webSocket(httpServer);

// 웹소켙 포트설정  
let socketPort = 5000; 

webSocket(httpServer, socketPort, "/socket");

 
// ==============================================  F90. 웹소켙 접속 ============================================== 
var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
 
 // 웹소켙 
const WebSocket = require('ws'); 
 
// F91 websocket 생성  
const wss = new WebSocket.Server({
    server: httpServer,
    path: "/socket"
});

console.log('Socket port=' + socketPort + " / path=/socket" );

// F92. socket connection 설정 
wss.on('connection', (wskt) => {
  
  let pfnow     = 0.0;        // 현재 시간 millisec 
  let curmcnt   = 0.0;        // 현재메시지 수량 

  conncnt++;  // 현재 접속 수량증대 

  wskt.send('SC-01. Connected To Socket SecureWebSocket conncnt=' + conncnt);

  // F92-A. binding message 
  wskt.on('message', (indata) => {

    let fmessage  = "";

    // 현재시간 ( millisec )
    pfnow = process.hrtime(); 
    curmcnt++;  // 현재메시지 수량 
    allmcnt++;  // 전체 메시지 접속수량 증대 

    // SF05. Parse Message 
    try {
        // 전달받은 메시지 fmessage = JSON.parse(indata);
        fmessage = indata; 
        // console.log( "SC91 success fmessage=" + indata ); 
    } 
    catch (err) {
      sendError(wskt, 'SC-15. Wrong format Err SE-150 err=' + err);
      return;
    }; 

 
    let metaStr = "V1.28 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
    let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
  
    console.log( "SC-20. SendMsg=" + finalMsg ); 

    wskt.send(finalMsg); 
  
  });
  // EOF F33-1. message binding 

});
 

// F93. 소켙오류처리 
const sendError = (wskt, errmessage) => {

	const messageObject = {
	   type: 'ERROR',
	   payload: errmessage,
	};
  
	let outMsg = JSON.stringify(messageObject); 
  
	console.log("SC-100. Error outMsg=" + outMsg); 
  
	// Send Error Msg 
	wskt.send(JSON.stringify(messageObject));
};
 