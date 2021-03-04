// 마리아 DB 설정 
const mariadb = require('mariadb');
var dbconfig = require('./mariaDBConfig');  // 동일 디렉토리 설정화일 확인 

// 접속 풀설정 : 접속 수량 7개 
const pool = mariadb.createPool({
    host: dbconfig.host,
    port: dbconfig.port,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    connectionLimit: 3 
});


// DB접속자 
function dbConnector() {

    // 접속정보 가져오기 
    this.getConnection = function(callback) {
        pool.getConnection()
            .then(conn => {
                callback(conn);
            }).catch(err => {
            //not connected
        });
    };

    // 비동기 접속 
    this.getConnectionAsync = async function() {
        try {
            let conn = await pool.getConnection();
            // console.log("conn = " + conn); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
            return conn;
        } 
        catch (err) {
            throw err;
        }
        return null;
    };

    // JSON 데이터 전달 
    this.sendJSON = function(response, httpCode, body) {
         let result = JSON.stringify(body);
         // response.send(httpCode, result);
         response.send( result);
    };
    
}

module.exports = new dbConnector();