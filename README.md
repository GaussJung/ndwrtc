# ndwrtc
Node를 활용한 Backend 및 Frontend 예시 프로젝트 

1. 기능 범위 
- webrtc Test
- 소켙테스트 
- API테스트 (SWAGGER) 
- React CRUD 샘플 

2. 작성자 
-  Colin Jung (cwjung123@gmail.com )
 
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
 
- 프로세스 관리도구 PM2설치 
npm install pm2 -g

- 바벨설치 (ES6사용)
npm install --save babel-core
npm install --save babel-preset-env 
npm install babel-cli -g

- 설치확인
 nodejs -v    
 > v14.15.3  --> v14.16.0 (2021. 03. 25 )  

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

5. 기본 접속 
  cd /svdata/work/ndwrtc 
- 기동     
  1) 개발모드(http to localhost) 
  sudo npm run devstart

  2_1) 운영모드 기본
  sudo npm run start 
  or
  sudo npm start sslserver.js 

  2_2) 운영모드 클러스터링 운영   
  sudo pm2 start ecosystem.config.js
    
  ※ 서버기동중인 모든 Node종료 
  sudo killall node  
   
  ※ PM2설정파일 
  ecosystem.config.js

6. 목록확인 로그확인 (with PM2)
sudo pm2 list (목록확인)
sudo pm2 logs ndwrtc (로그확인)

7. 부팅후 자동기동 
 pm2 startup
- 출력되는 문구를 붙여넣음. ( 끝 )
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
- (상태저장) sudo pm2 save ( 이후 reboot -i : 초기부터 부팅이 진행됨 )
 
### 접속페이지 ### 

- 메인페이지   
http or https://도메인 or IP/ 
 
- SWAGGER 접속 
http or https://도메인/api-docs/
 
 