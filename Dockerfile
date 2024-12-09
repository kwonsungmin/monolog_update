# Node.js 베이스 이미지
FROM node:16-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 앱이 사용하는 포트
EXPOSE 8080

# 애플리케이션 실행
CMD ["npm", "start"]