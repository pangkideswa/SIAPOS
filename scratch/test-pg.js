require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL });
pool.query('SELECT * FROM kalender_events LIMIT 1')
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
