const { exec } = require('child_process');

function runScript(tokenId) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    exec(`node index.js ${tokenId}`, (error, stdout, stderr) => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (error) {
        console.error(`Error for tokenId ${tokenId}: ${error}`);
      } else {
        console.log(`STDOUT for tokenId ${tokenId}: ${stdout}`);
      }
      if (stderr) {
        console.error(`STDERR for tokenId ${tokenId}: ${stderr}`);
      }
      console.log(`Script for tokenId ${tokenId} took ${duration}ms`);
      resolve();
    });
  });
}

function main() {
  for (let i = 1; i <= 100; i++) {
    console.log(`Running script for tokenId: ${i}`);
    const tokenId = 1400 + i;
    runScript(tokenId)
      .then(() => console.log(`Script completed for tokenId: ${tokenId}`))
      .catch((error) => console.error(`Script failed for tokenId: ${tokenId}, Error: ${error}`));
  }
}

main();
