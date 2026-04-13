import net from 'net';

const SOCKET_PATH = process.env.PLAYER_SOCKET || '/tmp/mpv/socket/mpv.sock';

export async function sendMpvCommand(command: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(SOCKET_PATH);
    
    client.setTimeout(3000, () => {
      client.destroy();
      reject(new Error('Connection to MPV socket timed out'));
    });

    client.on('connect', () => {
      client.write(JSON.stringify(command) + '\n', () => {
        client.end();
        resolve();
      });
    });
    
    client.on('error', (err) => {
      console.error('Failed to connect to MPV socket:', err);
      reject(err);
    });
  });
}
