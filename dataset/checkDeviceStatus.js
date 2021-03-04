'use strict'; 

// VER 1.0 for checkDeviceStatus 
// 기기 상태를 점검하는 프로그램 
 

// 상태목록 호출 라이브러리  (경로명에 유의 ./)
var deviceStatusSet = require('./dataDeviceSetPool');   
var deviceArr     = [];       // 설정상태 기기목록 콜렉션
var deviceCnt     = 0;        // 설정상태 기기수량 
 
 // 글로벌 변수선언 
 global.deviceStatusSet = deviceStatusSet; 
 
// F10. 기기세트 정보전달 Good 
function setDeviceStatusList(statusCdVal) {
    // 모듈에서 데이터셑 호출 
    deviceStatusSet.getDeviceFlagSet(statusCdVal)
    .then( function(results){ 
        // 공용 결과셑에 설정 
        deviceArr = results; 
        // 결과셑 수량 확인 
        deviceCnt = deviceArr.length; 
    })
    .catch(function(err){
        console.log("P10 Promise rejection error: " + err);
    });
 
}; 
// EOF F10
 

 // 기기상태 점검 타이머
var deviceStatusChecker;            
var deviceCheckCnt      = 0;    // 체크 횟수 
var deviceCheckTime     = 500; // 0.1초 (100) ~ 5초 (5000) 간격으로 타임체크 

// F015. 타이머 기동 
function startDeviceChecker(statusCdVal) {

    console.log("\nDCC-100 START deviceStatusChecker "); 	
    
    // 체크 횟수 초기화 
    deviceCheckCnt = 0; 

    // 특정 시간 간격으로 체크진행 
    deviceStatusChecker = setInterval(function () {  					 		 
         
        // deviceArr     = [];  // 기기배열 
        // deviceCnt     = 0;   // 기기목록 수량 
        // 상태목록 데이터 저장      
        setDeviceStatusList(statusCdVal); 
 
        // 열림메시지 확인 
        checkOpenMsg(deviceArr); 

        deviceCheckCnt++; // 체크횟수 1증대 
        
        console.log("\nDCC-100 RUN check Cnt=" + deviceCheckCnt + " / devicecnt=" + deviceCnt ); 

    }, deviceCheckTime );	  	 

}; 
// EOF F15. 체크타이머   
 
// F16. 체커 기동중지 
function stopDeviceChecker() {
    
    if ( deviceStatusChecker != null ) {
        console.log("DCC-200 STOP deviceStatusChecker "); 
        clearInterval(deviceStatusChecker);
    };

}; 
 
// F17. 소켙상태확인 
function checkSocketOpen(paramDeviceId) {
    
    let currWss = wshashtable.get(paramDeviceId); 
 
    if ( currWss == null || currWss == undefined ) {
        console.log("SK11 ws no connect for " + paramDeviceId ); 
        return false; 
    }
    else {
        console.log("SK11 ws for " + paramDeviceId + " >> open request!!"); 
        currWss.send("============= Open the Door Right Now!! ======================== "); 
    }; 
   
}; 
 
// F31. 기기 오픈 전달  
function checkOpenMsg(deviceArr) {
    
    let currlWss; 
    let currDeviceid; 
    let dvObj = {};  // 디바이스 객체  
    let i = 0;
    let acnt = 0; 
    
    
    if ( deviceArr != null && deviceArr != undefined ) {
        acnt = deviceArr.length; 
    }; 

    // ex) 디바이스 오브젝트 dObj = {"deviceid":"111111","opentm":"08:30:00","closetm":"03:00:00"} 
    for( i = 0; i < acnt ; i++ ) {

         dvObj =  deviceArr[i] ; 

        // console.log("DV11 dobj=" + JSON.stringify(dvObj) ); 
    
        currDeviceid = dvObj.deviceid; 
    
        // console.log("DV12 Device currDeviceid=" + currDeviceid); 

        checkSocketOpen(currDeviceid);
 
    }; 
    
}; 
 
// 기동과 동시에 A상태의 기기목록 호출 
// startDeviceChecker("A"); 
  
exports.startDeviceChecker = startDeviceChecker; 