'use strict';

var express = require('express');

var router = express.Router();

var rcnt = 0; // 레코드 수량 
var outStr = ""; 

var apichcode = "";    // 호출 API처리코드 

// F20 ============================ DB호출 ===============================

// 일반호출 :   http://localhost/first.html
// 인명목록호출 :   http://localhost/namelist
// 인명목록호출 : 인자(최소값)  http://localhost/namelist?bnum=50
// res : response, bnum : bottom number  
function viewData(res, bnum) {
 
  const mysql         = require('mysql');
  const dbconfig      = require('../config/database.js');

  let   connection    = mysql.createConnection(dbconfig);
  let   bnumVal       = parseInt(bnum); 
  let   sqlBody       = "SELECT rcd, name FROM s_random LIMIT 0, " + bnumVal; 
   // DB접속 
   
   //  F5 

   // CF1-START
   connection.query(sqlBody, function (err, rows, fields) {
     
      if (err)  throw err;

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
        // console.log( 'VN-400 ==========  outAll = ' +  JSON.stringify(outAll) ); 
       
        // console.log( 'VN-500 ============ ENDING Conn V1.817 =============== '); 
        // res.send(outAll);  : callBack함수에서 실행 
 
        // res.send(outData);
        console.timeEnd("DBEX01"); 

     
        // 결과 문자열 
        outStr = JSON.stringify(outAll);  

        console.log("VN-IN-A11 outStr=" + outStr); 

        console.log("VN-IN-A11 V1.0 TimeEnd after DBEX01"); 
 
        // 결과 전달 
        // return res.send(outStr);

        return res.status(200).send({
            success: true,
            count: rows.length,
            chcode: apichcode,
            rowset: outAll
        });
    
      });
      // CF1-END 
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
 
// G1
// 아래와 같이 호출시에 목록을 get 및 post방식 모두로 호출함.  

// ==========================  REQ1. 회원목록숫자  =====================
// 방식1 : Get   >    localhost/namelist  호출시 목록 출력  ( ex : http://localhost/api/member?bnum=30 ) 
router.get('/', (req, res) => {

  console.log("\n\n==========  GET START V1.09 ============= " + req.query.chcode);
  let bnum  = req.query.bnum;  // similar to req.param('bnum');
  apichcode = req.query.chcode;  // api처리코드 
  console.log("==========  GET ========== VN-A1  before Post bval=" + bnum  + " / apichcode=" + apichcode);
  viewNameList(req, res, bnum); 

});

// 방식2 : Post  >    localhost/namelist  호출시 목록 출력  ( ex : http://localhost/api/member  )
router.post('/', (req, res) => {
  console.log("\n\n==========  POST V1.1 START ============= " + req.body.chcode);
  let bnum  = req.body.bnum;   // similar to 포스트 bnum 
  apichcode = req.body.chcode;  // api처리코드 
  console.log("==========  POST ==========  VN-A2  before Post bval=" + bnum + " / apichcode=" + apichcode);
  viewNameList(req, res, bnum); 
 
});
 
// ==========================  REQ3. 특정회원 가져오기 =====================
module.exports = router;
