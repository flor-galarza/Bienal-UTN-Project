import mysql from 'mysql2/promise';

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'FLORñoño82539@',
            database: 'desarrollo',
            charset: 'utf8mb4_0900_ai_ci'
        });

        const [proc] = await connection.query("SHOW VARIABLES LIKE 'collation_connection'");
        console.log("With explicit charset config:");
        console.log(proc);
        
        await connection.query("CALL EventosYEsculturasDeObra('MisticaTrazos')");
        console.log("Success! CALL works without collation error.");
        
        await connection.end();
    } catch(err) {
        console.error(err);
    }
}

check().catch(console.error);
