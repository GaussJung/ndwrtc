

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

const express   = require('express');

const app  = express();
 
const fs = require('fs');

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
var socketRouter  = require('./routes/socket');    // 소켙통신 

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
 
 // 소켙 통신  
app.use('/socket', socketRouter);                


// 인증서 적용 
const privateKey = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/utest.soymlops.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


 
app.use((req, res) => {
  let msg; 

  msg = "Node Utest-Server V1.883 is running "; 
 
  console.log(msg);   // 콘솔 
});

//  리스터 Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('UTEST wrtc 0.27 HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('UTEST wrtc 0.27 HTTPS Server running on port 443');
});
