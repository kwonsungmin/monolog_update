const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/monolog_update', async (req, res) => {
  const fileName = "app_241205_2.bin";
  const fileUrl = `https://monolog-firmware.s3.ap-northeast-2.amazonaws.com/${fileName}`;

  if (!fileUrl) {
      return res.status(400).send('File URL is required');
  }

  try {
      // 외부 파일 링크에서 파일을 다운로드합니다.
      const response = await axios({
          url: fileUrl,
          method: 'GET',
          responseType: 'stream'
      });

      res.setHeader('Content-Length', response.headers['content-length']);
      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // 파일 스트림을 응답으로 전달
      response.data.pipe(res);

      response.data.on('end', () => {
          console.log('File download completed.');
      });

      response.data.on('error', (err) => {
          console.error('Error during download:', err);
          res.status(500).send('Error downloading the file');
      });

  } catch (error) {
      console.error('Error fetching the file:', error);
      res.status(500).send('Error fetching the file');
  }
});



// app.use(async function (req, res, next) {
//   if (req.method === 'GET') {
//     if (req.url === '/monolog_update') {
//       console.log(new Date() + " call update");
//       try {
//         const stat = fs.statSync("./app-v4.bin");
//         const file = fs.createReadStream("./app-v4.bin");
//         console.log(stat.size);
//         res.set({
//           'Content-Length': stat.size
//         });
//         file.pipe(res);
//       } catch (err) {
//         console.error('Error reading file', err);
//         res.status(500).send('Internal Server Error');
//       }
//     } else {
//       next(); // URL이 /monolog_update가 아니면 다음 미들웨어로 이동
//     }
//   } else if (req.method === 'POST') {
//     // POST 요청 처리 로직
//     next(); // 다음 미들웨어로 이동
//   } else {
//     next(); // 다른 HTTP 메서드는 다음 미들웨어로 이동
//   }
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});