'use strict'; 

var express = require('express');
 
var router = express.Router();

// 데이터셑 
 
var gEmpFlagSet = require('../dataset/dataEmgSet');   // 비상호출 목록 
// var gEmpList = [];

// global.gEmpFlagSet  = gEmpFlagSet;    // 직원목록 데이터셑 호출 객체 
// global.gEmpList     = gEmpList;       // 직원목록 데이터 선언 
 
var gEmpArr     = [];       // 출동대기 직원목록 
var gEmpCnt     = 0;        // 출동대기 인원 
var gEmpOutStr  = "";       // 출동대기 직원목록 문자열화 ( with join )

// F10. 비상호출 대기 직원 정보전달 
function sendEmpDataToWeb(res, eflag) {

    gEmpArr     = [];       // 출동대기 직원목록 초기화 
    gEmpCnt     = 0;        // 출동대기 인원 초기화 
    gEmpOutStr  = "";       // 출동대기 직원목록 문자열 초기화 

    gEmpFlagSet.getEmpFlagSet(eflag);  // 글로벌 변수 100에 해당하는 목록 설정 

    setTimeout( function(){   
      // callBack 호출받은뒤에 실행 
      // 이와 같이 호출시에 결과값을 리턴받을 수 있음. (비동기값을 회피 )   
      
      gEmpArr    = gEmpFlagSet.getResulSetArr(); 
      gEmpCnt    = gEmpArr.length;
      gEmpOutStr = gEmpFlagSet.getResulSetStr(); 

      // console.log("EMP-V1 final outStr=" + gEmpOutStr) ;
       
      console.log("EMP-V2 Arr Length gEmpCnt=" + gEmpCnt) ;

      if ( gEmpCnt > 0 ) {
        // 한개라도 자료가 있을 경우 내려보냄 
        res.send(gEmpOutStr);
      }; 
   
    
    }, 100);
   
}; 
// EOF F10. 
 

/* GET users listing.  : post 필요시 post 추가 */
router.get('/', function(req, res, next) { 
    console.log("\nVN-EMP-V1.3 Get START") ;
    sendEmpDataToWeb(res, 100); 
});
 
router.post('/', function(req, res, next) {
  console.log("\nVN-EMP-V1.2 Post START") ;
  sendEmpDataToWeb(res, 100); 
  
});


module.exports = router;
