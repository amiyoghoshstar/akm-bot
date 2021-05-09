import { NseIndia } from "stock-nse-india";

const nseIndia = new NseIndia()

// To get all symbols from NSE
nseIndia.getAllStockSymbols().then(symbols => {
    console.log(symbols)
})

// To get equity details for specific symbol
nseIndia.getEquityDetails('IRCTC').then(details => {
    console.log(details)
})
