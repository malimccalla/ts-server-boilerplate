import { startServer } from './server';

startServer().then(res => {
  console.log('Server listening on port', res.port);
});
