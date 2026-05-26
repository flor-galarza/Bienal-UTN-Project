import mysql from 'mysql2/promise';

async function check() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'FLORñoño82539@',
        database: 'desarrollo'
    });

    console.log('--- SHOW TABLE STATUS ---');
    const [status] = await connection.query('SHOW TABLE STATUS');
    for (const row of status) {
        console.log(`${row.Name}: ${row.Collation}`);
    }

    console.log('\n--- SHOW FULL COLUMNS FROM esculturas ---');
    const [colsEsculturas] = await connection.query('SHOW FULL COLUMNS FROM esculturas');
    for (const row of colsEsculturas) {
        if (row.Collation) console.log(`${row.Field}: ${row.Collation}`);
    }

    console.log('\n--- SHOW FULL COLUMNS FROM eventos ---');
    const [colsEventos] = await connection.query('SHOW FULL COLUMNS FROM eventos');
    for (const row of colsEventos) {
        if (row.Collation) console.log(`${row.Field}: ${row.Collation}`);
    }

    console.log('\n--- SHOW CREATE PROCEDURE EventosYEsculturasDeObra ---');
    const [proc] = await connection.query("SHOW CREATE PROCEDURE EventosYEsculturasDeObra");
    console.log(proc[0]['Create Procedure']);

    await connection.end();
}

check().catch(console.error);
