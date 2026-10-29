// Demo data for a pretend SaaS called DemoDesk. Made-up people, no real customers.
// Dates are "days ago", so "this week" always has signups whenever you run it.
const day = 24 * 60 * 60 * 1000;
const ago = (n) => new Date(Date.now() - n * day).toISOString().slice(0, 10);

export const customers = [
  { name: "Riya Shah", email: "riya@example.com", plan: "Pro", mrr: 29, status: "active", signedUp: ago(1) },
  { name: "Aarav Mehta", email: "aarav@example.com", plan: "Starter", mrr: 9, status: "active", signedUp: ago(2) },
  { name: "Diya Patel", email: "diya@example.com", plan: "Pro", mrr: 29, status: "trial", signedUp: ago(3) },
  { name: "Kabir Rao", email: "kabir@example.com", plan: "Team", mrr: 99, status: "active", signedUp: ago(5) },
  { name: "Meera Iyer", email: "meera@example.com", plan: "Starter", mrr: 9, status: "active", signedUp: ago(6) },
  { name: "Zoya Khan", email: "zoya@example.com", plan: "Pro", mrr: 29, status: "cancelled", signedUp: ago(12) },
  { name: "Neel Joshi", email: "neel@example.com", plan: "Team", mrr: 99, status: "active", signedUp: ago(20) },
  { name: "Sara Thomas", email: "sara@example.com", plan: "Starter", mrr: 9, status: "active", signedUp: ago(34) },
];
