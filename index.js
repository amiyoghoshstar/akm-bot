const {
  WAConnection,
  MessageType,
  Presence,
  Mimetype,
  GroupSettingChange,
} = require("@adiwajshing/baileys");
const WSF = require("wa-sticker-formatter");
const { color, bgcolor } = require("./lib/color");
const {
  wait,
  simih,
  getBuffer,
  h2k,
  generateMessageID,
  getGroupAdmins,
  getRandom,
  banner,
  start,
  info,
  success,
  close,
} = require("./lib/functions");
const { fetchJson, fetchText } = require("./lib/fetcher");
const fs = require("fs");
const moment = require("moment-timezone");
const { exec } = require("child_process");
const fetch = require("node-fetch");
const ffmpeg = require("fluent-ffmpeg");
const welkom = JSON.parse(fs.readFileSync("./src/welkom.json"));
const samih = JSON.parse(fs.readFileSync("./src/simi.json"));
const setting = JSON.parse(fs.readFileSync("./src/settings.json"));
const ytdl = require("ytdl-core");
const search = require("youtube-search");
const opts = {
  maxResults: 10,
  key: process.env.ytapi,
};
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const solenolyrics = require("solenolyrics");
const yts = require("yt-search");
const fbv = require("fb-video-downloader");
const webp = require("webp-converter"); // this will grant 755 permission to webp executables
webp.grant_permission();
var YD = new YoutubeMp3Downloader({
  ffmpegPath: "node_modules/ffmpeg-static-electron/bin/linux/x64/ffmpeg", // FFmpeg binary location
  outputPath: "./Media", // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});
const WebVideos = require("web-videos");
const redditimage = require("reddit.images");
const download = require("image-downloader");
var twitter = require("twitter");
require("dotenv/config");

var twit = new twitter({
  consumer_key: process.env.apiKey,
  consumer_secret: process.env.apiKeysecret,
  access_token_key: process.env.accesstoken,
  access_token_secret: process.env.accesstokensecret,
});

prefix = setting.prefix;
const blocked = ["919523577371", "917003685950", "917404486414"];

function kyun(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`;
}

async function starts() {
  const client = new WAConnection();
  client.logger.level = "warn";
  console.log(banner.string);
  client.on("qr", () => {
    console.log(
      color("[", "white"),
      color("!", "red"),
      color("]", "white"),
      color(" Scan the qr code above")
    );
  });

  fs.existsSync("./BarBar.json") && client.loadAuthInfo("./BarBar.json");
  client.on("connecting", () => {
    start("2", "Connecting...");
  });
  client.on("open", () => {
    success("2", "Connected");
  });
  await client.connect({
    timeoutMs: 30 * 1000,
  });
  fs.writeFileSync(
    "./BarBar.json",
    JSON.stringify(client.base64EncodedAuthInfo(), null, "\t")
  );

  client.on("group-participants-update", async (anu) => {
    if (!welkom.includes(anu.jid)) return;
    try {
      const mdata = await client.groupMetadata(anu.jid);
      console.log(anu);
      if (anu.action == "add") {
        num = anu.participants[0];
        try {
          ppimg = await client.getProfilePicture(
            `${anu.participants[0].split("@")[0]}@c.us`
          );
        } catch {
          ppimg =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
        }
        teks = `Halo @${num.split("@")[0]}\nWelcome to the group *${
          mdata.subject
        }*`;
        let buff = await getBuffer(ppimg);
        client.sendMessage(mdata.id, buff, MessageType.image, {
          caption: teks,
          contextInfo: {
            mentionedJid: [num],
          },
        });
      } else if (anu.action == "remove") {
        num = anu.participants[0];
        try {
          ppimg = await client.getProfilePicture(`${num.split("@")[0]}@c.us`);
        } catch {
          ppimg =
            "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
        }
        teks = `Sayonara @${num.split("@")[0]}👋`;
        let buff = await getBuffer(ppimg);
        client.sendMessage(mdata.id, buff, MessageType.image, {
          caption: teks,
          contextInfo: {
            mentionedJid: [num],
          },
        });
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"));
    }
  });

  client.on("CB:Blocklist", (json) => {
    if (blocked.length > 2) return;
    for (let i of json[1].blocklist) {
      blocked.push(i.replace("c.us", "s.whatsapp.net"));
    }
  });

  client.on("chat-update", async (mek) => {
    try {
      if (!mek.hasNewMessage) return;
      mek = mek.messages.all()[0];
      if (!mek.message) return;
      if (mek.key && mek.key.remoteJid == "status@broadcast") return;
      if (mek.key.fromMe) return;
      global.prefix;
      global.blocked;
      const content = JSON.stringify(mek.message);
      const from = mek.key.remoteJid;
      const type = Object.keys(mek.message)[0];
      const {
        text,
        extendedText,
        contact,
        location,
        liveLocation,
        image,
        video,
        sticker,
        document,
        audio,
        product,
      } = MessageType;
      const time = moment.tz("Asia/Kolkata").format("DD/MM HH:mm:ss");
      body =
        type === "conversation" && mek.message.conversation.startsWith(prefix)
          ? mek.message.conversation
          : type == "imageMessage" &&
            mek.message.imageMessage.caption.startsWith(prefix)
          ? mek.message.imageMessage.caption
          : type == "videoMessage" &&
            mek.message.videoMessage.caption.startsWith(prefix)
          ? mek.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            mek.message.extendedTextMessage.text.startsWith(prefix)
          ? mek.message.extendedTextMessage.text
          : "";
      budy =
        type === "conversation"
          ? mek.message.conversation
          : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : "";
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const isCmd = body.startsWith(prefix);

      mess = {
        wait: "⏱️ ```Processing```",
        success: "✔️``` Successful```",
        error: {
          stick:
            "❌ ```Failed, an error occurred while converting the image to a sticker. Please try again.```",
          Iv: "🌐 ```Invalid link```",
        },
        only: {
          group: "👩‍👩‍👦‍👦 ```This command can only be used in groups!```",
          ownerG:
            "💎 ```This command can only be used by the owner of the group!```",
          ownerB:
            "🎩 ```This command can only be used by the owner of the bot!```",
          admin: "🤷‍♂️ ```This command can only be used by the admins!```",
          Badmin:
            "🤖 ```This command can only be used when the bot has admin rights!```",
        },
      };

      const botNumber = client.user.jid;
      const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`]; // replace this with your number
      const isGroup = from.endsWith("@g.us");
      const sender = isGroup ? mek.participant : mek.key.remoteJid;
      const groupMetadata = isGroup ? await client.groupMetadata(from) : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const groupId = isGroup ? groupMetadata.jid : "";
      const groupMembers = isGroup ? groupMetadata.participants : "";
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
      const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
      const isGroupAdmins = groupAdmins.includes(sender) || false;
      const isWelkom = isGroup ? welkom.includes(from) : false;
      const isSimi = isGroup ? samih.includes(from) : false;
      const isOwner = ownerNumber.includes(sender);
      const isUrl = (url) => {
        return url.match(
          new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
            "gi"
          )
        );
      };
      const reply = (teks) => {
        client.sendMessage(from, teks, text, {
          quoted: mek,
        });
      };
      const sendMess = (hehe, teks) => {
        client.sendMessage(hehe, teks, text);
      };
      const mentions = (teks, memberr, id) => {
        id == null || id == undefined || id == false
          ? client.sendMessage(from, teks.trim(), extendedText, {
              contextInfo: {
                mentionedJid: memberr,
              },
            })
          : client.sendMessage(from, teks.trim(), extendedText, {
              quoted: mek,
              contextInfo: {
                mentionedJid: memberr,
              },
            });
      };

      colors = ["red", "white", "black", "blue", "yellow", "green"];
      const isMedia = type === "imageMessage" || type === "videoMessage";
      const isQuotedImage =
        type === "extendedTextMessage" && content.includes("imageMessage");
      const isQuotedVideo =
        type === "extendedTextMessage" && content.includes("videoMessage");
      const isQuotedSticker =
        type === "extendedTextMessage" && content.includes("stickerMessage");
      if (!isGroup && isCmd)
        console.log(
          "\x1b[1;31m~\x1b[1;37m>",
          "[\x1b[1;32mEXEC\x1b[1;37m]",
          time,
          color(command),
          "from",
          color(sender.split("@")[0]),
          "args :",
          color(args.length)
        );
      if (!isGroup && !isCmd)
        console.log(
          "\x1b[1;31m~\x1b[1;37m>",
          "[\x1b[1;31mRECV\x1b[1;37m]",
          time,
          color("Message"),
          "from",
          color(sender.split("@")[0]),
          "args :",
          color(args.length)
        );
      if (isCmd && isGroup)
        console.log(
          "\x1b[1;31m~\x1b[1;37m>",
          "[\x1b[1;32mEXEC\x1b[1;37m]",
          time,
          color(command),
          "from",
          color(sender.split("@")[0]),
          "in",
          color(groupName),
          "args :",
          color(args.length)
        );
      if (!isCmd && isGroup)
        console.log(
          "\x1b[1;31m~\x1b[1;37m>",
          "[\x1b[1;31mRECV\x1b[1;37m]",
          time,
          color("Message"),
          "from",
          color(sender.split("@")[0]),
          "in",
          color(groupName),
          "args :",
          color(args.length)
        );
      let authorname =
        client.contacts[from] != undefined
          ? client.contacts[from].vname || client.contacts[from].notify
          : undefined;
      if (authorname != undefined) {
      } else {
        authorname = groupName;
      }

      // await client.chatRead (from) // mark all messages in chat as read (equivalent of opening a chat in WA)

      if (blocked.includes(sender.split("@")[0])) return;

      // fs.readFile("./src/ban1.txt", function (err, data) {
      //   for (var ff = 0; ff < args.length; ff++) {
      //     if (data.includes(args[ff])) return reply("⚠``` Warning```");
      //   }
      // });

      //for (var ii = 0; i < args.length; i++) {
      //   if (/^illegitimate$/.test(args[ii] || /^hooker$/.test(args[ii]) || /^hijra$/.test(args[ii]) || /^hijda$/.test(args[ii]) || /^haraami$/.test(args[ii])  || /^harami$/.test(args[ii]) || /^gandu$/.test(args[ii]) || /^gaandfad$/.test(args[ii]) || /^gand$/.test(args[ii]) || /^fuck$/.test(args[ii]) || /^cunt$/.test(args[ii]) || /^cock$/.test(args[ii]) || /^chodu$/.test(args[ii]) || /^chod$/.test(args[ii]) || /^bur$/.test(args[ii]) || /^bhosdiwala$/.test(args[ii]) || /^bsdk$/.test(args[ii]) || /^breasts$/.test(args[ii]) || /^breast$/.test(args[ii]) || /^bhosriwala$/.test(args[ii]) || /^bhosda$/.test(args[ii]) || /^bhosadik$/.test(args[ii]) || /^bhenchod$/.test(args[ii]) || /^bsdk$/.test(args[ii]) || /^breasts$/.test(args[ii]) || /^breast$/.test(args[ii]) || /^bhadwa$/.test(args[ii]) || /^bhadwe$/.test(args[ii]) || /^bhenchod$/.test(args[ii]) || /^bhosadike$/.test(args[ii]) || /^bhosda$/.test(args[ii]) || /^bhosriwala$/.test(args[ii]) )) return reply("⚠``` Warning```")
      // if(/^bhadva$/.test(args[ii])  || /^bhadava$/.test(args[ii])  || /^betichod$/.test(args[ii])  || /^bambu$/.test(args[ii])  || /^bamboo$/.test(args[ii])   || /^asshole$/.test(args[ii])  || /^ass$/.test(args[ii])  || /^jhaat$/.test(args[ii]) || /^kutta$/.test(args[ii]) || /^lassan$/.test(args[ii]) || /^jhant$/.test(args[ii]) || /^jhaant$/.test(args[ii]) || /^lodu$/.test(args[ii]) || /^lauda$/.test(args[ii]) || /^laude$/.test(args[ii]) || /^lavde$/.test(args[ii]) || /^penis$/.test(args[ii]) || /^lund$/.test(args[ii]) || /^madar$/.test(args[ii]) || /^madarchod$/.test(args[ii]) || /^pig$/.test(args[ii]) || /^pussy$/.test(args[ii]) || /^pimp$/.test(args[ii]) || /^piss$/.test(args[ii]) || /^randi$/.test(args[ii]) || /^randu$/.test(args[ii]) || /^raand$/.test(args[ii]) ) return reply("⚠``` Warning```")

      //if( /^सुअर$/.test(args[ii])  ||  /^लौड़ा$/.test(args[ii])  || /^लण्ड$/.test(args[ii])  || /^रंडी$/.test(args[ii])  || /^रांड$/.test(args[ii])  || /^कूतिया$/.test(args[ii])  || /^मादरचोद$/.test(args[ii])  || /^भोसड़े$/.test(args[ii])  || /^बच्चकलप$/.test(args[ii])  || /^पिस्सू$/.test(args[ii])  || /^चुदाई$/.test(args[ii])  || /^गांड$/.test(args[ii])  || /^कूत्ते$/.test(args[ii])  || /^whore$/.test(args[ii])  || /^औलाद$/.test(args[ii])  || /^rundi$/.test(args[ii])  || /^randwa$/.test(args[ii])  || /^tits$/.test(args[ii])  || /^bhosadika$/i.test(args[ii])  ) return reply("⚠``` Warning```")

      // }

      switch (command) {
        case "ban":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing); //tell them we're  typing
          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (args.length < 1) return reply("*Usage:*\n```.ban @shreya\n.ban @sahil```");
					if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )return reply("*Usage:*\n```.ban @shreya\n.ban @sahil```");
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
					mentions(
						`Banned @${mentioned[0].split("@")[0]} from accessing the bot in this group!`,
						mentioned,
						true
					);
					


          break;

        case "tweet":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          if (
            from != "917903952384-1592467386@g.us" &&
            sender.split("@")[0] != "919013844884"
          )
            return client.sendMessage(
              from,
              fs.readFileSync("./Media/response/no.webp"),
              sticker,
              { quoted: mek }
            );
          var params = {
            screen_name: "FabrizioRomano",
            tweet_mode: "extended",
            count: 10,
          };
          twit.get(
            "statuses/user_timeline",
            params,
            function (error, tweets, response) {
              if (!error) {
                var i = 0;
                while (i < 10) {
                  teks = `👲 *Name*: ${
                    tweets[i].user.name
                  } \n\n🐦 *Tweet*:\n${tweets[i].full_text
                    .split("https://t.co/")[0]
                    .replace(/\n/g, " ")}\n\n📅 *Time*: ${
                    tweets[i].created_at.split("+")[0]
                  }\n\n🔄 *Retweets*: ${
                    tweets[i].retweet_count
                  }\n\n♥ *Likes*: ${tweets[i].favorite_count}`;
                  if (!tweets[i].in_reply_to_screen_name) reply(teks);
                  i++;
                }
              }
            }
          );

          break;

        case "ry":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          if (!isQuotedSticker) return reply("❌ reply to a sticker ❌");
          reply(mess.wait);
          encmedia = JSON.parse(JSON.stringify(mek).replace("quotedM", "m"))
            .message.extendedTextMessage.contextInfo;
          media = await client.downloadAndSaveMediaMessage(encmedia);
          ran = getRandom(".png");
          exec(`ffmpeg -i ${media} ${ran}`, (err) => {
            fs.unlinkSync(media);
            if (err) return reply("❌Error");
            buffer = fs.readFileSync(ran);
            client.sendMessage(from, buffer, image, {
              quoted: mek,
              caption: ">//<",
            });
            fs.unlinkSync(ran);
          });

          break;

        case "invite":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          if (args.length < 1) return reply("```PLz provide link```");
          if (
            !isUrl(args[0]) &&
            !args[0].includes("https://chat.whatsapp.com/")
          )
            return reply(mess.error.Iv);
          try {
            response = await client.acceptInvite(args[0]);
            console.log("```joined to: ```" + response.gid);
            reply("```Joined succesfully!```");
          } catch (e) {
            console.log("Error :", e);
            reply("```Unable to join.```");
          }
          break;

				case "tagall": //tag everyone in the group
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup)
            return reply("```No one is here except you and me``` 🌑");
          if (!isGroupAdmins) return reply(mess.only.admin);
          members_id = [];
          teks = args.length > 1 ? body.slice(8).trim() : "";
          teks += "\n\n";
          for (let mem of groupMembers) {
            teks += `🍥 @${mem.jid.split("@")[0]}\n`;
            members_id.push(mem.jid);
          }
          mentions(teks, members_id, true);
          break;

        case "promote": //promote someone to admin
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return reply("*Usage:*\n```.promote @bot\n.promote @shreya```");
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (mentioned.length > 1) {
            teks = "```Promote success```\n";
            for (let _ of mentioned) {
              teks += `@${_.split("@")[0]}\n`;
            }
            mentions(from, mentioned, true);
            client.groupMakeAdmin(from, mentioned);
          } else {
            mentions(
              `Promoted @${mentioned[0].split("@")[0]} as a Group Admin!`,
              mentioned,
              true
            );
            client.groupMakeAdmin(from, mentioned);
          }
          break;

        case "demote":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return reply("*Usage:*\n```.demote @bot\n.demote @shreya```");

          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (mentioned.length > 1) {
            teks = "```Successfully demoted```\n";
            for (let _ of mentioned) {
              teks += `@${_.split("@")[0]}\n`;
            }
            mentions(teks, mentioned, true);
            client.groupRemove(from, mentioned);
          } else {
            mentions(
              `successfully demoted @${
                mentioned[0].split("@")[0]
              } Became a Group Member!`,
              mentioned,
              true
            );
            client.groupDemoteAdmin(from, mentioned);
          }
          break;

        case "add":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (args.length < 1)
            return reply(
              "*Usage:*\n```.add 919876543210\n.add 919876565656```"
            );
          try {
            if (args[0].length < 11) {
              args[0] = "91" + args[0];
            }
            num = `${args[0].replace(/ /g, "")}@s.whatsapp.net`;
            client.groupAdd(from, [num]);
          } catch (e) {
            console.log("Error :", e);
            reply("```Unable to add due to privacy setting```");
          }
          break;

        case "kick":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return reply("*Usage:*\n```.kick @bot\n.kick @shreya```");
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          if (mentioned.length > 1) {
            teks = "```Orders received, kicked :```\n";
            for (let _ of mentioned) {
              teks += `@${_.split("@")[0]}\n`;
            }
            mentions(teks, mentioned, true);
            client.groupRemove(from, mentioned);
          } else {
            mentions(`kicked @${mentioned[0].split("@")[0]}`, mentioned, true);
            client.groupRemove(from, mentioned);
          }
          break;

        case "grouplink":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          linkgc = await client.groupInviteCode(from);
          reply("https://chat.whatsapp.com/" + linkgc);
          break;

        case "botleave":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (isGroupAdmins || isOwner) {
            await client.sendMessage(from, "```Bye, Miss you all ```🤧", text);
            client.groupLeave(from);
          } else {
            reply("```Only admins can ask me to leave ```🌚");
          }
          break;

        case "setprefix":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (args.length < 1) return;
          if (!isOwner) return reply(mess.only.ownerB);
          prefix = args[0];
          setting.prefix = prefix;
          fs.writeFileSync(
            "./src/settings.json",
            JSON.stringify(setting, null, "\t")
          );
          reply(`The prefix has been successfully changed to : ${prefix}`);
          break;

        case "close":
          reply("feature yet to be released!");
          break;

        case "open":
          reply("feature yet to be released!");

          break;

        case "purge":
          reply("feature yet to be released!");
          break;

        case "q":
          reply("feature yet to be released!");
          break;

        case "w":
          reply("feature yet to be released!");
          break;

        case "changedp":
          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (!(isMedia || isQuotedImage))
            return reply(
              "```Tag the image with the caption .changedp or send with the caption .changedp ```"
            );
          const encmedia = isQuotedImage
            ? JSON.parse(JSON.stringify(mek).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : mek;
          const media = await client.downloadAndSaveMediaMessage(encmedia);
          const img = fs.readFileSync(media);
          await client.updateProfilePicture(from, img);
          break;

        case "title":
          // await client.updatePresence(from, Presence.composing)

          /*if (!isGroup) return reply(mess.only.group)
						if (!isGroupAdmins) return reply(mess.only.admin)
						if (!isBotGroupAdmins) return reply(mess.only.Badmin)
						if (args.length < 1) return reply('*Usage:*\n.title Friends group\n.title Engineering Graphics group')
						client.groupUpdateSubject(from, args)*/
          break;

        case "changedesc":
          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          if (args.length < 1)
            return reply(
              "*Usage:*\n```.changedesc Friends group\n.changedesc Engineering Graphics group```"
            );

          await client.groupUpdateDescription(from, args);
          break;

        case "fbvid":
          fbv
            .getInfo(args)
            .then((info) => console.log(JSON.stringify(info, null, 2)));
          break;

        case "rashmika": // random rashmika stickers
          //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
          var ccc = Math.floor(Math.random() * 304 + 1);
          ran = "./Media/rashmika_stickers/rashmika (" + ccc + ").webp";
          client.sendMessage(from, fs.readFileSync(ran), sticker, {
            quoted: mek,
          });
          break;

        case "randomsticker":
          // random sticker
          //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
          var ccc = Math.floor(Math.random() * 934 + 1);
          ran = "./Media/stickers/s (" + ccc + ").webp";
          client.sendMessage(from, fs.readFileSync(ran), sticker, {
            quoted: mek,
          });
          break;

        case "allsticker": // all sticker
          if (args[0] != "mka")
					return client.sendMessage(
						from,
						fs.readFileSync("./Media/response/no.webp"),
						sticker,
						{ quoted: mek }
					); //turn this on to stop spam
          if (isGroupAdmins || isOwner || !isGroup) {
            for (var i = 1; i < 934; i++) {
              ran = "./Media/stickers/s (" + i + ").webp";
              client.sendMessage(from, fs.readFileSync(ran), sticker);
            }
          } else {
            reply(mess.error.admin);
          }
          break;

        case "rall": // all rashmika stickers in group
          //client.sendMessage(from, "stopped due stupid behaviour", text)  //turn this on to stop spam
          if (!(isGroupAdmins || isOwner)) return reply(mess.error.ownerB);
          for (var i = 1; i < 304; i++) {
            ran = "./Media/rashmika_stickers/rashmika (" + i + ").webp";
            client.sendMessage(from, fs.readFileSync(ran), sticker);
          }

          break;

        case "rashu": // all rashmika stickers in inbox
          if (isGroup) return reply("```Command works in inbox```");
          for (var i = 1; i < 304; i++) {
            ran = "./Media/rashmika_stickers/rashmika (" + i + ").webp";
            client.sendMessage(from, fs.readFileSync(ran), sticker);
          }

          break;

        case "ytaudio":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (args.length < 1)
            return reply(
              "*Usage:*\n.ytaudio https://youtu.be/wui0YweevtY\n.ytaudio https://youtu.be/ByH9LuSILxU"
            );
          if (!isUrl(args[0]) && !args[0].includes("youtu"))
            return reply(mess.error.Iv);

          await YD.download(ytdl.getVideoID(args[0]), "temporary/audio.mp3");

          function function24() {
            client.sendMessage(
              from,
              {
                url: "./Media/temporary/audio.mp3",
              }, // can send mp3, mp4, & ogg
              MessageType.audio,
              {
                mimetype: Mimetype.mp4Audio,
              }
            );
          }
          setTimeout(function24, 15000);

          break;

        case "ytvideo":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (args.length < 1)
            return reply(
              "*Usage:*\n```.ytvideo https://youtu.be/wui0YweevtY\n.ytvideo https://youtu.be/ByH9LuSILxU```"
            );
          if (!isUrl(args[0]) && !args[0].includes("youtu"))
            return reply(mess.error.Iv);

          ytdl(args[0]).pipe(
            fs.createWriteStream("./Media/temporary/video.mp4")
          );
          reply(mess.wait);

          function function2() {
            client.sendMessage(
              from,
              fs.readFileSync("./Media/temporary/video.mp4"),
              MessageType.video,
              {
                quoted: mek,
                caption: "Hers is the video.",
              }
            );
          }
          setTimeout(function2, 15000);
          break;

        case "yts":
          reply("```feature yet to be released!```");
          search(args[0], opts, function (err, results) {
            if (err) return console.log(err);
            console.log(results);
          });
          break;

        case "lyrics":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (args.length < 1)
            return reply(
              "*Usage:*\n```.lyrics brown munde\n.lyrics Jab Pyar Kiya To Darna Kya```"
            );
          var lyrics = await solenolyrics.requestLyricsFor(args);
          reply(lyrics);
          break;

        case "read":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          reply(
            "```Will continue only after adding abuse detection feature!```"
          );
          break;

        case "reads":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          try {
            if (args.length < 1)
              return reply(
                "*Usage:*\n```.read [lang_code] [Text]```\n*Eg*:\n```.read en who are you?\n.read hi tum kon ho?```"
              );

            for (var ii = 0; i < args.length; i++) {
              if (
                /^illegitimate$/.test(
                  args[ii] ||
                    /^hooker$/.test(args[ii]) ||
                    /^hijra$/.test(args[ii]) ||
                    /^hijda$/.test(args[ii]) ||
                    /^haraami$/.test(args[ii]) ||
                    /^harami$/.test(args[ii]) ||
                    /^gandu$/.test(args[ii]) ||
                    /^gaandfad$/.test(args[ii]) ||
                    /^gand$/.test(args[ii]) ||
                    /^fuck$/.test(args[ii]) ||
                    /^cunt$/.test(args[ii]) ||
                    /^cock$/.test(args[ii]) ||
                    /^chodu$/.test(args[ii]) ||
                    /^chod$/.test(args[ii]) ||
                    /^bur$/.test(args[ii]) ||
                    /^bhosdiwala$/.test(args[ii]) ||
                    /^bsdk$/.test(args[ii]) ||
                    /^breasts$/.test(args[ii]) ||
                    /^breast$/.test(args[ii]) ||
                    /^bhosriwala$/.test(args[ii]) ||
                    /^bhosda$/.test(args[ii]) ||
                    /^bhosadik$/.test(args[ii]) ||
                    /^bhenchod$/.test(args[ii]) ||
                    /^bsdk$/.test(args[ii]) ||
                    /^breasts$/.test(args[ii]) ||
                    /^breast$/.test(args[ii]) ||
                    /^bhadwa$/.test(args[ii]) ||
                    /^bhadwe$/.test(args[ii]) ||
                    /^bhenchod$/.test(args[ii]) ||
                    /^bhosadike$/.test(args[ii]) ||
                    /^bhosda$/.test(args[ii]) ||
                    /^bhosriwala$/.test(args[ii])
                )
              )
                return reply("⚠``` Warning```");

              if (
                /^bhadva$/.test(args[ii]) ||
                /^bhadava$/.test(args[ii]) ||
                /^betichod$/.test(args[ii]) ||
                /^bambu$/.test(args[ii]) ||
                /^bamboo$/.test(args[ii]) ||
                /^asshole$/.test(args[ii]) ||
                /^ass$/.test(args[ii]) ||
                /^jhaat$/.test(args[ii]) ||
                /^kutta$/.test(args[ii]) ||
                /^lassan$/.test(args[ii]) ||
                /^jhant$/.test(args[ii]) ||
                /^jhaant$/.test(args[ii]) ||
                /^lodu$/.test(args[ii]) ||
                /^lauda$/.test(args[ii]) ||
                /^laude$/.test(args[ii]) ||
                /^lavde$/.test(args[ii]) ||
                /^penis$/.test(args[ii]) ||
                /^lund$/.test(args[ii]) ||
                /^madar$/.test(args[ii]) ||
                /^madarchod$/.test(args[ii]) ||
                /^pig$/.test(args[ii]) ||
                /^pussy$/.test(args[ii]) ||
                /^pimp$/.test(args[ii]) ||
                /^piss$/.test(args[ii]) ||
                /^randi$/.test(args[ii]) ||
                /^randu$/.test(args[ii]) ||
                /^raand$/.test(args[ii])
              )
                return reply("⚠``` Warning```");

              if (
                /^सुअर$/.test(args[ii]) ||
                /^लौड़ा$/.test(args[ii]) ||
                /^लण्ड$/.test(args[ii]) ||
                /^रंडी$/.test(args[ii]) ||
                /^रांड$/.test(args[ii]) ||
                /^कूतिया$/.test(args[ii]) ||
                /^मादरचोद$/.test(args[ii]) ||
                /^भोसड़े$/.test(args[ii]) ||
                /^बच्चकलप$/.test(args[ii]) ||
                /^पिस्सू$/.test(args[ii]) ||
                /^चुदाई$/.test(args[ii]) ||
                /^गांड$/.test(args[ii]) ||
                /^कूत्ते$/.test(args[ii]) ||
                /^whore$/.test(args[ii]) ||
                /^औलाद$/.test(args[ii]) ||
                /^rundi$/.test(args[ii]) ||
                /^randwa$/.test(args[ii]) ||
                /^tits$/.test(args[ii]) ||
                /^bhosadika$/i.test(args[ii])
              )
                return reply("⚠``` Warning```");
            }

            if (args[0] != "en" && args[0] != "hi" && args[0] != "ta")
              return reply(`Add lang code between 'read' and '${args[0]}'`);
            const gtts = require("./lib/gtts")(args[0]);
            if (args.length < 2) return reply("```Where is the text?```");
            dtt = body.slice(9);
            ranm = getRandom(".mp3");
            dtt.length > 600
              ? reply("```Too long! should be less than 600 characters.```")
              : gtts.save(ranm, dtt, function () {
                  client.sendMessage(from, fs.readFileSync(ranm), audio, {
                    quoted: mek,
                    mimetype: "audio/mp4",
                    ptt: true,
                  });
                  fs.unlinkSync(ranm);
                });
          } catch (error) {
            reply("```Error```");
          }
          break;

        case "meme":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          await redditimage
            .fetch({
              type: "meme",

              addSubreddit: [
                "memes",
                "AdviceAnimals",
                "AdviceAnimals+funny+memes",
                "funny",
                "PrequelMemes",
                "SequelMemes",
                "MemeEconomy",
                "ComedyCemetery",
                "PewdiepieSubmissions",
                "dankmemes",
                "terriblefacebookmemes",
                "shittyadviceanimals",
                "wholesomememes",
                "me_irl",
                "2meirl4meirl",
                "i_irl",
                "meirl",
                "BikiniBottomTwitter",
                "trippinthroughtime",
                "boottoobig",
                "HistoryMemes",
                "fakehistoryporn",
                "OTMemes",
                "starterpacks",
                "gifs",
                "rickandmorty",
                "FellowKids",
                "Memes_Of_The_Dank",
                "raimimemes",
                "comedyhomicide",
                "lotrmemes",
                "freefolk",
                "GameOfThronesMemes",
                "howyoudoin",
                "HolUp",
                "meme",
                "memeswithoutmods",
                "dankmeme",
                "suicidebywords",
                "puns",
                "PerfectTiming",
              ],
              removeSubreddit: ["dankmemes"],
            })
            .then((result) => {
              console.log(result[0].image);

              const options = {
                url: result[0].image,
                dest: "./Media/temporary/meme.jpg",
              };
              download
                .image(options)
                .then(({ filename }) => {
                  console.log("Saved as", filename);
                })
                .catch((err) => console.error(err));
              reply("🔍``` searching```");
              function function33() {
                var cap = `\n💮 *Title*: ${result[0].title}\n\n👑 *subreddit*: ${result[0].subreddit}\n\n🏊 *author*: ${result[0].author}\n\n🏅 *NSFW*: ${result[0].NSFW}\n\n🌏 *upvotes*: ${result[0].upvotes}`;
                ran = fs.readFileSync("./Media/temporary/meme.jpg");
                client.sendMessage(from, ran, image, {
                  quoted: mek,
                  caption: cap,
                });
                ran = fs.unlinkSync("./Media/temporary/meme.jpg");
              }
              setTimeout(function33, 5000);
            });
          break;

        case "sticker":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (isMedia || isQuotedImage) {
            const encmedia = isQuotedImage
              ? JSON.parse(JSON.stringify(mek).replace("quotedM", "m")).message
                  .extendedTextMessage.contextInfo
              : mek;
            const media = await client.downloadAndSaveMediaMessage(encmedia);

            const buffer = await webp.cwebp(
              "undefined.jpeg",
              "./Media/temporary/sticker.webp",
              "-q 50"
            );
            ran = fs.readFileSync("./Media/temporary/sticker.webp");
            client.sendMessage(from, ran, sticker, {
              quoted: mek,
            });
            console.log(encmedia.jid);
          } else if (
            (isMedia && mek.message.videoMessage.seconds < 11) ||
            (isQuotedVideo &&
              mek.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage.seconds < 11)
          ) {
            const encmedia = isQuotedVideo
              ? JSON.parse(JSON.stringify(mek).replace("quotedM", "m")).message
                  .extendedTextMessage.contextInfo
              : mek;
            const media = await client.downloadAndSaveMediaMessage(encmedia);

            let results = await WebVideos("./undefined.mp4", {
              bin: "node_modules/ffmpeg-static-electron/bin/linux/x64/ffmpeg",
              output_dir: "./Media/temporary/",
              temp_dir: "./Media/temporary",
              formats: [
                {
                  format: "gif",
                  fps: 8,
                  loop: true,
                },
              ],
            });
            await webp.gwebp(results[0], "sticker.webp", "-q 80"); // gif to webp

            ran = "./sticker.webp";
            client.sendMessage(from, fs.readFileSync(ran), sticker, {
              quoted: mek,
            });
          } else return reply("```Tag the media or send it with caption```");

          break;

        case "hello":
				case 'hi':
          client.sendMessage(from, "```Hello```", text);
          break;

        case "del":
          if (!(isQuotedImage || isQuotedSticker || isQuotedVideo))
            reply("```Tag the msg to be deleted.```");
          const mencmedia = isQuotedImage
            ? JSON.parse(JSON.stringify(mek).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : mek;
          await client.deleteMessage(from, {
            id: mencmedia.jid,
            remoteJid: from,
            fromMe: true,
          }); // will delete the sent message for everyone!

          break;

        case "menu":
        case "help":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          client.sendMessage(
            from,
            "🤖 *BOT Command List* 🤖\n\n*Bot currently under development.*\n*May have to face bugs or downtime!*\n\n🎀 *Prefix* .\n\n📗 *General*\n ```help, group, adminlist, contactme, requestafeature```\n\n👑 *Admin*\n```tagall, promote, demote, kick, add, botleave, grouplink, changedp, changedesc, allsticker```\n\n📱 *Media*\n```sticker, rashmika, read, ytaudio, ytvideo, lyrics, meme, randomsticker```\n\n📃 *Issues*\n```1) read:    Feature suspended, added abuse detection feature\n2) sticker: sticker can now be made\n3) toimg:   fixing bugs in sticker to image conversion \n4) promote demote: fixed bugs```",
            text,
            {
              quoted: mek,
            }
          );
          break;

        case "contactme":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (isGroup) return reply("```works only in inbox```");
          reply("```Why do u want to contact me?```");
          break;

        case "requestafeature":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (isGroup) return reply("```works only in inbox```");
          reply("```what feature do you want?```");
          break;

        case "group":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          const ppUrl = await client.getProfilePicture(from); // leave empty to get your own
          //console.log("download profile picture from: " + ppUrl)
          teks = `\n💮 *Title*: ${groupMetadata.subject}\n\n👑 *Created By*: ${
            groupMetadata.owner.split("@")[0]
          }\n\n🏊 *Participiants*: ${
            groupMetadata.participants.length
          }\n\n🏅 *Admins*:${groupAdmins.length}\n\n🌏 *Description*:\n${
            groupMetadata.desc
          }`;
          //  client.sendMessage(from, client.getProfilePicture(from) ,MessageType.image)

          client.sendMessage(from, teks, text, {
            quoted: mek,
          });
          break;

        case "adminlist":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          teks = `*${groupMetadata.subject}*\n\n`;
          no = 0;
          for (let admon of groupAdmins) {
            no += 1;
            teks += `[${no.toString()}] @${admon.split("@")[0]}\n`;
          }
          mentions(teks, groupAdmins, true);
          break;

        default:
          // console.log("a");
          if (isCmd && command.length > 1) {
            await client.chatRead(from); // mark chat read
            await client.updatePresence(from, Presence.available); // tell them we're available
            await client.updatePresence(from, Presence.composing);

            client.sendMessage(
              from,
              fs.readFileSync("./Media/response/idk.webp"),
              sticker,
              { quoted: mek }
            );
          }

          if (isGroup && isSimi && budy != undefined) {
            console.log("a");
            muehe = await simih(budy);
            console.log(muehe);
            reply(muehe);
          } else {
            // return console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
          }
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"));
    }
  });
}
starts();
