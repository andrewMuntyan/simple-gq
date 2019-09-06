const dotenv = require('dotenv');

dotenv.config({ path: 'variables.env' });

const createServer = require('./createServer');

const server = createServer();

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at ${url}`);
});
