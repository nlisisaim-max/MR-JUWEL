module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "2.1.0",
  credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
  description: "Anti leave funny limit system"
};

const leaveData = {};

function frame(msg) {
  return `
   ╔══════════════════╗
   ☢️ ANTI OUT SYSTEM ⚠️
   ╠══════════════════╣
   ${msg}
   ╚══════════════════╝`;
}

module.exports.run = async function ({ event, api, Threads, Users }) {
  try {
    const { threadID } = event;
    const leftID = event.logMessageData.leftParticipantFbId;

    let data = (await Threads.getData(threadID)).data || {};
    if (data.antiout === false) return;

    if (leftID == api.getCurrentUserID()) return;
    if (event.author != leftID) return;

    let name =
      global.data.userName.get(String(leftID)) ||
      await Users.getNameUser(leftID.toString());

    if (!leaveData[leftID]) {
      leaveData[leftID] = {
        count: 0,
        time: Date.now()
      };
    }

    let user = leaveData[leftID];

    if (Date.now() - user.time > 60 * 60 * 1000) {
      user.count = 0;
      user.time = Date.now();
    }

    user.count++;

    // المرة الثالثة
    if (user.count >= 3) {
      api.sendMessage(
        frame(`
😆 ${name}!! خرجتي 3 مرات!
🚫 ما غاديش نحاول نرجعك مرة أخرى! 🛑
😎 سولو لايف! ✌️`),
        threadID
      );

      try {
        let threadInfo = await Threads.getInfo(threadID);
        let threadName = threadInfo.threadName || "Unknown Group";

        let adminMsg = `
🚨 PERMANENT BAN 🚨
👤 ${name} | UID: ${leftID}
📊 Left: ${user.count}/3 | Group: ${threadName}`;

        const adminUIDs = ["61567576882007", "100071528325738"];

        for (let admin of adminUIDs) {
          api.sendMessage(adminMsg, admin);
        }
      } catch (e) {
        console.log("Forward Error:", e);
      }

      return;
    }

    // المرة الأولى والثانية
    api.addUserToGroup(leftID, threadID, async (err) => {
      if (err) {
        api.sendMessage(
          frame(`
😱 ${name}!! مقدرتش نرجعك!
🔒 تحقق من إعدادات الخصوصية ديالك.`),
          threadID
        );

        try {
          let threadInfo = await Threads.getInfo(threadID);
          let threadName = threadInfo.threadName || "Unknown Group";

          let adminMsg = `
🚨 FAILED TO RE-ADD 🚨
👤 ${name} | UID: ${leftID}
🏷️ ${threadName}`;

          const adminUIDs = ["61591646430352", "61591542717221"];

          for (let admin of adminUIDs) {
            api.sendMessage(adminMsg, admin);
          }
        } catch (e) {
          console.log("Forward Error:", e);
        }

        return;
      }

      api.sendMessage(
        "رجع رجع سحتوت مبغاكش تخرج🍆👌🏻",
        threadID
      );

      try {
        let threadInfo = await Threads.getInfo(threadID);
        let threadName = threadInfo.threadName || "Unknown Group";

        let adminMsg = `
✅ RE-ADDED SUCCESSFULLY
👤 ${name} | UID: ${leftID}
📊 Count: ${user.count}/3 | Group: ${threadName}`;

        const adminUIDs = ["61567576882007", "100071528325738"];

        for (let admin of adminUIDs) {
          api.sendMessage(adminMsg, admin);
        }
      } catch (e) {
        console.log("Forward Error:", e);
      }
    });

  } catch (e) {
    console.log("AntiOut Error:", e);
  }
};
