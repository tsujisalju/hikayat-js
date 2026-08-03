import http from "node:http";
import router from "./src/router.js";

const PORT = 3000;

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
