const fs = require("fs");
const grpconfig = JSON.parse(fs.readFileSync("./src/grpconfig.json"));
for(i=0;i<grpconfig.length;i++)
{   console.log("🤖 *BOT Command List* 🤖\n\n*The no. was banned.*\n*Please do not misuse*\n*Bot currently under development.*\n*May have to face bugs or downtime!*\n\n🎀 *Prefix* .\n\n📗 *General*\n ```help, group, adminlist, contactme, requestafeature```\n\n👑 *Admin*\n```tagall, promote, demote, kick, add, botleave, grouplink, changedp, changedesc, allsticker```\n\n📱 *Media*\n```sticker, rashmika, read, ytaudio, ytvideo, lyrics, meme, randomsticker```\n\n📃 *Issues*\n```1) read:    Feature suspended, adding abuse detection feature\n2) sticker: sticker can now be made\n3) Added delay and typing... feature.\4) Adding block feature for group admins, to prevent spammers from using the bot```")
    if(grpconfig[i].group_name=='xda coders')
    {
       // console.log(grpconfig[i].blocklist)
        //grpconfig[i].blocklist.append('90768778767868')
        fs.writeFileSync(
            "./src/grpconfig.json",
            JSON.stringify(grpconfig, null, "\t")
          );

    }
}