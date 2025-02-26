try {
  const { affixSlash, timedError, timedLog } = await import('./shared');
  const express = await import('express');
  const path = await import('path');
  const app = express();
  const port = 6282;

  app.use(express.static(path.join(__dirname, '../public-http-min')));

  app.listen(port, () => {
    timedLog(`HTTP-min: Server is running at http://localhost:${port} uwu~~~`);
  });

} catch (e) {
  console.warn("HTTP-min error:");
  console.warn(e);
  console.warn("HTTP-min error end!");
}