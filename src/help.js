const help = (prefix) => {
	return ` 🤖 *BOT Command List* 🤖


*Bot currently under development.*
*May have to face bugs or downtime!*



📗 *General* 
${prefix}help, ${prefix}group, ${prefix}adminlist

👑 *Admin* 
${prefix}tagall, ${prefix}promote, ${prefix}demote, ${prefix}kick, ${prefix}add, ${prefix}botleave, ${prefix}grouplink, ${prefix}changedp, ${prefix}changedesc, ${prefix}allsticker

📱 *Media* 
${prefix}sticker, ${prefix}rashmika, ${prefix}read, ${prefix}ytaudio, ${prefix}ytvideo, ${prefix}lyrics, ${prefix}meme, ${prefix}toimg, ${prefix}randomsticker

📃 *updates*
1) read:    removed admin only permission
2) sticker: sticker can now be made using the bot
3) toimg:   added  sticker to image conversion feature`
}

exports.help = help