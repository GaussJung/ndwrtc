/*
- PrgId : UT-ND-1000 
- PrgName : server.js at ndwrtc  
- Date : 2020. 03. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v2/07 
- Description : Normal webRTC server for Untact Exam Service 
- Usage 
1) startup : sudo npm start server.js  ( or sudo forever start server.js )  
2) stop : sudo killall node ( including other node service instances )
3) desc 
*/ 

// ============================================== F10. 기본 라이브러리 / 변수   ==============================================
'use strict'; 

const fs = require('fs');               // 파일처리 (인증서읽기)
const httpsConnect = require('https');  // 보안접속 
const express = require('express');     // 익스프레스 라이브러이 

const app  = express();                 // 노드 익스프레스앱   
const io = require('socket.io');        // 소켙 객체 
 
// 인원목록 출력 
var memberRouter  = require('./routes/member');   // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');  // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');      // 직원관리 라우터  
 
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
app.use('/member', memberRouter);

// 비상호출 라우팅 
app.use('/emergency', emgRouter);                    

// 목록호출 테스트 
app.use('/emp', empSetRouter);   

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
import YAML from 'yamljs';                                 // json이 아닌 yaml을 통해서 설정이 진행되도록 함. 

// const swaggerDocument = require('./swaggerSSL.json');   // json은 설정복잡
const swaggerDocument = YAML.load('./swaggerSSL.yaml');    // yaml은 설정간단 (yamljs 임포트 필요)



// ========== 확인1       : http://localhost or domain/api-docs/ 
// ========== 확인2 (ssl) : https://domain/api-docs/ 
// 간단테스트1 : https://myapp.nuriblock.com/emergency
// 간단테스트2 : https://myapp.nuriblock.com/member?bnum=7

// User는 가상등록 참조 샘플API https://github.com/kirti/node-express-swagger-crud
import {getUserList, findUserById } from "./user";
 
const userList = getUserList(); // 데이터베이스 있는 것으로 가정 ( assume for now this is your database ) 
 

 

// SWAGGER 사용설정  초기접속화면 : https://myapp.nuriblock.com/api-docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
// ============================================== F40. 샘플 API생성  ==============================================
// GET Call for all users
app.get("/users", (req, res) => {

  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });

});

/* 
app.get("/", (req, res) => {
  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });
});
*/ 

//  POST call - Means you are adding new user into database 
app.post("/addUser", (req, res) => {

  if (!req.body.name) {
    return res.status(400).send({
      success: "false",
      message: "name is required",
    });
  } else if (!req.body.companies) {
    return res.status(400).send({
      success: "false",
      message: "companies is required",
    });
  }
  
  const user = {
    id: userList.length + 1,
    isPublic: req.body.isPublic,
    name:  req.body.name,
    companies: req.body.companies,
    books:  req.body.books
  };

  userList.push(user);

  return res.status(201).send({
    success: "true",
    message: "user added successfully",
    user,
  });

});

//  PUt call - Means you are updating new user into database 
app.put("/user/:userId", (req, res) => {
  console.log(req.params)
  const id = parseInt(req.params.userId, 10);
  const userFound=findUserById(id)
  

  if (!userFound) {
    return res.status(404).send({
      success: 'false',
      message: 'user not found',
    });
  }

  const updatedUser= {
      id: id,
      isPublic: req.body.isPublic || userFound.body.isPublic,
      name:req.body.name || userFound.body.name,
      companies: req.body.companies || userFound.body.companies,
      books: req.body.books || userFound.body.books
   };

  if (!updatedUser.name) {
    return res.status(400).send({
      success: "false",
      message: "name is required",
    });
  } else if (!updatedUser.companies) {
    return res.status(400).send({
      success: "false",
      message: "companies is required",
    });
  }

  for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === id) {
          userList[i] = updatedUser;
          return res.status(201).send({
            success: 'true',
            message: 'user updated successfully',
            updatedUser
          
          });
      }
  }

  return  res.status(404).send({
            success: 'true',
            message: 'error in update'
  });

});

//  Delete call - Means you are deleting new user from database 
app.delete("/user/:userId", (req, res) => {
  console.log(req.params)
  const id = parseInt(req.params.userId, 10);
  console.log(id)
  for(let i = 0; i < userList.length; i++){
      if(userList[i].id === id){
           userList.splice(i,1);
           return res.status(201).send({
            success: 'true',
            message: 'user deleted successfully'
          });
      }
  }

  return res.status(404).send({
              success: 'true',
              message: 'error in delete'   
  });

});


// ============================================== F80. 서버생성 및 Listen ============================================== 
// 보안접속 서버 생성 
const httpsServer = httpsConnect.createServer(credentials, app);
 
httpsServer.listen(443, () => {
	 console.log('myApp  - B NODE HTTPS Server running on port 443');
});

/*
보안접속 서버를 생성후에 Listen을 진행하였으므로 아래 항목 불필요 
app.listen(443, () => { 
   console.log("\n\n\n =============== ndwrtc v0.5 server listening on port 443");
});
*/ 

 
// ==============================================  F90. 웹소켙 접속 ============================================== 
var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
 
 // 웹소켙 
const WebSocket = require('ws'); 
 
// F91. secure websocket 생성  
const wss = new WebSocket.Server({
    server: httpsServer,
    path: "/socket"
});


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

