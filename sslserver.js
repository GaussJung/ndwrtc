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
 
const privateKey = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/myapp.nuriblock.com/chain.pem', 'utf8');

 
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


  
// ====================== SWAGGER ================================ 
// ========== 확인 : http://localhost/api-docs/ 

 
import { getUserList, findUserById } from "./user";
 
const userList = getUserList(); // assume for now this is your database

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger_PREV.json');

import YAML from 'yamljs';    // json이 아닌 yaml을 통해서 설정이 진행되도록 함. 

const swaggerDocument = YAML.load('./swaggerSSL.yaml');


// 간단테스트1 : https://myapp.nuriblock.com/emergency
// 간단테스트2 : https://myapp.nuriblock.com/member?bnum=7 

/*
app.listen(443, () => {
  console.log("\n\n\n =============== ndwrtc v0.5 server listening on port 443");
});
*/ 


 
app.use((req, res) => {
  let msg; 
  msg = "Node myApp-Server V0.92 is running "; 
  console.log(msg);   // 콘솔 
});

// 초기접속화면 : https://domain:443/api-docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 


console.log("============ START SWAGGER FOR SSL V1.1 ============= "); 
 
 
  
// GET Call for all users
app.get("/users", (req, res) => {

  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });
});

app.get("/", (req, res) => {
  return res.status(200).send({
    success: "true",
    message: "users",
    users: userList,
  });
});

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
})

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
})

 


//  리스터 Starting both http & https servers
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
 

httpsServer.listen(443, () => {
	console.log('myApp  - B NODE HTTPS Server running on port 443');
});


// 이하 웹소켄 접속 
var allmcnt     = 0;     // 전체 메시지 수량 
var conncnt     = 0;     // 소켙 접속 횟수 (전체)
 
 // 웹소켙 
 const WebSocket = require('ws'); 

 //  console.log(" ============== myApp Test WebServer with webSocket V0.921 ============= "); 
  
// ============== 31-a secure websocket ================= 	port: 443 
const wss = new WebSocket.Server({
    server: httpsServer,
    path: "/socket"
});


// F31-a. socket connection test 
wss.on('connection', (wskt) => {
  
  let pfnow     = 0.0;        // 현재 시간 millisec 
  let curmcnt   = 0.0;        // 현재메시지 수량 

  conncnt++;  // 현재 접속 수량증대 

  wskt.send(' Connected To Socket SecureWebSocket V1.7 conncnt=' + conncnt);

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

