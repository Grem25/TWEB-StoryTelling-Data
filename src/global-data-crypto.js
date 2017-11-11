const request = require('superagent');
const json2csv = require('json2csv');
const unixDate = require('unix-time')
const fs = require('fs');

const startYear = 2014;
const startMonth = 1;
const startDay = 1;

const endYear = 2017;
const endMonth = 11;
const endDay = 4;

const dataCurrency = 'DASH';

let item = [];
let data = {};

function fetchData(startDate, endDate) {

  let timestampInt = unixDate(startDate);

  const targetUrl = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${dataCurrency}&tsyms=USD,&ts=${timestampInt}`;
  let repos = [];
  
  request
    .get(targetUrl)
    .end((err, res) => {
      let data = {};
      data.currency = dataCurrency;
      data.price = res.body.DASH.USD;
      data.date = startDate;
      item.push(data);
      if (startDate.getTime() == endDate.getTime()){
        jsontocsv(item);
      }else{ 
        fetchData(new Date(startDate.setDate(startDate.getDate() + 1)), endDate);;
      }
     

    });
}

function jsontocsv(data){
  var fields = ['currency', 'price', 'date'];

  data.forEach(function(element) {
    console.log(element);
    
  }, this);
  let csv = json2csv({ data: data, fields: fields });
  
  fs.writeFile(`raw_${dataCurrency}.csv`, csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });

}

fetchData(new Date(startYear, startMonth - 1, startDay), new Date(endYear, endMonth - 1, endDay));