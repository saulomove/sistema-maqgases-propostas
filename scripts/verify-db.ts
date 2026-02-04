import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { capacidades } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Testing DB connection...');
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing!');
        return;
    }
    console.log('DATABASE_URL found (length: ' + process.env.DATABASE_URL.length + ')');

    try {
        const sqlConnection = neon(process.env.DATABASE_URL);
        const db = drizzle(sqlConnection);

        console.log('Querying capacities...');
        // Correct way to count
        const result = await db.select({ count: sql<number>`count(*)` }).from(capacidades);
        console.log('Capacities count:', result[0].count);

        console.log('Success!');
    } catch (e) {
        console.error('DB Error:', e);
    }
}

main();
