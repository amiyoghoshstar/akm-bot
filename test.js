

const grpconfig = require("./src/grpconfig.json");
//console.log(grpconfig[0])
const fs = require("fs");



var gg =fs.readFileSync( "./src/grpconfig.json")
gg = JSON.parse(gg.toString());
console.log(gg.toString())




grpconfig.hsd = {
    id:"dsdjghjhee",
    sticker: false,
    ytaudio: true,
    ytvideo: true,
    read: true,
    lyrics: true,
    meme: true,
    rashmika: true,
    randomsticker: true,

    blocklist: ['asas'],
};       

//console.log(gff[0])


fs.writeFileSync(
    "./src/grpconfig.json",
    JSON.stringify(grpconfig, null, "\t")
);
