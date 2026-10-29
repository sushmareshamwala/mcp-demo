// Starts the server like Claude would, lists its tools and calls each one. Run: npm test
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "demo-test", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: [new URL("./index.js", import.meta.url).pathname] }));
const { tools } = await client.listTools();
console.log("Tools:", tools.map((t) => t.name).join(", "), "\n");
for (const [name, args] of [["signups_this_week", {}], ["find_customer", { email: "riya@example.com" }], ["revenue_summary", {}]]) {
  const r = await client.callTool({ name, arguments: args });
  console.log(`> ${name}`, JSON.stringify(args), "\n" + r.content[0].text + "\n");
}
await client.close();
