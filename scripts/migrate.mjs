import { execSync } from "node:child_process";

const url = process.env.SUPABASE_DB_URL;

if (!url) {
  console.log("SUPABASE_DB_URL mancante → skip migrations");
  process.exit(0);
}

execSync(`pnpm supabase db push --db-url "${url}" --include-all`, {
  stdio: "inherit",
});
