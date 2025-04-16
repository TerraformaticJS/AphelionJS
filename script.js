import { BlockConstructor } from "./src/modules/tfmatic_converter.js";
import { block_tokenizer } from "./src/modules/tfmatic_writer.js";

async function run() {
  const { default: config } = await import("./dist/examples/infra.tfmatic.mjs");
  let my_block = BlockConstructor(config);
  console.log(block_tokenizer(my_block).flat(Infinity).join(""));
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});