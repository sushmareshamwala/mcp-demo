# DemoDesk MCP · a tiny MCP server you can read in 2 minutes

A pretend SaaS called **DemoDesk**, with 8 demo customers (made-up people, no real data, no API keys). The MCP server gives Claude 3 read-only tools:

| Tool | Ask Claude | What it returns |
|---|---|---|
| `signups_this_week` | "How many people signed up this week?" | the signups of the last 7 days |
| `find_customer` | "Find riya@example.com" | plan, monthly payment, status, signup date |
| `revenue_summary` | "What's our MRR by plan?" | monthly revenue from active customers, per plan |

## Run it
```
git clone https://github.com/sushmareshamwala/mcp-demo && cd mcp-demo
npm install
npm test          # starts the server like Claude would and calls all 3 tools
```

## Connect it to Claude Code
```
claude mcp add demodesk -- node /full/path/to/mcp-demo/index.js
```
Open Claude Code, type `/mcp` to see `demodesk` connected, then ask: **"How many people signed up this week?"**

## Connect it to Claude Desktop
Settings → Developer → Edit Config, add:
```json
{
  "mcpServers": {
    "demodesk": { "command": "node", "args": ["/full/path/to/mcp-demo/index.js"] }
  }
}
```
Restart Claude Desktop.

## How it works (the whole idea)
1. `index.js` creates an MCP server and registers 3 tools with `server.registerTool(name, { description, inputSchema }, handler)`.
2. Claude reads each tool's **description** and decides when to call it.
3. The server runs the handler and sends back text. Claude turns it into a plain-words answer.

To make your own SaaS's MCP server: replace `data.js` with calls to your real API or database, and keep every tool small and clearly described. Start read-only.

Built with the official TypeScript SDK `@modelcontextprotocol/sdk` (v1.31). MIT licence.
