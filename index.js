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
const unirest = require("unirest");

const welkom = JSON.parse(fs.readFileSync("./src/welkom.json"));
const samih = JSON.parse(fs.readFileSync("./src/simi.json"));
const setting = JSON.parse(fs.readFileSync("./src/settings.json"));
const grpconfig = JSON.parse(fs.readFileSync("./src/grpconfig.json"));

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
var API = require('indian-stock-exchange');
 
var NSEAPI = API.NSE;
var BSEAPI = API.BSE;

var twit = new twitter({
  consumer_key: process.env.apiKey,
  consumer_secret: process.env.apiKeysecret,
  access_token_key: process.env.accesstoken,
  access_token_secret: process.env.accesstokensecret,
});

prefix = setting.prefix;
const blocked = ["919523577371", "917404486414"];
const mygroup = [
  "917545837146-1512465467@g.us",
  "917470537339-1612462686@g.us",
  "",
  "",
  "",
  "",
];

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
        teks = `Hello @${num.split("@")[0]}\nWelcome to the group *${
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

      if (blocked.includes(sender.split("@")[0])) return;

      if (from == "917470537339-1612462686@g.us" && command != "crypto") return;

      var aa = await unirest
        .get(
          "https://antiabuseapi.vercel.app/api/" +
            command.replace(".", "") +
            "_" +
            body.replace(/\s+/g, "_")
        )
        .then((response) => {
          return response.body;
        });

      if (
        setting.abusefilter == 1 &&
        isGroup &&
        isCmd &&
        !mygroup.includes(from) &&
        command.length > 1 &&
        aa.toLocaleString() == "true"
      ) {
        await client.sendMessage(
          from,
          "⚠ ```Abuse detected!\nBlocking user and leaving group```",
          text
        );

        await client.sendMessage(
          "919709094733@s.whatsapp.net",
          "⚠ ```Left ```" + groupMetadata.subject,
          text
        );
        client.blockUser(sender, "add");
        client.groupLeave(from);
        return;
      }
      if (
        setting.abusefilter == 1 &&
        !isGroup &&
        aa.toLocaleString() == "true"
      ) {
        await client.sendMessage(
          from,
          "⚠ ```Abuse detected! Blocking!```",
          text
        );
        await client.sendMessage(
          "919709094733@s.whatsapp.net",
          "⚠ ```Blocked ```" + from.split("@")[0],
          text
        );
        client.blockUser(from, "add");

        return;
      }

      switch (command) {
        case "market":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          var x = "get_indices";

          switch (args[0]) {
            case "indices":
              x = "get_indices";
              break;

            case "status":
              unirest
                .get("http://localhost:3000/" + "get_market_status")
                .then((response) => {
                 

                  var share = response.body;
                
                  if (response.error) {
                    reply("```Error```");
                  } else {
                    reply("Market status : ```" + share.status + "```");
                  }
                });
              break;

            case "gainers":
              unirest
                .get("http://localhost:3000/nse/" + "get_gainers")
                .then((response) => {
                  var msg = "*Gainers* 📈";
                  var share = response.body;
                  if (response.error) {
                    // reply( "```Error```")
                  } else {
                    // console.log(share.data[0]);
                    share.data.forEach((element) => {
                      //console.log(element);
                      msg +=
                        "\n\n\n📈 " +
                        "*" +
                        element.symbol +
                        "*\n```Open Price: " +
                        element.openPrice +
                        "```\n" +
                        "```High Price: " +
                        element.highPrice +
                        "```\n" +
                        "```Low Price : " +
                        element.lowPrice +
                        "```\n" +
                        "```Prev Price: " +
                        element.previousPrice +
                        "```";
                    });
                    reply(msg);
                  }
                });

              break;

            case "stocks":
              unirest
                .get(
                  "http://localhost:3000/nse/" + "get_index_stocks?symbol=nifty"
                )
                .then((response) => {
                  var msg = "*Index Stocks NIFTY* 📈";
                  var share = response.body;
                  if (response.error) {
                    reply("```Error```");
                  } else {
                    share.data.forEach((element) => {
                      msg +=
                        "\n\n\n📈 " +
                        "*" +
                        element.symbol +
                        "*\n```Open Price: " +
                        element.open +
                        "```\n" +
                        "```High Price: " +
                        element.high +
                        "```\n" +
                        "```Low Price : " +
                        element.low +
                        "```\n" +
                        "```Prev Close: " +
                        element.previousClose +
                        "```\n" +
                        "```Traded vol: " +
                        element.trdVol +
                        "```\n" +
                        "```last tP   : " +
                        element.ltP +
                        "```";
                    });
                    reply(msg);
                  }
                });

              break;

            case "losers":
              unirest
                .get("http://localhost:3000/nse/" + "get_losers")
                .then((response) => {
                  var msg = "*Losers* 📈";
                  var share = response.body;
                  if (response.error) {
                    reply("```Error```");
                  } else {
                    share.data.forEach((element) => {
                      msg +=
                        "\n\n\n📈 " +
                        "*" +
                        element.symbol +
                        "*\n```Open Price: " +
                        element.openPrice +
                        "```\n" +
                        "```High Price: " +
                        element.highPrice +
                        "```\n" +
                        "```Low Price : " +
                        element.lowPrice +
                        "```\n" +
                        "```Prev Price: " +
                        element.previousPrice +
                        "```";
                    });
                    reply(msg);
                  }
                });

              break;

            case "search":
              unirest
                .get(
                  "http://localhost:3000/nse/" +
                    "search_stocks?keyword=" +
                    args[1].toUpperCase()
                )
                .then((response) => {
                  var msg = "*Search Result* 🔎";
                  var share = response.body;
                  if (response.error) {
                    reply("```Error```");
                  } else {
                    share.forEach((element) => {
                      msg +=
                        "\n\n\n📈 " +
                        "*" +
                        element.symbol +
                        "*\n```name: " +
                        element.name +
                        "```\n" +
                        "```symbol: " +
                        element.symbol +
                        "```";
                    });
                   
                    reply(msg);
                  }
                });
              break;

            case "details":
              unirest
                .get(
                  "http://localhost:3000/nse/" +
                    "get_quote_info?companyName=" +
                    args[1].toUpperCase()
                )
                .then((response) => {
                  var element = response.body.data[0];
                  var msg = "📈 " + element.companyName;

                  if (response.error) {
                    reply("```Error```");
                  } else {
                    msg +=
                      "\n" +
                      "\n```pricebandupr  : " +
                      element.pricebandupper +
                      "```\n" +
                      "```applcblMargin : " +
                      element.applicableMargin +
                      "```\n" +
                      "```dayHigh       : " +
                      element.dayHigh +
                      "```\n" +
                      "```dayLow        : " +
                      element.dayLow +
                      "```\n" +
                      "```basePrice     : " +
                      element.basePrice +
                      "```\n" +
                      "```securityVar   : " +
                      element.securityVar +
                      "```\n" +
                      "```pricebandlower: " +
                      element.pricebandlower +
                      "```\n" +
                      "```lastPrice     : " +
                      element.lastPrice +
                      "```\n" +
                      "```varMargin     : " +
                      element.varMargin +
                      "```\n" +
                      "```totalTradedVol: " +
                      element.totalTradedVolume +
                      "```\n" +
                      "```open          : " +
                      element.open +
                      "```\n" +
                      "```closePrice    : " +
                      element.closePrice +
                      "```\n" +
                      "```faceValue     : " +
                      element.faceValue +
                      "```\n" +
                      "```lastUpdateTime: " +
                      response.body.lastUpdateTime.split(" ")[1] +
                      "```";

                    reply(msg);
                  }
                });
              break;


            default:
              msg =
                "*Usage*" +
                " = " +
                "```.market [options]```\n\n" +
                "```OPTIONS=```\n\n" +
                "status  : " +
                " ```stock market status```\n\n" +
                "gainers : " +
                " ```top 10 gainers of NSE```\n\n" +
                "losers  : " +
                " ```top 10 losers of NSE```\n\n" +
                "stocks  : " +
                " ```info of all companies in a single NSE index```\n\n" +
                "search  [stock symbol]: " +
                " ```list of companies in provided NSE index with matching keyword```\n\n" +
                "details  [stock symbol]: " +
                " ```Get the data of the symbol from NSE```\n\n";

              reply(msg);
          }

          break;

        case "abusefilter":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          if (args.length < 1) return;
          if (!isOwner) return reply(mess.only.ownerB);
          abusefilter = args[0];
          setting.abusefilter = prefix;
          fs.writeFileSync(
            "./src/settings.json",
            JSON.stringify(setting, null, "\t")
          );
          reply("```changed the setting to ```" + abusefilter);
          break;

        case "song":
          break;

        case "credits":
          amiyo = "Amiyo: Added crypto\n";
          adithya = "Adithya: Added abuse detection";
          msg = amiyo + adithya;
          reply(msg);

          break;

        case "test":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          var aa = await unirest
            .get(
              "https://antiabuseapi.vercel.app/api/" +
                command.replace(".", "") +
                "_" +
                body.replace(/\s+/g, "_")
            )
            .then((response) => {
              return response.body;
            });
          reply("cuss word found in databse: " + aa.toLocaleString());
          break;

        case "crypto":
          console.log(from);
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (args.length >= 1) {
            unirest
              .get(
                "https://api.wazirx.com/api/v2/trades?market=" +
                  args[0] +
                  args[1]
              )
              .then((response) => {
                var crypto_body = response.body;

                if (response.error) {
                  client.sendMessage(
                    from,
                    "*Usage*:\n```.crypto <name> usdt/inr/btc```",
                    text,
                    {
                      quoted: mek,
                    }
                  );
                } else {
                  client.sendMessage(
                    from,
                    "\n*" +
                      args[0].toUpperCase() +
                      "* " +
                      "/" +
                      " " +
                      args[1].toUpperCase() +
                      " 🪙\n\n" +
                      "```Price :  ```" +
                      crypto_body[0].price.toUpperCase() +
                      "\n" +
                      "```Volume:  ```" +
                      crypto_body[0].volume.toUpperCase() +
                      "\n" +
                      "```Funds :  ```" +
                      crypto_body[0].funds.toUpperCase() +
                      "\n",
                    text,
                    {
                      quoted: mek,
                    }
                  );
                }
              });
          } else {
            unirest
              .get("https://api.wazirx.com/api/v2/tickers")
              .then((response) => {
                var crypto_body = response.body;

                if (response.error) {
                  client.sendMessage(from, "```API Down```", text, {
                    quoted: mek,
                  });
                } else {
                  var msg = "\n*Statistics*   📈 \n\n";
                  let pcrypto = [
                    "btcusdt",
                    "xrpusdt",
                    "ethusdt",
                    "ltcusdt",
                    "trxusdt",
                    "eosusdt",
                    "usdtinr",
                  ];

                  pcrypto.forEach(function (popular_crypto) {
                    msg += "*" + crypto_body[popular_crypto]["name"] + "*\n";
                    msg +=
                      "```Price:  $ " +
                      crypto_body[popular_crypto]["last"] +
                      "```\n";
                    msg +=
                      "```High :  $ " +
                      crypto_body[popular_crypto]["high"] +
                      "```\n";
                    msg +=
                      "```Low  :  $ " +
                      crypto_body[popular_crypto]["low"] +
                      "```\n\n";
                  });
                  msg +=
                    "*Usage:*\n```.crypto <name> usdt/inr/btc```\n*Eg:*\n```.crypto ltc usdt```\n```.crypto doge usdt```";

                  client.sendMessage(from, msg, text, {
                    quoted: mek,
                  });
                }
              });
          }

          break;

        case "ban":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing); //tell them we're  typing
          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (args.length < 1)
            return reply("*Usage:*\n```.ban @shreya\n.ban @sahil```");
          if (
            mek.message.extendedTextMessage === undefined ||
            mek.message.extendedTextMessage === null
          )
            return reply("*Usage:*\n```.ban @shreya\n.ban @sahil```");
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid;

          grpconfig.name = prefix;
          fs.writeFileSync(
            "./src/grpconfig.json",
            JSON.stringify(setting, null, "\t")
          );
          mentions(
            `Banned @${
              mentioned[0].split("@")[0]
            } from accessing the bot in this group!`,
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
              {
                quoted: mek,
              }
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

        case "xinvite":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);
          if (args.length < 1) return reply("*Usage*\n```.invite [link]```");
          if (
            !isUrl(args[0]) &&
            !args[0].includes("https://chat.whatsapp.com/")
          )
            return reply(mess.error.Iv);
          await client.acceptInvite(args[0].split(".com/")[1]);
          reply("```Joined succesfully!```");

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

        case "xadd":
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
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          await client.groupSettingChange(
            from,
            GroupSettingChange.messageSend,
            true
          );
          reply("```Silence```");
          break;

        case "open":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          if (!isGroupAdmins) return reply(mess.only.admin);
          if (!isBotGroupAdmins) return reply(mess.only.Badmin);
          await client.groupSettingChange(
            from,
            GroupSettingChange.messageSend,
            false
          );
          reply("```Speak```");
          break;

        case "purge":
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

        case "xrashmika": // random rashmika stickers
          //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
          var ccc = Math.floor(Math.random() * 304 + 1);
          ran = "./Media/rashmika_stickers/rashmika (" + ccc + ").webp";
          client.sendMessage(from, fs.readFileSync(ran), sticker, {
            quoted: mek,
          });
          break;

        case "xrandomsticker":
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
              {
                quoted: mek,
              }
            ); //turn this on to stop spam
          if (isGroup) {
            for (var i = 1; i < 934; i++) {
              ran = "./Media/stickers/s (" + i + ").webp";
              client.sendMessage(from, fs.readFileSync(ran), sticker);
            }
          } else {
            reply(mess.error.group);
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
              "*Usage:*\n.ytaudio https://youtu.be/wui0Y\n.ytaudio https://youtu.be/BILxU"
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
              "*Usage:*\n```.ytvideo https://youtu.be/wui0w\n.ytvideo https://youtu.be/ByHxU```"
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

        case "xlyrics":
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

        case "xread":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          try {
            if (args.length < 1)
              return reply(
                "*Usage:*\n```.read [lang_code] [Text]```\n*Eg*:\n```.read en who are you?\n.read hi tum kon ho?```"
              );

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
                });
            fs.unlinkSync(ranm);
          } catch (error) {
            reply("```Error```");
          }
          break;

        case "xmeme":
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
            fs.unlinkSync("./Media/temporary/sticker.webp");
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
            fs.unlinkSync("./Media/temporary/sticker.webp");
          } else return reply("```Tag the media or send it with caption```");

          break;

        case "hello":
        case "hi":
        case "hey":
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
            "🤖 *AKM-BOT Command List* 🤖\n\n🎀 *Prefix:* .\n\n📗 *General*\n ```help, groupinfo, adminlist, contactme, requestafeature, credits```\n\n👑 *Group Admin*\n```tagall, close, open, promote, demote, kick, botleave, grouplink, changedp, changedesc, allsticker```\n\n📱 *Media*\n```sticker, ytaudio, ytvideo, crypto,  market```\n\n📃 *Issues*\n```1) Added crypto\n2) Abuse detection complete\n3) Suspended adding to groups\n4)Removed meme and add```\n *May have to face bugs or downtime*",
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
          reply("```https://forms.gle/Ji8qxYk1FVJQFEPq5```");
          break;

        case "requestafeature":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (isGroup) return reply("```works only in inbox```");
          reply("```what feature do you want?```");
          break;

        case "groupinfo":
          await client.chatRead(from); // mark chat read
          await client.updatePresence(from, Presence.available); // tell them we're available
          await client.updatePresence(from, Presence.composing);

          if (!isGroup) return reply(mess.only.group);
          const ppUrl = await client.getProfilePicture(from); // leave empty to get your own
          //console.log("download profile picture from: " + ppUrl)
          //teks = `\n💮 *Title*: ${groupMetadata.subject}\n\n👑 *Created By*: ${groupMetadata.owner.split("@")[0]}\n\n🏊 *Participiants*: ${groupMetadata.participants.lengthgroupMetadata.desc}`;
          //  client.sendMessage(from, client.getProfilePicture(from) ,MessageType.image)
          teks = `\n💮 *Title*: ${groupMetadata.subject}\n\n🏊 *Participiants*: ${groupMetadata.participants.length}\n\n🏅 *Admins*:${groupAdmins.length}\n\n🌏 *Description*:\n${groupMetadata.desc}`;

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
            reply("```No such command\nsee menu for commands```");

            // client.sendMessage(from,fs.readFileSync("./Media/response/idk.webp"),sticker, {quoted: mek });
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
