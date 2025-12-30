const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.resolve(__dirname, '../.env');
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Read .env file length:', envContent.length);
  
  const lines = envContent.split(/\r?\n/);
  console.log('Number of lines parsed:', lines.length);

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;

    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  });
  console.log('Env vars loaded:', Object.keys(envVars));
} catch (e) {
  console.error('Error reading .env file:', e);
  process.exit(1);
}

const connectionString = envVars.POSTGRES_URL.replace('sslmode=require', '');

if (!connectionString) {
  console.error('POSTGRES_URL not found in .env');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigration(fileName) {
  try {
    await client.connect();
    console.log(`Connected to database.`);
    
    const filePath = path.resolve(__dirname, fileName);
    console.log(`Reading migration file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide a migration filename (e.g., 011_create_site_settings_table.sql)');
  process.exit(1);
}

runMigration(fileName);
