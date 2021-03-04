'use strict'; 

const express   = require('express');
 
const app   = express();
const PORT = process.env.PORT = 3000;
 
/*

// 로거확인 (초간단)
const winston = require('winston');


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

logger.info('What rolls down stairs');
logger.info('alone or in pairs,');
logger.info('and over your neighbors dog?');
logger.warn('Whats great for a snack,');
logger.info('And fits on your back?');
logger.error('Its log, log, log');
*/ 
 

 
var bodyParser = require('body-parser');            // POST 인자 파서 
app.use(bodyParser.json());                         // POST 인자 파서 사용 
app.use(bodyParser.urlencoded({ extended: true })); // POST 인자 인코딩 
 
// 정적 데이터 디렉토리 설정 
app.use(express.static('public'));


 /*
  -- 정보레벨 로그 
  logger.info('Server listening on port 3000');
  
  logger.info('GET /');

  -- 오류레벨 로그 
  logger.error('Error message');
 */ 

// F10 ============================ 앱리스너 ===============================
app.listen(PORT, () => {
  let msg; 
  msg = "Node WebServer V1.877  is running at: " + PORT; 
  //console.log('Node WebServer V1.877  is running at:', PORT);
  console.log(msg);  // 콘솔 
 
});
/*
app.listen(90, function() {
  console.log((new Date()) + ' Server is listening on port 90 for webSocket');
});
*/
 
// F20 ============================ DB호출 ===============================

// 일반호출 :   http://localhost/first.html
// 인명목록호출 :   http://localhost/namelist
// 인명목록호출 : 인자(최소값)  http://localhost/namelist?bnum=50
// res : response, bnum : bottom number  
function viewData(res, bnum) {
 
  const mysql         = require('mysql');
  const dbconfig      = require('./config/database.js');

  let   connection    = mysql.createConnection(dbconfig);
  let   bnumVal       = parseInt(bnum); 
  let   sqlBody       = "SELECT rcd, name FROM s_random LIMIT 0, " + bnumVal; 
   // DB접속 
   
   //  F5   
  
   // CF1-START
   connection.query(sqlBody, function (err, rows, fields) {
     
      if (err) throw err;

  		// 시간측정 
   		console.time("DBEX01"); 

        // console.log(' == UserName: ', rows  );
        
        // 전체 출력 
        // res.send(rows);
        // return false; 

        let i = 0;
        let outData = ""; 
        let outTmp  = ""; 
        let rowStr; 
        let outAll = []; 

        // For-D1 
        for ( i in rows ) {

            // outTmp  = `${rowStr}<p>` ;  // 표현요소 함께 전달 ( 별로 안 좋음 )
            // console.log( i, ' >>> rowStr=', rowStr); 
            // outData += rowStr;  // 문자열 
            // outData += outTmp;  // 문자열에 줄바꿈 추가 
            // JSON객체에 객체 추가 
       
            // console.log( i, ' >>> Data Value  rcd=', rows[i].rcd, ' NAME=' + rows[i].name); 

            rowStr  = JSON.stringify(rows[i]); 
          
            outAll.push(rows[i]); 
     
        }; 
        // EOF For-D1  

        // rows 는 아래의 outAll 과 동일, 즉 레코드셑은 JSON 배열로 반환 
        console.log( 'VN-400 ==========  outAll = ' +  JSON.stringify(outAll) ); 
       
        // console.log( 'VN-500 ============ ENDING Conn V1.817 =============== '); 
        res.send(outAll);
        // res.send(outData);
        console.timeEnd("DBEX01"); 
        
      });
      // CF1-END 
 
  /* mysql.createConnection 으로 호출시 접속 종료 불필요 
    connection.end(function(err){
      if(err){
      console.log("ERR-DB2=" + err);
      }
    });

    */ 
 
}; 
// EOF viewData 


// 명칭목록 출력 이곳에서 호출 http://localhost/demo/ajaxdb.html
function viewNameList(req, res, bnum) {
 
	let bval = 0; 
	if ( bnum == null || bnum.length == 0 ) {
	   bval = 10; 
	   console.log("VN-A1 bval=" + bval); 
	}
	else {
	   bval = bnum; 
	   console.log("VN-A2 bval=" + bval); 
	}	
	// 최종 정보보이기 
  viewData(res,bval); 
  
}; 

// 일반접속이 특이하게 풀링보다 빠름. 
// G1  localhost/namelist  호출시 목록 출력
// 아래와 같이 호출시에 목록을 get 및 post방식 모두로 호출함.  
app.get('/namelist', (req, res) => {
  let bnum = req.query.bnum;  // similar to req.param('bnum');
  viewNameList(req, res, bnum); 
});

// POST 
app.post('/namelist', (req, res) => {
  let bnum = req.body.bnum;   // similar to 포스트 bnum 
  console.log("VN-A0 bval=" + bnum);
  viewNameList(req, res, bnum); 
});

 
// EOF G1 

// F30 ================  웹소켓  ========================= 
 // 호출주소 
 // 일반접속  :  ws://localhost:90
 // 보안접속  :  wss://localhost:90
const WebSocket = require('ws'); 

var allmcnt = 0;     // 전체 메시지 수량 
var conncnt = 0;     // 소켙 접속 횟수 (전체)
var socketPort = 1000; 
const wss = new WebSocket.Server({
  port: socketPort,
});


// F30. socket Error  
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
// EOF F30. 

// F31-a. socket connection test 
wss.on('connection', (wskt) => {
      
  let pfnow     = 0.0;        // 현재 시간 millisec 
  let curmcnt   = 0.0;        // 현재메시지 수량 
  
  conncnt++;  // 현재 접속 수량증대 

  wskt.send(' Connected To Rocket WebSocket V1.2 conncnt=' + conncnt);

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
    let metaStr = "Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
    let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
   
    console.log( "SC92 finalMsg=" + finalMsg ); 

    wskt.send(finalMsg); 
    
  });
  // EOF F33-1. message binding 


});
// EOF F31-a 
