const wsModlue = require("ws");
 
// 참조 : https://nicgoon.tistory.com/235 
module.exports = function( paramServer ){ 
    // 웹소켓 서버 생성 
    const wss = new wsModlue.Server( {server:paramServer} );

    // 클리이언트가 접속 이벤트 메소드 
    wss.on( 'connection', function( ws, req ){

        // 사용자 접속IP 
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log( ip + "아이피의 클라이언트로 부터 접속 요청이 있었습니다." );

        // 메시지 수신 
        ws.on('message', function( message ){

            // 받은 메시지를 출력합니다.
            console.log( ip + "  --->  " + message );

            // 클라이언트에 받은 메시지를 그대로 보내, 통신이 잘되고 있는지 확인합니다.
            ws.send( "V1.1 echo:" + message );

        });

        // 오류가 발생한 경우 호출되는 이벤트 메소드 입니다.
        ws.on('error', function(error){
            console.log( ip + "  --->  " + error );
        })

        // 접속이 종료되면, 호출되는 이벤트 메소드 입니다.
        ws.on('close', function(){
            console.log( ip + "  ---> 접속종료 " );
        })


    });


}