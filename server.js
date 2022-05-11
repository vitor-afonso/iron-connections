const http = require('http');

let app = require('./app');

(err, req, res) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
};

let server = http.createServer(app);

let io = app.io;
io.attach(server, {
  cors: {
    origin: process.env.ORIGIN || 3000,
    methods: ['GET', 'POST'],
  },
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
