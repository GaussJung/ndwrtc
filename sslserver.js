/*
- PrgId : UT-ND-1000 
- PrgName : sslserver.js at ndwrtc  
- Date : 2021. 07. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v2.24 
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo npm start sslserver.js  ( or sudo forever start sslserver.js )  
2) stop : sudo killall node ( including other node service instances )
3) desc : SWAGGER 설정 추가 
*/ 

// ============================================== F10. 기본 라이브러리 / 변수   ==============================================
'use strict'; 

const fs = require('fs');               // 파일처리 (인증서읽기)
const httpsConnect = require('https');  // 보안접속 
const express = require('express');     // 익스프레스 라이브러이 
const app = express();                  // 노드 익스프레스앱   
const cors = require('cors');           // 자원공유설정 

// API라우터 설정  
var memberRouter  = require('./routes/member');         // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');        // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');            // 직원관리 라우터  
var userManageRouter  = require('./routes/userManage'); // 사용자API 라우터 
 
// post 파서 
var bodyParser = require('body-parser');            // POST 인자 파서 
 
// ============================================== F15. 인증서설정    ==============================================
const privateKey = fs.readFileSync('/etc/letsencrypt/live/myweb.soystudy.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/myweb.soystudy.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/myweb.soystudy.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// ============================================== F20. 앱설정    ==============================================
// F21. 바디파서 설정 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 


// F21_1. 공유자원설정 
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.options('*',cors(corsOptions));
app.use(cors(corsOptions));
app.use(cors({origin : "https://wrtc.soystudy.com"}));


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
// const swaggerDocument = require('./swaggerSSL.json');      // json은 설정복잡
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
  host: 'myweb.soystudy.com:443', // the host or url of the app
  basePath: '/api', // the basepath of your endpoint
  schemes:'https',
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
// 간단테스트1 : https://myweb.soystudy.com/api/emergency
// 간단테스트2 : https://myweb.soystudy.com/api/member?bnum=7

// User는 가상등록 참조 샘플API https://github.com/kirti/node-express-swagger-crud

// SWAGGER 사용설정  초기접속화면 : https://myweb.soystudy.com/api-docs 
// 싱글버전 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
// ============================================== F80. 서버생성 및 Listen ============================================== 
// 보안접속 서버 생성 
const httpsServer = httpsConnect.createServer(credentials, app);
 
httpsServer.listen(443, () => {
	 console.log('myApp  - B NODE HTTPS Server running on port 443');
});
  
// 웹소켙 라우팅 처리 
const webSocket = require("./routes/webSocket"); 
 // 웹소켙은 서버와 동일 포트 사용 (80, 443) 혹은 지정 
webSocket(httpsServer, "/socket");


 