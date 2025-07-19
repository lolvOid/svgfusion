#!/usr/bin/env node

import { runCli } from 'svgfusion-cmd';

async function main() {
  try {
    await runCli();
  } catch (error) {
    console.error('Error running CLI:', error);
    process.exit(1);
  }
}

main();
