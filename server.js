

/*
- PrgId : UT-ND-1000 
- PrgName : server.js at ndwrtc  
- Date : 2020. 03. 04 
- Creator : C.W. Jung ( cwjung@soynet.io )
- Version : v0.313  
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

// 익스프레스 앱객체 생성 
const app  = express();

// 소켙IO생성 
const io = require('socket.io'); 

 

// 인원목록 출력 
var memberRouter  = require('./routes/member');    // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');    // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');

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

// 보안적용 
// app.use(require('helmet')());
 

  /*
app.use((req, res) => {
  let msg; 
  msg = "Node Utest-Server V1.884 is running "; 
  // console.log(msg);   // 콘솔 
});
*/

 

//  리스터 Starting both http & https servers
const httpServer = http.createServer(app);
 
httpServer.listen(80, () => {
	 console.log('UTEST wrtc 0.91 HTTP Server running on port 80');
});

 
// ====================== SWAGGER ================================ 
// ========== 확인 : http://localhost/api-docs/ 

 
import { getUserList ,findUserById } from "./user";
 
const userList = getUserList(); // assume for now this is your database

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger_PREV.json');

import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

// 초기접속화면 : https://domain:80/api-docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
/*

  app.listen(8000, () => {
    console.log("\n\n\n =============== ndwrtc v0.5 5000 server listening on port 5000!");
  });

*/ 
  
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

