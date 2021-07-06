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
// const httpsConnect = require('https');  // 보안접속 
const httpConnect = require('http');    // 일반접속 (not 보안)
const express = require('express');     // 익스프레스 라이브러이 
const app = express();                 // 노드 익스프레스앱   
 
// API라우터 설정  
var memberRouter  = require('./routes/member');         // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');        // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');            // 직원관리 라우터  
var userManageRouter  = require('./routes/userManage'); // 사용자API 라우터 
 
// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
 
// ============================================== F15. 인증서설정    ==============================================

/*
// 일반 접속이므로 인증서 설정 불필요 
const privateKey = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
*/ 

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
 
// F22. 정적 데이터 설정 ---------------------------------------------------------------------------------------------
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));

// 노드 라이브러리 바로 사용 v0.313 
app.use(express.static('node_modules'));
 
// ============================================== F30. API엔진 SWAGGER설정 ========================================== 
// 주의 : 아래 설정은 app listen이 있기 전에 진행! 

const swaggerUi = require('swagger-ui-express');           // SWAGGER 호출 
const swaggerJSDoc = require('swagger-jsdoc');

// import YAML from 'yamljs';                                 // json이 아닌 yaml을 통해서 설정이 진행되도록 함. 
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');      // json은 설정복잡
// const swaggerDocument = YAML.load('./swagger.yaml');    // yaml은 설정간단 (yamljs 임포트 필요)
 
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
  //host: 'myapp.nuriblock.com:80', // the host or url of the app
  host: 'myapp.nuriblock.com:80', // the host or url of the app
  basePath: '/api', // the basepath of your endpoint
  schemes:'http',   // SSL접속 아닌 기본 접속 
  consumes:'application/json',
  produces: 'application/json'
};

// API문서설정경로 
const swagOptions = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./api-set/**/*.yaml'],
};

// 초기화 swagger-jsdoc
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
// 보안접속 서버 생성 ( not https )
const httpServer = httpConnect.createServer(app);
 
httpServer.listen(80, () => {
	 console.log('UTEST wrtc 0.92 HTTP Server running on port 80');
});
 
// 웹소켙 라우팅 처리 
const webSocket = require("./routes/webSocket"); 
// 웹소켙은 서버와 동일 포트 사용 (80, 443) 혹은 지정 
// webSocket(httpServer);

// 별도 포트 생성 
webSocket(httpServer, 80, "/socket");

 