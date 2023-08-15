import { app } from './utils/app';
import config from 'config';
import { log } from './utils/logger';
import connectDB from './utils/connectDB';

const PORT = config.get<number>('port');
const HOST = config.get<string>('host');

const server = app.listen(PORT, async () => {
  await connectDB();
  log.info(
    `Authentication server is listening on port " http://${HOST}:${PORT}/api/v1 "`
  );
});

process.on('unhandledRejection', (err: any) => {
  console.log(err);
  console.log('SERVER ERROR ===>' + err);
  server.close(process.exit(1));
});
