const { Readable } = require('stream');
const { parse } = require("csv-parse");

exports.dataExtractor = async (csvFile) => {
  const res = [];
  const stream = Readable.from(csvFile);
  stream.pipe(parse({ columns: true }))
  .on('data',(data) => {
    console.log(data);
    res.push(data);
  })
  .on('end',() => {
    console.log(res.length)
  })
};