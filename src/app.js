const app = require('./config/express');
const { port } = require('./config/vars');

app.listen(port, (err, res) => {
  console.log(`Server listening on ${port}`);
});