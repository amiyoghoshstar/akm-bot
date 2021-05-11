var API = require('./x');

var NSEAPI = API.NSE;


args='status'


           // await client.chatRead(from); // mark chat read
            //await client.updatePresence(from, Presence.available); // tell them we're available
           // await client.updatePresence(from, Presence.composing);
            var lnk = "http://localhost:3000/nse/";
  
            switch (args) {
                
              case "indices":
                x = "get_indices";
                break;
  
              case "status":
                NSEAPI.getMarketStatus()
                  .then((response) => {
                    console.log(response.data);
  
                    var share = response.body;
                  
                    if (response.error) {
                      console.log("```Error```");
                    } else {
                      console.log("Market status : ```" + response.data.status + "```");
                    }
                  });
                break;
  
              case "gainers":
                NSEAPI.getGainers()
                  .then((response) => {
                    var msg = "*Gainers* 📈";
                    var share = response.data.body;
                    if (response.error) {
                      // console.log( "```Error```")
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
                      console.log(msg);
                    }
                  });
  
                break;
  
              case "stocks":
                unirest
                  .get(
                    lnk + "get_index_stocks?symbol=nifty"
                  )
                  .then((response) => {
                    var msg = "*Index Stocks NIFTY* 📈";
                    var share = response.body;
                    if (response.error) {
                      console.log("```Error```");
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
                      console.log(msg);
                    }
                  });
  
                break;
  
              case "losers":
                unirest
                  .get(lnk + "get_losers")
                  .then((response) => {
                    var msg = "*Losers* 📈";
                    var share = response.body;
                    if (response.error) {
                      console.log("```Error```");
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
                      console.log(msg);
                    }
                  });
  
                break;
  
              case "search":
                unirest
                  .get(
                    lnk +
                      "search_stocks?keyword=" +
                      args[1].toUpperCase()
                  )
                  .then((response) => {
                    var msg = "*Search Result* 🔎";
                    var share = response.body;
                    if (response.error) {
                      console.log("```Error```");
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
                     
                      console.log(msg);
                    }
                  });
                break;
  
              case "details":
              case "detail":
                unirest
                  .get(
                    lnk +
                      "get_quote_info?companyName=" +
                      args[1].toUpperCase()
                  )
                  .then((response) => {
                    var element = response.body.data[0];
                    var msg = "📈 " + element.companyName;
  
                    if (response.error) {
                      console.log("```Error```");
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
  
                      console.log(msg);
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
  
                console.log(msg);
            }
  
   