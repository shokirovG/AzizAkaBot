const express = require("express");
const app = express();
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const dotEnv = require("dotenv");
const Users = require("./models/Users");
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://usersData:IZJxnBLmIFY6PFmY@cluster0.x73nkfh.mongodb.net/"
  )
  .then(() => {
    console.log("bazaga ulandi...");
  })
  .catch((err) => console.log("baza ulanmadi!", err));
dotEnv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  console.log(ctx.chat);
  const user = await Users.find({ userId: ctx.chat.id });
  if (user.length == 0) {
    Users.create({
      userName: ctx.chat.first_name,
      name: "@" + ctx.chat.username,
      userId: ctx.chat.id,
    });
  }
  if (
    ctx.chat.id == process.env.USER_TOKEN_1 ||
    ctx.chat.id == process.env.USER_TOKEN_2
  ) {
    ctx.sendMessage(
      "Assalomu alaykum admin! yangilikni linkini tashlang.",
      ctx.chat.id
    );
    bot.on(message("text"), async (msg) => {
      const users = await Users.find({});
      try {
        for (let user of users) {
          msg.sendMessage(msg.message.text, user.userId);
        }
      } catch (e) {
        console.log("yuborilmadi!");
      }

      ctx.sendMessage("yangilik yuborildi!", ctx.chat.id);
    });
  } else {
    ctx.sendMessage(
      "Assalomu alaykum! Botimizga hush kelibsiz, ushbu bot sizni fo'tbol yangiliklaridan habardor qilib turadi.",
      ctx.chat.id
    );
  }
});
bot.help(async (ctx) => {
  if (
    ctx.chat.id == process.env.USER_TOKEN_1 ||
    ctx.chat.id == process.env.USER_TOKEN_2
  ) {
    const users = await Users.find({});
    try {
      for (let user of users) {
        console.log(user.userId);
        ctx.sendMessage(`${user}`, ctx.chat.id);
      }
    } catch (e) {
      console.log("hato");
    }
  }
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(port, "listen");
});
