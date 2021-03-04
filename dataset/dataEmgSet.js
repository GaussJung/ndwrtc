 
var dbConnector = require('../config/dbConnector');


var resultSetArr            = [];       // 결과값 배열 
var resultSetStr            = "";       // 결과값 문자열 

// 필드값 보기 
function viewField(fArr) {
  
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
function getEmpFlagSet(eflagVal) {
 
    let dataResultStr   = "";  // 값 전달 데이터 문자열 
 
    let sqlBody         = ""; 

    resultSetArr  = [];  // 초기화 
    resultSetStr  = "";  // 결과값 문자열 초기화 

    // console.log("DG150 eflagVal=" + eflagVal ); 
    // 정적 바인딩으로 데이터 호출 
    sqlBody = "SELECT ecd, empname, eflag FROM ex_emp WHERE eflag = ? "; 
    // sqlBody = "SELECT ecd, empname, eflag FROM ex_emp LIMIT 0, 3"; 
  
    // 시간측정 
      console.time("DBS-EX02"); 

     dbConnector.getConnection(function(conn) {
             
          // 정적변수 바인딩 없는 SQL호출 conn.query(sqlBody)
          // 정적변수 바인딩 후에 SQL호출 
         conn.query(sqlBody,[eflagVal])
            .then((results) => {
                    
                // console.log(results); //[ {val: 1}, meta: ... ]
 
                // 결과배열 
                resultSetArr = results;  
 
                resultSetStr = JSON.stringify(resultSetArr); 
                // console.log("DG12 resultSetStr=" +  resultSetStr  ); 
                
                // 컬럼값 보기 
                // viewField(results);  
 
                // 웹쪽에 대한 콜백 
                // dbConnector.sendJSON(response, 200, output);
                console.timeEnd("DBS-EX02"); 

                console.log('DATELENDATA= ' + resultSetArr.length + "  / resultSetStr=" + resultSetStr); 
                conn.end();
            })
            .catch(err => {
                //handle error
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
console.log("\nDS11-Added DataEmgSet"); 

exports.getEmpFlagSet = getEmpFlagSet;  
 