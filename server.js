// 모듈을 가져옴.
const express = require("express");
const redis = require("redis");

// Redis 서버와 접속하기 위한 Redis 클라이언트 생성.
const client = redis.createClient({
    socket:{
        host:"redis-server",
        port:6379 //Redis 의 기본 포트
    }
});

// 서비스를 위한 애플리케이션 생성.
const app = express();

// 숫자 값을 0으로 초기화.
// Redis 클라이언트를 사용해서 Redis의 서버에 숫자 값을 초기화.
client.set("number",0); // key, value 형태로 값을 초기화.

// 브라우저로 부터 request 요청을 받은 경우의 서비스 처리
// 서비스 처리 : node -> redis 서버로 통신하는 것임.(async 통신이 필요함.) - 비동기통신
app.get('/', async(req, res) => {
    // Redis client 를 사용해서 Redis 서버와 통신을 하면 됨.
    // await 를 사용하게 되면, node app client 에서 접속하기까지
    // 기다리지 않아도 됨.
    await client.connect();

    // Redis 서버로부터 key에 대한 값을 받아옴.
    // 비동기 통신을 해야함. 그래서, await 를 사용.
    let number = await client.get('number');

    // number 값 초기화 확인.
    if (number === null) {
        number=0;
    }

    console.log('Number : ' + number);

    // 클라이언트(웹 브라우저)로 결과값을 response 함.
    res.send("숫자가 1씩 증가. 숫자 : " + number);

    // Redis 서버에 number 값을 1 증가 후, 저장.
    // Redis 서버와 비동기 통신.
    await client.set("number", parseInt(number) + 1);

    // Redis 서버와 session 종료.
    // Redis 서버와 비동기 통신.
    await client.disconnect();
})


// 애플리케이션 실행을 위한 포트 설정.
app.listen(8080); // 컨테이너로 실행되었을 경우의, 포트번호.
                    // local 컴퓨터의 port no가 아님.
                    // => port mapping 가 필요함.

// 콘솔에 실행 결과 출력.
console.log('Node App Server is running.');