const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const { exec } = require("child_process");
const TelegramBot = require("node-telegram-bot-api");
const token = "1618611247:AAHvG-Zt4UDbGIUp-8uTK8BCIIgRUwiYT1M";
const bot = new TelegramBot(token, { polling: true });
const app = express();
const port = 8001;
const algorBerunChatID = 206895614;
const chatIds = [];
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.post("/123456", (req, res) => {
  console.log("request", req.body);
  chatIds.forEach(id => bot.sendMessage(id, JSON.stringify(req.body.data)));

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

bot.onText(/\/set/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  if (!chatIds.includes(chatId)) {
    chatIds.push(chatId);
    bot.sendMessage(chatId, "Successfully registered your chatId");
    const message = `\nAdded new chatID: ${chatId}\nName: ${msg.chat.first_name} ${msg.chat.last_name}`;
    bot.sendMessage(algorBerunChatID, message);
  }
});
bot.onText(/\/add (.*)/, (msg, match) => {
  const resp = match[1];
  if (!chatIds.includes(Number(resp))) {
    chatIds.push(Number(resp));
  }
  bot.sendMessage(algorBerunChatID, resp);
});
bot.onText(/\/getChatIds/, (msg, match) => {
  bot.sendMessage(algorBerunChatID, JSON.stringify(chatIds));
});
bot.onText(/\/getInfo/, (msg, match) => {
  exec("docker-compose up --abort-on-container-exit --exit-code-from e2e", (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(algorBerunChatID, `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      bot.sendMessage(algorBerunChatID, `STDError: ${stderr}`);
      return;
    }
    bot.sendMessage(algorBerunChatID, `stdout: ${stdout}`);
  });
});

cron.schedule("*/2 * * * *", () => {
  exec("docker-compose up --abort-on-container-exit --exit-code-from e2e", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
