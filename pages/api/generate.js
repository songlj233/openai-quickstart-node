import { Configuration, OpenAIApi } from "openai";
const mysql = require('mysql');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const pool = mysql.createPool({
  connectionLimit : 10,
  host: '8.130.34.204',
  user: 'root',
  password: 'yourpassword',     // 改成你自己的密码
  database: 'chatgpt'    // 改成你的数据库名称
});

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.question,
//    prompt: generatePrompt(req.body.animal),
    temperature: 0.9,
    frequency_penalty: 0.5,
    presence_penalty: 0.2,
    max_tokens: 1000
  });
  record(req,res,completion);
  res.status(200).json({ result: completion.data.choices[0].text });
}

function record(req,res,completion) {
  console.log("ip:", req.ip);
  console.log("body:", req.body);
  console.log("question:" + req.body.question);
  console.log("answer:", completion.data.choices[0].text);
  var  insertSql = 'INSERT INTO invoke_record(ip, prompt, completion) VALUES(?,?,?)';
  var  insertParams = [req.ip, req.body.question, completion.data.choices[0].text];

  //增
  pool.query(insertSql, insertParams, function (err, result) {
      if(err){
          console.log('[INSERT ERROR] - ',err.message);
          return;
      }
      console.log('[保存记录成功]');
  });
}
