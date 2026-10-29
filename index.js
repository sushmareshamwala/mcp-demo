#!/usr/bin/env node
// A tiny MCP server for a pretend SaaS (DemoDesk). Claude can call 3 read-only tools:
//   signups_this_week · find_customer · revenue_summary
// Run by an MCP client (Claude Code, Claude Desktop, Cursor). See README.md.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { customers } from "./data.js";

const server = new McpServer({ name: "demodesk", version: "1.0.0" });
const text = (t) => ({ content: [{ type: "text", text: t }] });
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

// 1. How many people signed up in the last 7 days?
server.registerTool(
  "signups_this_week",
  { title: "Signups this week", description: "List the customers who signed up in the last 7 days, newest first.", inputSchema: {}, annotations: readOnly },
  async () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const list = customers.filter((c) => c.signedUp >= weekAgo).sort((a, b) => b.signedUp.localeCompare(a.signedUp));
    return text(`${list.length} signups in the last 7 days:\n` + list.map((c) => `- ${c.name} (${c.plan}, ${c.status}) on ${c.signedUp}`).join("\n"));
  }
);

// 2. Look up one customer by email.
server.registerTool(
  "find_customer",
  {
    title: "Find customer",
    description: "Find a customer by email and show their plan, monthly payment, status and signup date.",
    inputSchema: { email: z.string().describe("The customer's email, for example riya@example.com") },
    annotations: readOnly,
  },
  async ({ email }) => {
    const c = customers.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    return text(c ? `${c.name} · ${c.plan} plan · $${c.mrr}/month · ${c.status} · signed up ${c.signedUp}` : `No customer with the email ${email}.`);
  }
);

// 3. Monthly revenue, split by plan (active customers only).
server.registerTool(
  "revenue_summary",
  { title: "Revenue summary", description: "Monthly recurring revenue (MRR) from active customers, split by plan.", inputSchema: {}, annotations: readOnly },
  async () => {
    const active = customers.filter((c) => c.status === "active");
    const byPlan = {};
    for (const c of active) byPlan[c.plan] = (byPlan[c.plan] ?? 0) + c.mrr;
    const total = active.reduce((s, c) => s + c.mrr, 0);
    return text(`MRR: $${total} from ${active.length} active customers\n` + Object.entries(byPlan).map(([p, v]) => `- ${p}: $${v}`).join("\n"));
  }
);

await server.connect(new StdioServerTransport());
console.error("demodesk MCP server is running"); // stdout is the MCP channel, so logs go to stderr
