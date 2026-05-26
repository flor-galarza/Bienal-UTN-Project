import bcrypt from 'bcrypt';
import mysql from 'mysql2'; // o tu librería de conexión
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Crea tu conexión a la base de datos
let con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
con.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');

    // Consulta para obtener todos los usuarios con contraseñas sin hashear
    const query = 'SELECT contacto, contrasena FROM artistas';
    con.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            con.end();
            return;
        }
        // Hashear cada contraseña y actualizar la base de datos
        results.forEach(async (user) => {
            try {
                const hashedPassword = await bcrypt.hash(user.contrasena, 10); // Hashear la contraseña
                const updateQuery = 'UPDATE artistas SET contrasena = ? WHERE contacto = ?';

                // Actualizar la base de datos con la contraseña hasheada
                con.query(updateQuery, [hashedPassword, user.contacto], (err, updateResult) => {
                    if (err) {
                        console.error('Error al actualizar la contraseña para el usuario ID', user.contacto, err);
                    } else {
                        console.log(`Contraseña hasheada y actualizada para el usuario ID ${user.contacto}`);
                    }
                });
            } catch (err) {
                console.error('Error al hashear la contraseña para el usuario ID', user.contacto, err);
            }
        });
    });
});
