# ndwrtc

Soynet Untact-Exam 팀 Test 프로젝트 

1. 프로젝트 범위 
- webrtc Test
- 시험 외부 연계 

2. 구성원 
- Team Leader : 정철웅 cwjung@soynet.io 
- Team Member : 김영훈 haa3163314@soynet.io

3. 설치 및 환경 (as ubuntu) 
- AWS EC2 micro freetier 설치 
- 서버최신화 
  sudo apt-get update
- 노드 V14. 설치
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

- 익스프레스 설치
sudo npm install -g express

- 익스프레스 생성기
sudo npm install -g express-generator

- 설치확인
 nodejs -v  
 > v14.15.3 

- 백그라운드 기동 forever 설치
sudo npm install -g forever


4. 소스복제 
- 기본디렉토리 생성
sudo mkdir /svdata 
cd /svdata
sudo mddir work 

- 기본디렉토리 이동 ( /svdata/work )
- git 클론 
  git clone https://github.com/GaussJung/ndwrtc  
- 기동 
  cd ndwrtc 


5. 기본 접속 데모 
- 기동   
  sudo forever start server.js ( 영구동작 )
  sudo npm start server.js ( ssh 접속중 동작, 로그파일 확인가능  ) 

- 메인페이지 
http://utest.soymlops.com:3010/

- 소켙테스트 
http://utest.soymlops.com:3010/demo/wstest.html 

- 소켙주소  
ws://utest.soymlops.com:1010/socket 
 
 

6. 보안 주소 접속 
- 기동   
  sudo forever start sslsvr.js ( 영구동작 )
  sudo npm start sslsvr.js ( ssh 접속중 동작, 로그파일 확인가능  ) 


- 메인페이지 
https://utest.soymlops.com/

- 소켙테스트 
https://utest.soymlops.com/demo/wstest.html 

- 소켙주소  
wss://utest.soymlops.com:1010/socket 
