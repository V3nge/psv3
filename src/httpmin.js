try {
  const { affixSlash, timedError, timedLog } = require('./shared');
  const express = require('express');
  const path = require('path');
  const app = express();
  const port = 6282;

  app.use(express.static(path.join(__dirname, '../public-http-min')));

  app.listen(port, () => {
    timedLog(`HTTP-min: Server is running at http://localhost:${port} uwu~~~`);
  });

} catch (e) {
  console.warn("HTTP-min error:");
  console.warn(e);
}