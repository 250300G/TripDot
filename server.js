try {
  process.loadEnvFile();
} catch(error) {
  console.warn(".env file not found, using default environment variables.");
}

const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// ✅ CORS fix
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(middlewares);

const router = jsonServer.router("db.json");
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running at port ${PORT}`);
  console.log(`Local Access at http://localhost:${PORT}`);
});