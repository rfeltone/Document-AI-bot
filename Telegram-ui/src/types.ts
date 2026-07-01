import { Context } from "grammy";
import { type ConversationFlavor } from "@grammyjs/conversations";

export type MyContext = Context & ConversationFlavor<Context>;