const unirest =require('unirest')
unirest
.get('https://api.wazirx.com/api/v2/trades?market=' + args[0] + args[1])
.then((response) => {
  var crypto_body = response.body;

  if (response.error) {

    client.sendMessage(
      from,
      "```This method is not supported yet.```\n\n*Supported Argument* : ```.crypto <crypto_code> inr```",
      text, {
        quoted: mek,
      }
    );
  } else {
    console.log(
      from,
      " " + args[0].toUpperCase() + "/" + args[1].toUpperCase() + " ⚡\n" +
      "```Price : " + crypto_body[0].price.toUpperCase() + " ```\n" +
      "```Volume : " + crypto_body[0].volume.toUpperCase() + " ```\n" +
      "```Funds : " + crypto_body[0].funds.toUpperCase() + " ```\n" +
      "```Time : " + new Date().toLocaleString() + " ```\n"
    );
  }
})
 else {
unirest
.get('https://api.wazirx.com/api/v2/tickers')
.then((response) => {
  var crypto_body = response.body;

  if (response.error) {

    client.sendMessage(
      from,
      "Currently API Down",
      text, {
        quoted: mek,
      }
    );
  } else {

    var msg = '*Statistics* 📈 \n\n';
    let pcrypto = ['btcinr', 'xrpinr', 'ethinr', 'trxinr', 'eosinr', 'usdtinr'];

    pcrypto.forEach(function(popular_crypto) {
      msg += 'Crypto : *' + crypto_body[popular_crypto]['name'] + '*\n';
      msg += 'Price : *₹' + crypto_body[popular_crypto]['last'] + '*\n';
      msg += 'High : *₹' + crypto_body[popular_crypto]['high'] + '*\n';
      msg += 'Low : *₹' + crypto_body[popular_crypto]['low'] + '*\n\n';

    });
    msg += 'Other Command : ```.crypto <crypto_code> inr```';

    client.sendMessage(
      from,
      msg,
      text, {
        quoted: mek,
      }
    );
  }
});
}