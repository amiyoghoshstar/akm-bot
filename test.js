const unirest = require("unirest");
x = "gainers";
switch (args[0]) {
  case "indices":
    x = "get_indices";
    break;

  case "status":
    x = "status";
    break;

  case "gainers":
    unirest
      .get("http://localhost:3000/nse/" + "get_gainers")
      .then((response) => {
        var msg = "\n*Gainers* 📈 \n\n";
        var share = response.body;
        if (response.error) {
         // reply(from, "```Error```")
        } else {
         // console.log(share.data[0]);
          share.data.forEach(element => {
            //console.log(element);
            msg+='*'+element.symbol+'*\n```Open Price: '+element.openPrice+'```\n'+'```High Price: '+element.highPrice+'```\n'+'```Low Price : '+element.lowPrice+'```\n'+'```Previous Price: '+element.previousPrice+'```\n'+'```Last Corp Announcement: '+element.lastCorpAnnouncement+'```\n\n'
          });
          console.log(msg);



          
        }
      });

    break;

  case "indices":
    x = "";
    break;

  case "indices":
    x = "";
    break;

  case "indices":
    x = "";
    break;

  case "indices":
    x = "";
    break;

  case "indices":
    x = "";
    break;

  case "indices":
    x = "";
    break;

  default:
    x = null;
}

unirest.get("http://localhost:3000/nse/" + x).then((response) => {
  var share = response.body;
  if (response.error) {
    client.sendMessage(from, "```Error```", text, {
      quoted: mek,
    });
  } else {
    console.log(share.data[0]);
  }
});
