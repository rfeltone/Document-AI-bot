import type { Conversation } from "@grammyjs/conversations";
import type { MyContext } from "../types.js";
import { Keyboard } from "grammy";
import { mainCalculate } from "./services/calculators/downtime.js";

export async function downtimeConversation(
   conversation: Conversation<MyContext, MyContext>,
  ctx: MyContext
) {
  const typeKeyboard = new Keyboard()
    .text("СУГ")
    .text("Поставка нефтепродуктов")
    .row()
    .text("Поставка платформы с 3 танк-контейнерами")
    .row()
    .text("Выйти из калькулятора")
    .resized();

  let downtimeType: string | null = null;

  while (true) {
    await ctx.reply("Выберите ваш тип простоя", {
      reply_markup: typeKeyboard,
    });

    const typeCtx = await conversation.waitFor("message:text");
    const text = typeCtx.message.text;

    if (text === "Выйти из калькулятора") {
      await ctx.reply("Вы вышли из калькулятора.", {
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    if (text === "СУГ") {
      downtimeType = "SUG";
      break;
    }

    if (text === "Поставка нефтепродуктов") {
      downtimeType = "OIL";
      break;
    }

    if (text === "Поставка платформы с 3 танк-контейнерами") {
      downtimeType = "PLAT";
      break;
    }

    await ctx.reply("Нажмите одну из кнопок на клавиатуре.", {
      reply_markup: typeKeyboard,
    });
  }

  await ctx.reply(
    "Введите дату прибытия вагона в формате ДД.ММ.ГГГГ, например 01.02.2026",
    { reply_markup: { remove_keyboard: true } }
  );
  const firstDateCtx = await conversation.waitFor("message:text");

  await ctx.reply(
    "Введите дату отбытия вагона в формате ДД.ММ.ГГГГ, например 04.02.2026"
  );
  const secondDateCtx = await conversation.waitFor("message:text");

  const result = mainCalculate(
    firstDateCtx.message.text,
    secondDateCtx.message.text,
    downtimeType
  );

  await ctx.reply(result);
}