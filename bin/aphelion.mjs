#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { BlockConstructor } from '../src/modules/tfmatic_converter.js';
import { block_tokenizer } from '../src/modules/tfmatic_writer.js';

async function compileFile(inputPath, outputPath = 'main.tf') {
  const ext = inputPath.split('.').pop()?.toLowerCase();
  let config;

  if (ext === 'ts' || ext === 'mjs') {
    const { default: module } = await import(inputPath);
    config = module;
  } else if (ext === 'js') {
    const module = await import(resolve(inputPath));
    config = module.default;
  } else {
    throw new Error('Unsupported file type. Use .js, .mjs, or .ts');
  }

  const block = BlockConstructor(config);
  const hclOutput = block_tokenizer(block).flat(Infinity).join('');
  writeFileSync(outputPath, hclOutput);
}

function runCLI() {
  const args = process.argv.slice(2);
  if (args[0] === 'compile') {
    const input = args[1];
    const output = args[3] || 'main.tf';
    compileFile(input, output).catch((err) => {
      console.error('Error compiling:', err.message);
      process.exit(1);
    });
  } else {
    console.error('Usage: npx aphelion compile <input.js|input.mjs|input.ts> [-o <output.tf>]');
    process.exit(1);
  }
}

runCLI();   