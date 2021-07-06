/*
- PrgId : UT-ND-1000 
- PrgName : server.js at ndwrtc  
- Date : 2021. 07. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v2.21 
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo npm start server.js  ( or sudo forever start server.js )  
2) stop : sudo killall node ( including other node service instances )
3) desc : SWAGGER 설정 추가 
*/ 

// ============================================== F10. 기본 라이브러리 / 변수   ==============================================
'use strict'; 

const fs = require('fs');               // 파일처리 (인증서읽기)
const httpsConnect = require('https');  // 보안접속 
const express = require('express');     // 익스프레스 라이브러이 

const app  = express();                 // 노드 익스프레스앱   

// API라우터 설정  
var memberRouter  = require('./routes/member');         // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');        // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');            // 직원관리 라우터  
var userManageRouter  = require('./routes/userManage'); // 사용자API 라우터 

// 소켙라우터 설정 
var socketRouter  = require('./routes/secureSocket');   // SSL소켙라우터 
 
// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
 
// ============================================== F15. 인증서설정    ==============================================
const privateKey = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// ============================================== F20. 앱설정    ==============================================
// F21. 바디파서 설정 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 

// F22. 라우팅 설정 ------------------------------------------------------------------------------------------------ 
// 인원목록 라우팅 
app.use('/api/member', memberRouter);

// 비상호출 라우팅 
app.use('/api/emergency', emgRouter);                    

// 목록호출 라우팅 
app.use('/api/emp', empSetRouter);   

// 사용자 라우팅 (api테스트)
app.use('/api/user', userManageRouter );   

// 사용자 라우팅 (api테스트)
app.use('/socket', userManageRouter );   


// F22. 정적 데이터 설정 ---------------------------------------------------------------------------------------------
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
 
 // 소켙 통신  :  https로 바로 진행 
// app.use('/socket', socketRouter);      

//  보안적용 (제외 - 때때로 문제유발 )
// app.use(require('helmet')());
 
// ============================================== F30. API엔진 SWAGGER설정 ========================================== 
// 주의 : 아래 설정은 app listen이 있기 전에 진행! 

const swaggerUi = require('swagger-ui-express');           // SWAGGER 호출 
const swaggerJSDoc = require('swagger-jsdoc');

// import YAML from 'yamljs';                                 // json이 아닌 yaml을 통해서 설정이 진행되도록 함. 
// const swaggerUi = require('swagger-ui-express');

// const swaggerDocument = require('./swaggerSSL.json');   // json은 설정복잡
// const swaggerDocument = YAML.load('./swaggerSSL.yaml');    // yaml은 설정간단 (yamljs 임포트 필요)
 
// Swagger definition
const swaggerDefinition = {
  swagger:'2.0',
  info: {
    title: 'REST API for my App', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'This is the REST API for Member System', // short description of the app
    license: 
      {
        name : 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
  },
  host: 'myapp.nuriblock.com:443', // the host or url of the app
  basePath: '/api', // the basepath of your endpoint
  schemes:'https',
  consumes:'application/json',
  produces: 'application/json'
};

// options for the swagger docs
const swagOptions = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./api-set/**/*.yaml'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swagOptions);

// use swagger-Ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== 확인1       : http://localhost or domain/api-docs/ 
// ========== 확인2 (ssl) : https://domain:port/api-docs/ 
// 간단테스트1 : https://myapp.nuriblock.com/api/emergency
// 간단테스트2 : https://myapp.nuriblock.com/api/member?bnum=7

// User는 가상등록 참조 샘플API https://github.com/kirti/node-express-swagger-crud

// SWAGGER 사용설정  초기접속화면 : https://myapp.nuriblock.com/api-docs 
// 싱글버전 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 

// ============================================== F80. 서버생성 및 Listen ============================================== 
// 보안접속 서버 생성 
const httpsServer = httpsConnect.createServer(credentials, app);
 
httpsServer.listen(443, () => {
	 console.log('myApp  - B NODE HTTPS Server running on port 443');
});
  
 
// ==============================================  F90. 웹소켙 접속 ============================================== 
var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
 
 // 웹소켙 
const WebSocket = require('ws'); 
 
// F91. secure websocket 생성  
 
const mySocketServer = new WebSocket.Server({
    server: httpsServer,
    path: "/socket"
});
 

console.log("SC10  APP Port=" + app.get('port') ); 

/*
const mySocketServer = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
*/ 

/*
const wss = new WebSocket.Server({
  server: httpsServer,
  path: "/socket"
});
*/ 

// 소켙서버 전역설정 
// new WebSocket(mySocketServer);

 // 소켙 통신  
 // app.use('/socket', socketRouter);    

/*

// F92. socket connection 설정 
wss.on('connection', (wskt) => {
  
  let pfnow     = 0.0;        // 현재 시간 millisec 
  let curmcnt   = 0.0;        // 현재메시지 수량 

  conncnt++;  // 현재 접속 수량증대 

  wskt.send(' Connected To Socket SecureWebSocket V1.7 conncnt=' + conncnt);

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

*/ 