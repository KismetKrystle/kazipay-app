import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = join(__dirname, 'saveWallet.js');

exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing script: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        return;
    }
    console.log(`Script output: ${stdout}`);
}); 