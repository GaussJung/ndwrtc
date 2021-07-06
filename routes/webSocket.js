const wsModlue = require("ws");
 
// 참조 : https://nicgoon.tistory.com/235 
module.exports = function( paramServer, paramPort, paramPath ){ 

    // 웹소켓 서버 생성 
    // Simple   
    // const webSkt = new wsModlue.Server( {server:paramServer} );

    // 포트와 경로지정 
    const webSkt = new wsModlue.Server({
        server: paramServer,
        port: paramPort, 
        path: paramPath 
    });

    
    // CONTENT ========================================================================================  
    
    let allmcnt   = 0;     // 전체 메시지 수량 
    let conncnt   = 0;     // 소켙 접속 횟수 (전체)

    // F92. socket connection 설정   webSkt : 글로벌로 설정 
    webSkt.on('connection', (wskt) => {
        
        let pfnow     = 0.0;        // 현재 시간 millisec 
        let curmcnt   = 0.0;        // 현재메시지 수량 
        let fmessage  = "";

        conncnt++;                  // 현재 접속 수량증대 

        wskt.send(' Connected To Socket V1.715 conncnt=' + conncnt);

        // F92-A. binding message 
        wskt.on('message', (indata) => {
    
            // 현재시간 ( millisec )
            pfnow = process.hrtime(); 
            curmcnt++;  // 현재메시지 수량 
            allmcnt++;  // 전체 메시지 접속수량 증대 

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
            let metaStr = "V1.21 wss Time=" + pfnow + " / connAll=" + conncnt + " / msgAll=" + allmcnt + " / msgCur=" + curmcnt;
            let finalMsg = metaStr + "\n" + fmessage;  // 최종메시지 : 메타정보 + 전달메시지 
        
            console.log( "SC92 finalMsg=" + finalMsg ); 

            wskt.send(finalMsg); 
        
        });
        // EOF F33-1. message binding 
    });
    // EOF F92-A. binding message 
 
    // F93. 소켙오류처리 
    const sendError = (wskt, errmessage) => {

        const messageObject = {
            type: 'ERROR',
            payload: errmessage,
        };
    
        let errMsg = JSON.stringify(messageObject); 
    
        console.log("SC100 Error outMsg=" + errMsg); 
    
        // Send Error Msg 
        wskt.send(JSON.stringify(messageObject));
    };
    //  CONTENT ========================================================================================  
}