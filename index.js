const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const WSF = require('wa-sticker-formatter')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const setting = JSON.parse(fs.readFileSync('./src/settings.json'))
const ytdl = require('ytdl-core')
const search = require('youtube-search')
const opts = { maxResults: 10, key: 'AIzaSyA1S1jM8KxdPAqb2DUXg2AQDNqbOcS2btE' }
var YoutubeMp3Downloader = require("youtube-mp3-downloader")
const solenolyrics = require("solenolyrics")
const yts = require('yt-search')
const fbv = require('fb-video-downloader')
const webp=require('webp-converter');
// this will grant 755 permission to webp executables
webp.grant_permission();
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "node_modules/ffmpeg-static-electron/bin/linux/x64/ffmpeg",        // FFmpeg binary location
    "outputPath": "./Media",             										     // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio", 											 // Desired video quality (default: highestaudio)
    "queueParallelism": 2,               										     // Download parallelism (default: 1)
    "progressTimeout": 2000,             										     // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                   										     // Enable download from WebM sources (default: false)
});


prefix = setting.prefix
blocked = ['9013844884', '8271500210']

function kyun(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
    return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
    const client = new WAConnection()
    client.logger.level = 'warn'
    console.log(banner.string)
    client.on('qr', () => {
        console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' Scan the qr code above'))
    })

    fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
    client.on('connecting', () => {
        start('2', 'Connecting...')
    })
    client.on('open', () => {
        success('2', 'Connected')
    })
    await client.connect({ timeoutMs: 30 * 1000 })
    fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('group-participants-update', async (anu) => {
        if (!welkom.includes(anu.jid)) return
        try {
            const mdata = await client.groupMetadata(anu.jid)
            console.log(anu)
            if (anu.action == 'add') {
                num = anu.participants[0]
                try {
                    ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
                } catch {
                    ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                teks = `Halo @${num.split('@')[0]}\nWelcome to the group *${mdata.subject}*`
                let buff = await getBuffer(ppimg)
                client.sendMessage(mdata.id, buff, MessageType.image, { caption: teks, contextInfo: { "mentionedJid": [num] } })
            } else if (anu.action == 'remove') {
                num = anu.participants[0]
                try {
                    ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
                } catch {
                    ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                teks = `Sayonara @${num.split('@')[0]}👋`
                let buff = await getBuffer(ppimg)
                client.sendMessage(mdata.id, buff, MessageType.image, { caption: teks, contextInfo: { "mentionedJid": [num] } })
            }
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
        }
    })

    client.on('CB:Blocklist', json => {
        if (blocked.length > 2) return
        for (let i of json[1].blocklist) {
            blocked.push(i.replace('c.us', 's.whatsapp.net'))
        }
    })

    client.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid == 'status@broadcast') return
            if (mek.key.fromMe) return
            global.prefix
            global.blocked
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const apiKey = setting.apiKey // contact me on whatsapp wa.me/6285892766102
            const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
            const time = moment.tz('Asia/Kolkata').format('DD/MM HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)





            mess = {
                wait: '⏱️ Processing',
                success: '✔️ Successful',
                error: {
                    stick: '❌ Failed, an error occurred while converting the image to a sticker. Please try again',
                    Iv: '🌐 Invalid link'
                },
                only: {
                    group: '👩‍👩‍👦‍👦 This command can only be used in groups!',
                    ownerG: '💎 This command can only be used by the owner of the group!',
                    ownerB: '🎩 This command can only be used by the owner of the bot!',
                    admin: '🤷‍♂️ This command can only be used by the admins',
                    Badmin: '🤖 This command can only be used when the bot has admin rights!'
                }
            }

            const botNumber = client.user.jid
            const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`] // replace this with your number
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId = isGroup ? groupMetadata.jid : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isWelkom = isGroup ? welkom.includes(from) : false
            const isSimi = isGroup ? samih.includes(from) : false
            const isOwner = ownerNumber.includes(sender)
            const isUrl = (url) => {
                return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
            }
            const reply = (teks) => {
                client.sendMessage(from, teks, text, { quoted: mek })
            }
            const sendMess = (hehe, teks) => {
                client.sendMessage(hehe, teks, text)
            }
            const mentions = (teks, memberr, id) => {
                (id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, { contextInfo: { "mentionedJid": memberr } }) : client.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": memberr } })
            }

            colors = ['red', 'white', 'black', 'blue', 'yellow', 'green']
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
            if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
            if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
            if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
            let authorname = client.contacts[from] != undefined ? client.contacts[from].vname || client.contacts[from].notify : undefined
            if (authorname != undefined) { } else { authorname = groupName }









































            if (sender == "917404486414@s.whatsapp.net" || sender == "917003685950@s.whatsapp.net") return
            else {


                switch (command) {

                    //################################  Admin  COMMANDS   ##################################################


                    case 'invite':
                        if (args.length < 1) return reply('PLz provide link')
                        if (!isUrl(args[0]) && !args[0].includes('https://chat.whatsapp.com/')) return reply(mess.error.Iv)
                        try {
                            response = await client.acceptInvite(args[0])
                            console.log("joined to: " + response.gid)
                            reply('Joined succesfully!')

                        } catch (e) {
                            console.log('Error :', e)
                            reply('Unable to join.')
                        }
                        break



                    case 'tagall':  //tag everyone in the group
                        if (!isGroup) return reply(mess.only.group)

                        if (!isGroupAdmins) return reply(mess.only.admin)
                        members_id = []
                        teks = (args.length > 1) ? body.slice(8).trim() : ''
                        teks += '\n\n'
                        for (let mem of groupMembers) {
                            teks += `🍥 @${mem.jid.split('@')[0]}\n`
                            members_id.push(mem.jid)
                        }
                        mentions(teks, members_id, true)
                        break



                    case 'promote':    //promote someone to admin
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('*Usage:*\n.promote @bot\n.promote @shreya')
                        if (mentioned.length > 1) {
                            teks = 'Promote success\n'
                            for (let _ of mentioned) {
                                teks += `@${_.split('@')[0]}\n`
                            }
                            mentions(from, mentioned, true)
                            client.groupRemove(from, mentioned)
                        } else {
                            mentions(`Promoted @${mentioned[0].split('@')[0]} as a Group Admin!`, mentioned, true)
                            client.groupMakeAdmin(from, mentioned)
                        }
                        break



                    case 'demote':
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
                        reply('*Usage:*\n.demote @bot\n.demote @shreya')
                        if (mentioned.length > 1) {
                            teks = 'Successfully demoted\n'
                            for (let _ of mentioned) {
                                teks += `@${_.split('@')[0]}\n`
                            }
                            mentions(teks, mentioned, true)
                            client.groupRemove(from, mentioned)
                        } else {
                            mentions(`successfully demoted @${mentioned[0].split('@')[0]} Became a Group Member!`, mentioned, true)
                            client.groupDemoteAdmin(from, mentioned)
                        }
                        break



                    case 'add':
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (args.length < 1) return reply('*Usage:*\n.add 919876543210\n.add 919876565656')
                        try {
                            if (args[0].length < 11) {
                                args[0] = '91' + args[0]
                            }
                            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
                            client.groupAdd(from, [num])
                        } catch (e) {
                            console.log('Error :', e)
                            reply('Unable to add due to privacy setting')
                        }
                        break



                    case 'kick':

                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('*Usage:*\n.kick @bot\n.kick @shreya')
                        mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                        if (mentioned.length > 1) {
                            teks = 'Orders received, kicked :\n'
                            for (let _ of mentioned) {
                                teks += `@${_.split('@')[0]}\n`
                            }
                            mentions(teks, mentioned, true)
                            client.groupRemove(from, mentioned)
                        } else {
                            mentions(`Orders received, kicked : @${mentioned[0].split('@')[0]}`, mentioned, true)
                            client.groupRemove(from, mentioned)
                        }
                        break





                    case 'grouplink':
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        linkgc = await client.groupInviteCode(from)
                        reply('https://chat.whatsapp.com/' + linkgc)
                        break


                    case 'boleave':
                        if (!isGroup) return reply(mess.only.group)
                        if (isGroupAdmins || isOwner) {
                            client.groupLeave(from)
                        } else {
                            reply(mess.only.admin)
                        }
                        break


                    case 'setprefix':
                        if (args.length < 1) return
                        if (!isOwner) return reply(mess.only.ownerB)
                        prefix = args[0]
                        setting.prefix = prefix
                        fs.writeFileSync('./src/settings.json', JSON.stringify(setting, null, '\t'))
                        reply(`The prefix has been successfully changed to : ${prefix}`)
                        break


                    case 'close':
                        reply('feature yet to be released!')
                        break


                    case 'open':
                        reply('feature yet to be released!')
                        break
                    case 'purge':
                        reply('feature yet to be released!')
                        break

                    case 'q':
                        reply('feature yet to be released!')
                        break

                    case 'w':
                        reply('feature yet to be released!')
                        break



                    case 'changedp':
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (!(isMedia || isQuotedImage)) return reply('Tag the image with the caption .changedp or send with the caption .changedp ')

                        reply(mess.wait)
                        await client.updateProfilePicture(from, img)
                        break




                    case 'title':

						/*if (!isGroup) return reply(mess.only.group)
						if (!isGroupAdmins) return reply(mess.only.admin)
						if (!isBotGroupAdmins) return reply(mess.only.Badmin)
						if (args.length < 1) return reply('*Usage:*\n.title Friends group\n.title Engineering Graphics group')
						client.groupUpdateSubject(from, args)*/
                        break




                    case 'changedesc':
                        if (!isGroup) return reply(mess.only.group)
                        if (!isGroupAdmins) return reply(mess.only.admin)
                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                        if (args.length < 1) return reply('*Usage:*\n.changedesc Friends group\n.changedesc Engineering Graphics group')

                        await client.groupUpdateDescription(from, args)
                        break
































                    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Media $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$








                    case 'fbvid':
                        fbv.getInfo(args).then((info) => console.log(JSON.stringify(info, null, 2)));
                        break








                    /*case 's':
    
    
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia)
                            const sticker = new WSF.Sticker('undefined.jpg', {})
                            await sticker.build()
                            const sticBuffer = await sticker.get()
                            fs.writeFile('sticker.webp', sticBuffer)
                            client.sendMessage(from, sticBuffer, MessageType.sticker,{quoted: mek})
                        }else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia)
                            const sticker = new WSF.Sticker(media, { crop: false, animated: true })
                            await sticker.build()
                            const sticBuffer = await sticker.get()
                            fs.writeFile('sticker.webp', sticBuffer)
                            client.sendMessage(from, sticBuffer, MessageType.sticker,{quoted: mek})
                        }
                        break*/















                    case 'rashmika': // random rashmika stickers
                        //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
                        var ccc = Math.floor((Math.random() * 90) + 1);
                        ran = "./Media/rashmika_stickers/rashmika (" + ccc + ").webp"
                        client.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                        break


                    case 'rs':


                        // random sticker
                        //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
                        var ccc = Math.floor((Math.random() * 1385) + 1);
                        ran = "./Media/stickers/s (" + ccc + ").webp"
                        client.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                        break


                    case 'alls':  // all sticker
                        //client.sendMessage(from, "stopped due stupid behaviour", text, {quoted: mek})  //turn this on to stop spam
                        if (isGroupAdmins || isOwner) {
                            for (var i = 1; i < 1300; i++) {
                                ran = "./Media/stickers/s (" + i + ").webp"
                                client.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                            }
                        }
                        else {
                            reply(mess.error.ownerB)
                        }
                        break



                    case 'rall':  // all rashmika stickers
                        //client.sendMessage(from, "stopped due stupid behaviour", text)  //turn this on to stop spam
                        if (!(isGroupAdmins || isOwner)) return reply(mess.error.ownerB)
                        for (var i = 1; i < 420; i++) {
                            ran = "./Media/rashmika_stickers/rashmika (" + i + ").webp"
                            client.sendMessage(from, fs.readFileSync(ran), sticker)
                        }

                        break



                    case 'rashu':  // all rashmika stickers
                        if (isGroup) return reply('What does this command do?')
                        for (var i = 1; i < 420; i++) {
                            ran = "./Media/rashmika_stickers/rashmika (" + i + ").webp"
                            client.sendMessage(from, fs.readFileSync(ran), sticker)
                        }

                        break



                    case 'yta':


                        if (args.length < 1) return reply('*Usage:*\n.yta https://youtu.be/wui0YweevtY\n.yta https://youtu.be/ByH9LuSILxU')
                        if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)

                        YD.download(ytdl.getVideoID(args[0]), 'audio.mp3');

                        function function24() {
                            client.sendMessage(
                                from,
                                { url: "./Media/audio.mp3" }, // can send mp3, mp4, & ogg
                                MessageType.audio,
                                { mimetype: Mimetype.mp4Audio })
                        }
                        setTimeout(function24, 15000);


                        break




                    case 'ytv':


                        if (args.length < 1) return reply('*Usage:*\n.ytv https://youtu.be/wui0YweevtY\n.ytv https://youtu.be/ByH9LuSILxU')
                        if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)

                        ytdl(args[0]).pipe(fs.createWriteStream('video.mp4'));
                        reply(mess.wait)
                        function function2() {
                            client.sendMessage(from, fs.readFileSync("./video.mp4"), MessageType.video, { quoted: mek, caption: 'Hers is the video.' })
                        }
                        setTimeout(function2, 15000);
                        break










                    case 'yts':

                        reply('feature yet to be released!')
                        search(args[0], opts, function(err, results) {
                            if (err) return console.log(err);
                            console.log(results)
                        });
                        break




                    case 'sticker':
                        reply('No! The bot does not make sticker.')
                        break






                    case 'lyrics':
                        if (args.length < 1) return reply('*Usage:*\n.lyrics brown munde\n.lyrics Jab Pyar Kiya To Darna Kya')
                        var lyrics = await solenolyrics.requestLyricsFor(args);
                        reply(lyrics)
                        break



                    case 'read':
                        if (!isGroupAdmins) return reply("❌ This command can only be used by the admin! due to excessive spamming")
                        if (args.length < 1) return reply('*Usage:*\n.read [language_code] [Text to be converted to audio]\n*eg:*\n.read en how are you?\n.read hi tu kese ho?')
                        const gtts = require('./lib/gtts')(args[0])
                        if (args.length < 2) return client.sendMessage(from, 'Where is the text?', text, { quoted: mek })
                        dtt = body.slice(9)
                        ranm = getRandom('.mp3')
                        dtt.length > 600
                            ? reply('Too long! should be less than 600 characters.')
                            : gtts.save(ranm, dtt, function() {
                                client.sendMessage(from, fs.readFileSync(ranm), audio, { quoted: mek, mimetype: 'audio/mp4', ptt: true })
                                fs.unlinkSync(ranm)
                            })
                        break












                    case 'meme':

                        meme = await fetchJson('https://kagchi-api.glitch.me/meme/memes', { method: 'get' })
                        buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
                        client.sendMessage(from, buffer, image, { quoted: mek, caption: 'maymay' })
                        break







                    case 'st':
                        if (!(isMedia || isQuotedImage)) return reply('Tag the image with the caption .st or send with the caption .st ')
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                        const media = await client.downloadAndSaveMediaMessage(encmedia)
                        const img = fs.readFileSync(media)

                        webp.cwebp('undefined.jpeg',"sticker.webp","-q 80");
                        ran = "sticker.webp"
                        client.sendMessage(from, fs.readFileSync(ran), sticker,{ quoted: mek})
                        break









































                    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  general  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



                    case 'help':
                        client.sendMessage(from, help(prefix), text, { quoted: mek })
                        break



                    case 'group':
                        const ppUrl = await client.getProfilePicture(from) // leave empty to get your own
                        console.log("download profile picture from: " + ppUrl)
                        //client.sendMessage(from, ppUrl ,MessageType.image ,{ mimetype: Mimetype.jpeg, caption: "hello!" })


                        const metadata = await client.groupMetadata(from)
                        console.log(json.id + ", title: " + json.subject + ", description: " + json.desc)

                        break







                    case 'intro':

                        break





                    case 'tagall':  //tag everyone in the group
                        if (!isGroup) return reply(mess.only.group)

                        if (!isGroupAdmins) return reply(mess.only.admin)
                        members_id = []
                        teks = (args.length > 1) ? body.slice(8).trim() : ''
                        teks += '\n\n'
                        for (let mem of groupMembers) {
                            teks += `🍥 @${mem.jid.split('@')[0]}\n`
                            members_id.push(mem.jid)
                        }
                        mentions(teks, members_id, true)
                        break







                    case 'adminlist':
                        if (!isGroup) return reply(mess.only.group)
                        teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
                        no = 0
                        for (let admon of groupAdmins) {
                            no += 1
                            teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
                        }
                        mentions(teks, groupAdmins, true)
                        break














                    default:

                        if (isGroup && isSimi && budy != undefined) {
                            console.log(budy)
                            muehe = await simih(budy)
                            console.log(muehe)
                            reply(muehe)
                        } else {
                            //return console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))

                        }
                }
            }
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
        }
    })
}
starts()
