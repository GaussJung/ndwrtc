'use strict'; 

// VER 1.0 for ncsocket 
const express   = require('express');
 
const app   = express();
const PORT = process.env.PORT = 3000;
 
// 인원목록 출력 
var memberRouter  = require('./routes/member');    // 회원목록 라우터 
var emgRouter     = require('./routes/emgCall');    // 비상호출 라우터 
var empSetRouter  = require('./routes/emp');


// 소켙 
var socketRouter  = require('./routes/misocket');    // 소켙통신 

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
 
 // 소켙 통신  
app.use('/misocket', socketRouter);                


// 상태목록 호출 라이브러리  (경로명에 유의)
var deviceStatusSet = require('./dataset/dataDeviceSet');   

var deviceArr     = [];       // 설정상태 기기목록 콜렉션
var deviceCnt     = 0;        // 설정상태 기기수량 
var deviceOutStr  = "";       // 설정상태 기기목록 문자열 

 // 글로벌 변수선언 
 global.deviceStatusSet = deviceStatusSet; 
 
// F10. 비상호출 대기 직원 정보전달 
function setDeviceStatusList(statusCdVal) {

    // deviceArr     = [];       // 설정상태 기기목록 콜렉션 초기화 
    // deviceCnt     = 0;        // 설정상태 수량 초기화 
    // deviceOutStr  = "";       // 설정상태 기기목록 문자열 초기화  

    deviceStatusSet.getDeviceFlagSet(statusCdVal);  // 상태코드값에 해당하는 콜렉션 설정 

    setTimeout( function(){   
        // callBack 호출받은뒤에 실행 
        // 이와 같이 호출시에 결과값을 리턴받을 수 있음. (비동기값을 회피 )   
        deviceArr      = deviceStatusSet.getResulSetArr(); 
        deviceCnt      = deviceArr.length;
        deviceOutStr   = deviceStatusSet.getResulSetStr(); 

      
        console.log("DVC-V3 dcnt=" + deviceCnt );

        if ( deviceCnt > 0 ) {
            // 한개라도 자료가 있을 경우 내려보냄 
             console.log("DVC-V4 result=" + deviceOutStr);
        }; 
   
    }, 100);
   
}; 
// EOF F10. 
 

 // 기기상태 점검 타이머
var deviceStatusChecker;            
var deviceCheckCnt      = 0;    // 체크 횟수 
var deviceCheckTime     = 2000; // 0.1초 간격으로 타임체크 

// F015. 타이머 기동 
function startDeviceChecker(statusCdVal) {

    console.log("\nDCC-100 START deviceStatusChecker "); 	
    
    // 체크 횟수 초기화 
    deviceCheckCnt = 0; 

    // 특정 시간 간격으로 체크진행 
    deviceStatusChecker = setInterval(function () {  					 		 
         
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
    let acnt = deviceArr.length; 

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
startDeviceChecker("A"); 
 
// F20 ============================ 앱리스너 : 소켙만 열경우 필요없음 ===============================
 
app.listen(PORT, () => {
  let msg; 
  msg = "miSocketServer V1.882 is running at: " + PORT; 
  //console.log('Node WebServer V1.877  is running at:', PORT);
  console.log(msg);   // 콘솔 
}); 
 
  