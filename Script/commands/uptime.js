"use strict";

const startTime = Date.now();

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "مدة"],
    version: "1.0.0",
    author: "SHTOT",
    countDown: 3,
    role: 0,
    shortDescription: "مدة تشغيل البوت",
    category: "system"
  },

  onStart: async function ({ message }) {
    const uptime = Date.now() - startTime;

    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const format = (n) => String(n).padStart(2, "0");

    return message.reply(
`╭━━━〔 ✦ SHTOT BOT ✦ 〕━━━╮
┃
┃  ⚡ SYSTEM STATUS : ONLINE
┃
┃  ⏱️ مدة التشغيل
┃  ${days} يوم | ${format(hours)} ساعة
┃  ${format(minutes)} دقيقة | ${format(seconds)} ثانية
┃
┃  👑 POWERED BY SHTOT
┃  💎 الحالة : مستقر ويعمل
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    );
  }
};
