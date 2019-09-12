const dotenv = require('dotenv');

dotenv.config({ path: 'variables.env' });

const createServer = require('./createServer');

const server = createServer();

server.listen(process.env.PORT || 4444).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at ${url}`);
});
