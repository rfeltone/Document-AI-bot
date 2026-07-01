import "dotenv/config";
import { Bot, Keyboard, type Context } from "grammy";
import {
  conversations,
  createConversation,
  type Conversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import {uploadFileToBackend, askBackend} from "./services/backendapi.js"
import {downtimeConversation} from "./conversations/downtimeConversation.js"
type MyContext = ConversationFlavor<Context>;

const token = process.env.TELEGRAM_API_KEY;

if (!token) {
  throw new Error("TELEGRAM_API_KEY not found in .env");
}

const bot = new Bot<MyContext>(token);







bot.on("message:document", async (ctx) => {
  try {
    const doc = ctx.message.document;
    const filename = doc.file_name || "document";

    const allowedExtensions = [".txt", ".pdf", ".docx"];
    const isAllowed = allowedExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext)
    );

    if (!isAllowed) {
      await ctx.reply("Неподдерживаемый формат, только .docx .txt .pdf");
      return;
    }

    const tgFile = await ctx.api.getFile(doc.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_API_KEY}/${tgFile.file_path}`;

    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to download file from Telegram");
    }

    const arrayBuffer = await fileResponse.arrayBuffer();

  await uploadFileToBackend(ctx.chat.id, arrayBuffer, filename);

    const question = ctx.message.caption?.trim();

    if (question) {
      const answer = await askBackend(ctx.chat.id, question);
      await ctx.reply(answer);
    } else {
      await ctx.reply(`Файл ${filename} загружен. Теперь можете задать вопрос по документу.`);
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("Не удалось загрузить файл.");
  }
});
 bot.use(conversations());
 bot.use(createConversation(downtimeConversation, "downtime"));
const mainMenu = new Keyboard()
  .text("⌛ Рассчитать срок простоя").row()
  .resized();

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Здравствуйте! Я бот по претензиям и простоям вагонов. Чем могу помочь?",
    { reply_markup: mainMenu }
  );
});
bot.hears("⌛ Рассчитать срок простоя", async (ctx) => {
  await ctx.conversation.enter("downtime");
});





// bot.hears("Рассчитать срок простоя", async (ctx) => {
//   await ctx.conversation.enter("downtimeConversation");
// });

bot.on("message:text", async (ctx) => {
  await ctx.reply("Пока доступна только кнопка «Рассчитать срок простоя».\nНажмите /start");
});

bot.catch((err) => {
  console.error(err);
});

bot.start();
console.log("Bot started");