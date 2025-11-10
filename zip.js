import { zip } from "zip-a-folder";

await zip("./dist", "./update.zip");
console.log("✅ update.zip created successfully!");
