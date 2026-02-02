import { createServer } from './server.js';

// Parse command line arguments
const args = process.argv.slice(2);
let port = 9300;
let dataDir = './data';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
        port = parseInt(args[i + 1], 10);
        i++;
    } else if (args[i] === '--data' && args[i + 1]) {
        dataDir = args[i + 1];
        i++;
    }
}

const server = createServer({ dataDir });

server.listen(port, () => {
    console.log(`Recombee mock server listening on port ${port}`);
    console.log(`Data directory: ${dataDir}`);
});
