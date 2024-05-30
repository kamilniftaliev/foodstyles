import { Pool } from "pg";

export const pool = new Pool({
  user: "foodstyles",
  database: "foodstylesdb",
  password: "foodstyles",
  port: 5432,
  host: "localhost",
});
