FROM node:14

WORKDIR /usr/src/app

# 로컬환경의 파일을 컨테이너에 복사
COPY ./ ./

# express, Redis 설치
RUN npm install

# 컨테이너가 시작될 때, 서비스를 시작하기위한 실행 명령어를 작성.
CMD ["node","server.js"]