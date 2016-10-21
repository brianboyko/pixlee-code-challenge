// src/backend/routes.js
export default (server, app) => {

  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.")
  })

  app.post('/api/testPost', function (req, res) {
    res.send(req.body.data.toUpperCase());
  });
}
