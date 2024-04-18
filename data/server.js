const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add this middleware to delay responses to all requests
server.use((req, res, next) => {
  setTimeout(next, 2000); // delays responses by 2 seconds
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
