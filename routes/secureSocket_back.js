'use strict'; 
 
var express 	= require('express');
var router 	  = express.Router();
 
const app  = express();


const fs = require('fs');
const https = require('https');
/* GET users listing. 
router.get('/', function(req, res, next) {
   res.send('respond with a resource');
});

*/


// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 

  
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
 
 

// 인증서 적용 
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/chain.pem', 'utf8');

 
app.use((req, res) => {

  let msg; 

  msg = "Node SSL Utest-Server V1.885 is running "; 
 
  console.log(msg);   // 콘솔 
});
// F30 ================  보안 웹소켓  ========================= 
 // 호출주소 
 // 일반접속  :  ws://serverip:88
 // 보안접속  :  wss://serverip:88  (여기에 해당)
  // wss://app.joeunname.co.kr:443/secureSocket 
  
 const privateKey = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/app.joeunname.co.kr//chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log('UTEST wrtc 0.282 HTTPS Server running on port 443');
  });
  


const WebSocket = require('ws'); 

var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
var socketPort  = 443;  // 소켙 주소 1030번으로 설정
/*const wss = new WebSocket.Server({
  port: socketPort,
});
*/


const wss = new WebSocket.Server({
  server: httpsServer
});

console.log("SC109 SecureSocket  ===============  socketPort=" +  socketPort); 


// F30. socket Error  
const sendError = (wskt, errmessage) => {

  const messageObject = {
     type: 'ERROR',
     payload: errmessage,
  };

  let outMsg = JSON.stringify(messageObject); 

  console.log("SC110 SecureSocket Error outMsg=" + outMsg); 

  // Send Error Msg 
  wskt.send(JSON.stringify(messageObject));
};
// EOF F30. 

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
    let metaStr = "V1.21 wss Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
    let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
   
    console.log( "SC92 finalMsg=" + finalMsg ); 

    wskt.send(finalMsg); 
    
  });
  // EOF F33-1. message binding 


});
// EOF F31-a 
 
module.exports = router;

 
 