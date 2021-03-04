 'use strict'; 
 
 // F20 ============================ DB호출 : 방식2 프리미스 + 접속 Pool  ===============================
  
const mariadb       = require('mariadb/callback');
const dbconfig      = require('../config/miDBConfig');   // 동일 디렉토리 설정화일 확인 
 
// F30. 접속 Pool 정의 
const dbpool = mariadb.createPool({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 10
});
 
// F100.  플래그에 해당하는 정보목록 내려보내기 
function getDeviceFlagSet (statusCdVal) { 
  
    // 인자확인 
    // console.log("DG150 Param statusCdVal=" + statusCdVal ); 

    // 정적 바인딩으로 데이터 호출 
    let sqlBody = "SELECT deviceid, opentm, closetm FROM biz_device_info WHERE statuscd = ? Limit 0, 5"; 
  
    return new Promise(function(resolve, reject){
        // if DP1. 풀접속 
        dbpool.getConnection((cerr, conn) => {
            // if E1. 접속진행 
            if (cerr) {
              reject(new Error("E101-connection is undefined cerr=" + cerr));
              conn.end(); 
            } 
            else {
                console.log("V1.1 connected ! connection id is " + conn.threadId);

                // SQ1 호출 (qerr : query error )
                conn.query(sqlBody,  [statusCdVal], function(qerr, results){           

                    if( results === undefined){
                        reject(new Error("E101-results is undefined qerr=" + qerr));
                        conn.end(); 
                    }
                    else{
                        // 성공함 
                        console.log('S101-results=' + JSON.stringify(results) ) ; 
                        resolve(results);
                        conn.end(); 
                    };
                })
                // EOF SQ. conn.quert 
            }; 
            // EOF E1 
        });
        // EOF. DP1
    });
    // EOF Promise PM-A
}; 
// EOF F100 
  
// 호출방법  getEmpFlagSet(100)
console.log("\nDS V1.7 DataDeviceSet - using pool "); 

 
exports.getDeviceFlagSet = getDeviceFlagSet;  
 
/*   
    호출방법 
    let deviceArr = []; 
    let deviceCnt = 0; 
    
    deviceStatusSet.getDeviceFlagSet(statusCdVal)
    .then( function(results){ 
        // 공용결과셑에 설정 
        deviceArr = results; 
        // 레코드 수량 확인 
        deviceCnt = deviceArr.length; 
    })
    .catch(function(err){
        console.log("P10 Promise rejection error: " + err);
    });
  
  */ 