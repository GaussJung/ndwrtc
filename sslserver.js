/*
- PrgId : UT-ND-1000 
- PrgName : server.js at ndwrtc  
- Date : 2020. 03. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v0.312  
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo node server.js  ( or sudo forever start server.js )  
2) stop : sudo killall node ( including other node service instances )
3) desc 
*/ 

'use strict'; 

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app  = express();
 
const io = require('socket.io'); 

// 인원목록 출력 
var memberRouter  = require('./routes/member');    // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');    // 비상호출 라우터 
var empSetRouter   = require('./routes/emp');

// 데이터셑 
 /*
var gEmpFlagSet = require('./dataset/dataEmgSet');   // 비상호출 목록 

var gEmpArr = [];     // 출동대기 직원목록 
var gEmpOutStr = "";  // 출동대기 직원목록 문자열화 ( with join )

global.gEmpFlagSet  = gEmpFlagSet;        // 직원목록 데이터셑 호출 객체 
global.gEmpArr      = gEmpArr;            // 출동대기 직원목록 프로젝트 전역변수 선언 
global.gEmpOutStr   = gEmpOutStr;         // 출동대기 직원목록 문자열 프로젝트 전역변수 선언 
 */ 
// 소켙 
// var socketRouter  = require('./routes/secureSocket');    // 소켙통신 

// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 

// 인원목록 라우팅 
app.use('/member', memberRouter);

// 비상호출 라우팅 
app.use('/emergency', emgRouter);                    

// 목록호출 테스트 
app.use('/emp', empSetRouter);   

// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
 
 // 소켙 통신  :  https로 바로 진행 
// app.use('/socket', socketRouter);      

//  보안적용 
// app.use(require('helmet')());

// 인증서 적용 
 
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr/chain.pem', 'utf8');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/chain.pem', 'utf8');



const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


 
app.use((req, res) => {
  let msg; 

  msg = "Node myApp-Server V0.91 is running "; 
 
  console.log(msg);   // 콘솔 
});

//  리스터 Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('myApp V0.91 NODE HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('myApp V0.91 NODE HTTPS Server running on port 443');
});


// 이하 웹소켄 접속 
 
var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
 
 // 웹소켙 
 const WebSocket = require('ws'); 

  console.log("SC109 11 SecureSocket ========== "); 
   
  // ============== 31-a secure websocket ================= 
  const wss = new WebSocket.Server({
	server: httpsServer,
	path: "/socket"
  });
 
  
  // F31-a. socket connection test 
  wss.on('connection', (wskt) => {
		
	let pfnow     = 0.0;        // 현재 시간 millisec 
	let curmcnt   = 0.0;        // 현재메시지 수량 
	
	conncnt++;  // 현재 접속 수량증대 
  
	wskt.send(' Connected To Rocket SecureWebSocket V1.61 conncnt=' + conncnt);
  
	// F33-1. binding message 
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
  // EOF F31-a  secureSocket 


 // =========== 31-b.  normal websocket ===============
 const webSkt = new WebSocket.Server({
	server: httpServer,
	port: 1000,
	path: "/socket"
});
 

//   socket connection test 
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
      let metaStr = "V1.41 Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
      let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
    
      console.log( "SC92 finalMsg=" + finalMsg ); 

      wskt.send(finalMsg); 
      
    });
    // EOF F33-1. message binding 
 
});
// EOF F31-b normal socket 



// F30-c. socket Error  
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
  // EOF F30-c. 