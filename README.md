# ndwrtc

 SoyEdu Untact-Exam 팀 Test 프로젝트 

1. 프로젝트 범위 
- webrtc Test
- 시험 외부 연계 

2. 구성원 
- Team Leader : JCW ( cwjung123@gmail.com )
- youngHoon 

3. 설치 및 환경 (as ubuntu) 
- AWS EC2 micro freetier 설치 
- 서버최신화 
  sudo apt-get update
- 노드 V14. 설치
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install yarn
sudo apt-get install -y nodejs

- 익스프레스 설치
sudo npm install -g express

- 익스프레스 생성기
sudo npm install -g express-generator

- 설치확인
 nodejs -v  
 > v14.15.3  --> v14.16.0 (2021. 03. 25 )

- 백그라운드 기동 forever 설치
sudo npm install -g forever


4. 소스복제 
- 기본디렉토리 생성
sudo mkdir /svdata 
cd /svdata
sudo mkdir work 

- 기본디렉토리 이동 ( /svdata/work )
- git 클론 
  git clone https://github.com/GaussJung/ndwrtc  
- 기동 
  cd ndwrtc 
- npm install 

5. 기본 접속 데모 
- 기동   
  sudo forever start server.js ( 영구동작 )
  sudo npm start server.js ( ssh 접속중 동작, 로그파일 확인가능  ) 

- 메인페이지 
http://도메인 or IP:3010/

- 소켙테스트 
http://도메인 or IP:3010/demo/wstest.html 

- 소켙주소  
ws://도메인 or IP:1010/socket 
 
 

6. 보안 주소 접속 

- SSL인증서 발행 및 적용 :  let's encrypt or AWS Certificate with ALB 
- 기동   
  sudo forever start sslsvr.js ( 영구동작 )
  sudo npm start sslsvr.js ( ssh 접속중 동작, 로그파일 확인가능  ) 


- 메인페이지 
https://도메인/

- 소켙테스트 
https://도메인/demo/wstest.html 

- 소켙주소  
wss://도메인:1010/socket 
