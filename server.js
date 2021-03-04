'use strict'; 

const express   = require('express');
 
const app   = express();
const PORT = process.env.PORT = 3000;
 
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
 
 // 소켙 통신  
app.use('/socket', socketRouter);                

// F10 ============================ 앱리스너 ===============================
app.listen(PORT, () => {
  let msg; 
  msg = "Node SocketServer V1.879 is running at: " + PORT; 
  //console.log('Node WebServer V1.877  is running at:', PORT);
  console.log(msg);   // 콘솔 
 
}); 


  