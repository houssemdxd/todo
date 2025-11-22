import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'myapp', 
  password: '123123',
  port: 5432
});

export default pool;
