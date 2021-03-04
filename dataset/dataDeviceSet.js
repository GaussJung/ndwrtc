 
// DB접속자 (경로에 유의할것!!)
var dbConnector = require('../config/miDBConnector');

var resultSetArr     = [];       // 결과값 배열 

var resultSetStr      = "";       // 결과값 문자열 

// 필드값 보기 
function viewField(fArr) {
    // 보기출력 변수설정 
    let fcnt = fArr.length; 
    let i = 0; 
    let fobj = {}; 

    if ( fcnt == 0 ) return false;  // 값이 없음. 

    // console.log("DG08 ArrAll=" + JSON.stringify(fArr) ); 

    // console.log("DG09 field cnt=" + fcnt ); 
  
    for ( i=0; i < fcnt; i++ ) { 
        // 필드값 출력 
        fobj = fArr[i]; 
        console.log("DG15=" + JSON.stringify(fobj) );  // 직원정보 객체 출력 
        // console.log("DG15-1 ecd=" + fobj.ecd );   // 직원번호 출력 
    }; 
}; 

// 플래그에 해당하는 정보목록 내려보내기 
function getDeviceFlagSet(statusCdVal) {
 
    let dataResultStr   = "";   // 값 전달 데이터 문자열 
 
    let sqlBody         = "";   // 접속 SQL 

    resultSetArr        = [];  // 초기화 

    resultSetStr        = "";  // 결과값 문자열 초기화 
 
    // 상태코드 정보에 따른 데이터 호출 (최대5개 - TEST)
    // sqlBody = "SELECT deviceid, devicenm, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0,2 "; 
    sqlBody = "SELECT deviceid, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 
 
    // 시간측정 
    console.time("DBK-EX03"); 

    dbConnector.getConnection(function(conn) {
              
         // 정적변수 바인딩 후에 SQL호출 
         conn.query(sqlBody,[statusCdVal]) 
            .then((results) => {
                // 결과배열 
                resultSetArr = results;  
                // 결과문자열 
                resultSetStr = JSON.stringify(resultSetArr); 
                // console.log("DG12 resultSetStr=" +  resultSetStr  ); 
                // 컬럼값 보기 (테스트시에)
                // viewField(results);  
 
                // 웹쪽에 대한 콜백 --> 소켙으로도 설정가능 
                // dbConnector.sendJSON(response, 200, output);
                console.timeEnd("DBK-EX03"); 
                //console.log('ARR-LENDATA= ' + resultSetArr.length  ); 
                // console.log('DATELENDATA= ' + resultSetArr.length + "  / resultSetStr=" + resultSetStr); 
                // 접속종료 
                conn.end();
            })
            .catch(err => {
                // 오류로그 출력 및 접속종료 
                console.log(err);
                conn.end();
            })
            
    });
 
}; 

// 결과세트 확인 
exports.getResulSetArr = function() {
  return resultSetArr;
}; 

// 결과문자열 확인 
exports.getResulSetStr = function() {
    return resultSetStr;
}; 

// 호출방법  getEmpFlagSet(100)
console.log("\nDS12-Added DataDeviceSet"); 

exports.getDeviceFlagSet = getDeviceFlagSet;  
 