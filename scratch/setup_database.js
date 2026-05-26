import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database credentials from user input
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'FLORñoño82539@',
};

// Robust CSV Parser
function parseCSV(content) {
    const lines = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];
        
        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') {
                    cell += '"';
                    i++; // skip next quote
                } else {
                    inQuotes = false;
                }
            } else {
                cell += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                row.push(cell.trim());
                cell = '';
            } else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
                row.push(cell.trim());
                if (row.length > 1 || row[0] !== '') {
                    lines.push(row);
                }
                row = [];
                cell = '';
            } else {
                cell += char;
            }
        }
    }
    if (cell !== '' || row.length > 0) {
        row.push(cell.trim());
        lines.push(row);
    }
    return lines;
}

async function run() {
    console.log('--- Iniciando Configuración Automática de la Base de Datos ---');
    
    let connection;
    try {
        // 1. Connect to MySQL Server (without database to ensure we can create it if needed)
        console.log(`Conectando a MySQL local en ${dbConfig.host}:${dbConfig.port}...`);
        connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            multipleStatements: true
        });
        console.log('Conexión exitosa al servidor MySQL!');

        // 2. Create the Database "desarrollo"
        console.log('Creando base de datos "desarrollo" con la colación correcta...');
        await connection.query('DROP DATABASE IF EXISTS `desarrollo`;');
        await connection.query('CREATE DATABASE `desarrollo` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;');
        await connection.query('USE `desarrollo`;');
        console.log('Base de datos seleccionada.');

        // 3. Read and execute the original SQL dump creacionPopulado.sql
        const dumpPath = path.join(__dirname, '../Populado de la Base de Datos/creacionPopulado.sql');
        console.log(`Leyendo volcado SQL de ${dumpPath}...`);
        const dumpSql = fs.readFileSync(dumpPath, 'utf8');
        
        console.log('Ejecutando volcado SQL (esto creará las tablas y poblará la mayoría de los datos)...');
        await connection.query(dumpSql);
        console.log('Volcado SQL importado exitosamente!');

        // 4. Alter table "artistas" to add "contrasena" if it doesn't exist
        console.log('Añadiendo columna "contrasena" a la tabla "artistas" (si no existe)...');
        try {
            await connection.query('ALTER TABLE `artistas` ADD COLUMN `contrasena` VARCHAR(255) DEFAULT NULL;');
            console.log('Columna "contrasena" añadida exitosamente.');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log('La columna "contrasena" ya existe.');
            } else {
                throw err;
            }
        }

        // 5. Create all missing Stored Procedures
        console.log('Creando los Procedimientos Almacenados requeridos por el Backend...');

        const procedures = [
            `DROP PROCEDURE IF EXISTS cons_artistas;`,
            `CREATE PROCEDURE cons_artistas()
            BEGIN
                SELECT a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto, 
                       COALESCE(AVG(v.cant_estrellas), 0) AS promedio,
                       NULL AS nacionalidad
                FROM artistas a
                LEFT JOIN hechas_por hp ON a.DNI = hp.DNI
                LEFT JOIN votan v ON hp.nombre_escultura = v.nombre_escultura
                GROUP BY a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto;
            END;`,

            `DROP PROCEDURE IF EXISTS cons_esculturas;`,
            `CREATE PROCEDURE cons_esculturas()
            BEGIN
                SELECT e.nombre, e.f_creacion, e.antecedentes, e.tecnica,
                       (SELECT COALESCE(AVG(v.cant_estrellas), 0) FROM votan v WHERE v.nombre_escultura = e.nombre) AS promedio,
                       a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto,
                       i.URL, i.etapa
                FROM esculturas e
                LEFT JOIN hechas_por hp ON e.nombre = hp.nombre_escultura
                LEFT JOIN artistas a ON hp.DNI = a.DNI
                LEFT JOIN imagenes i ON e.nombre = i.nombre_escultura;
            END;`,

            `DROP PROCEDURE IF EXISTS getUserByEmail;`,
            `CREATE PROCEDURE getUserByEmail(IN p_email VARCHAR(100))
            BEGIN
                SELECT contacto AS email, NyA, contrasena AS contraseña, 'escultor' AS permisos, DNI
                FROM artistas
                WHERE contacto = p_email
                UNION ALL
                SELECT email, NyA, contraseña AS contraseña, 'visitante' AS permisos, NULL AS DNI
                FROM visitantes
                WHERE email = p_email;
            END;`,

            `DROP PROCEDURE IF EXISTS cons_eventos;`,
            `CREATE PROCEDURE cons_eventos()
            BEGIN
                SELECT ev.nombre, ev.lugar, ev.fecha_inicio, ev.fecha_fin, ev.tematica, ev.hora_inicio, ev.hora_fin,
                       COALESCE((
                           SELECT AVG(v.cant_estrellas)
                           FROM compiten c
                           JOIN votan v ON c.nombre_escultura = v.nombre_escultura
                           WHERE c.nombre_evento = ev.nombre
                       ), 0) AS promedio
                FROM eventos ev;
            END;`,

            `DROP PROCEDURE IF EXISTS obrasDeUnEvento;`,
            `CREATE PROCEDURE obrasDeUnEvento(IN p_evento VARCHAR(200))
            BEGIN
                SELECT e.nombre, e.f_creacion, e.antecedentes, e.tecnica,
                       (SELECT COALESCE(AVG(v.cant_estrellas), 0) FROM votan v WHERE v.nombre_escultura = e.nombre) AS promedio,
                       a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto,
                       i.URL, i.etapa
                FROM esculturas e
                JOIN compiten c ON e.nombre = c.nombre_escultura
                LEFT JOIN hechas_por hp ON e.nombre = hp.nombre_escultura
                LEFT JOIN artistas a ON hp.DNI = a.DNI
                LEFT JOIN imagenes i ON e.nombre = i.nombre_escultura
                WHERE c.nombre_evento = p_evento;
            END;`,

            `DROP PROCEDURE IF EXISTS obrasDeUnArtista;`,
            `CREATE PROCEDURE obrasDeUnArtista(IN p_artista_name VARCHAR(100))
            BEGIN
                SELECT e.nombre, e.f_creacion, e.antecedentes, e.tecnica,
                       (SELECT COALESCE(AVG(v.cant_estrellas), 0) FROM votan v WHERE v.nombre_escultura = e.nombre) AS promedio,
                       a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto,
                       i.URL, i.etapa
                FROM esculturas e
                JOIN hechas_por hp ON e.nombre = hp.nombre_escultura
                JOIN artistas a ON hp.DNI = a.DNI
                LEFT JOIN imagenes i ON e.nombre = i.nombre_escultura
                WHERE a.NyA = p_artista_name OR CAST(a.DNI AS CHAR) = p_artista_name;
            END;`,

            `DROP PROCEDURE IF EXISTS EventosYEsculturasDeObra;`,
            `CREATE PROCEDURE EventosYEsculturasDeObra(IN p_obra VARCHAR(100))
            BEGIN
                SELECT a.DNI, a.NyA, a.res_biografia, a.contacto, a.URL_foto,
                       ev.nombre, ev.lugar, ev.fecha_inicio, ev.fecha_fin, ev.tematica, ev.hora_inicio, ev.hora_fin
                FROM esculturas e
                LEFT JOIN hechas_por hp ON e.nombre = hp.nombre_escultura
                LEFT JOIN artistas a ON hp.DNI = a.DNI
                LEFT JOIN compiten c ON e.nombre = c.nombre_escultura
                LEFT JOIN eventos ev ON c.nombre_evento = ev.nombre
                WHERE e.nombre = p_obra;
            END;`,

            `DROP PROCEDURE IF EXISTS register;`,
            `CREATE PROCEDURE register(IN p_nombreapellido VARCHAR(100), IN p_email VARCHAR(100), IN p_contrasena VARCHAR(100))
            BEGIN
                INSERT INTO visitantes(email, NyA, contraseña)
                VALUES (p_email, p_nombreapellido, p_contrasena);
            END;`,

            `DROP PROCEDURE IF EXISTS registrar_voto;`,
            `CREATE PROCEDURE registrar_voto(IN p_email VARCHAR(100), IN p_nombre_escultura VARCHAR(100), IN p_rating INT)
            BEGIN
                INSERT INTO votan(email, nombre_escultura, cant_estrellas)
                VALUES (p_email, p_nombre_escultura, p_rating);
            END;`,

            `DROP PROCEDURE IF EXISTS cambiar_contraseña;`,
            `CREATE PROCEDURE cambiar_contraseña(IN p_email VARCHAR(100), IN p_contrasena VARCHAR(100))
            BEGIN
                IF EXISTS(SELECT 1 FROM visitantes WHERE email = p_email) THEN
                    UPDATE visitantes SET contraseña = p_contrasena WHERE email = p_email;
                ELSE
                    UPDATE artistas SET contrasena = p_contrasena WHERE contacto = p_email;
                END IF;
            END;`,

            `DROP PROCEDURE IF EXISTS borrar_evento;`,
            `CREATE PROCEDURE borrar_evento(IN p_nombre VARCHAR(200), IN p_lugar VARCHAR(100))
            BEGIN
                DELETE FROM compiten WHERE nombre_evento = p_nombre;
                DELETE FROM eventos WHERE nombre = p_nombre AND lugar = p_lugar;
            END;`,

            `DROP PROCEDURE IF EXISTS modificar_evento;`,
            `CREATE PROCEDURE modificar_evento(
                IN p_nombre_actual VARCHAR(200),
                IN p_lugar_actual VARCHAR(100),
                IN p_nombre_nuevo VARCHAR(200),
                IN p_lugar_nuevo VARCHAR(100),
                IN p_fecha_inicio DATE,
                IN p_fecha_fin DATE,
                IN p_tematica VARCHAR(100),
                IN p_hora_inicio TIME,
                IN p_hora_fin TIME
            )
            BEGIN
                SET foreign_key_checks = 0;
                
                UPDATE compiten 
                SET nombre_evento = p_nombre_nuevo 
                WHERE nombre_evento = p_nombre_actual;
                
                UPDATE eventos 
                SET nombre = p_nombre_nuevo,
                    lugar = p_lugar_nuevo,
                    fecha_inicio = p_fecha_inicio,
                    fecha_fin = p_fecha_fin,
                    tematica = p_tematica,
                    hora_inicio = p_hora_inicio,
                    hora_fin = p_hora_fin
                WHERE nombre = p_nombre_actual AND lugar = p_lugar_actual;
                
                SET foreign_key_checks = 1;
            END;`,

            `DROP PROCEDURE IF EXISTS modificar_artista;`,
            `CREATE PROCEDURE modificar_artista(
                IN p_dni_resguardado INT,
                IN p_dni INT,
                IN p_nya VARCHAR(100),
                IN p_biografia TEXT,
                IN p_contacto VARCHAR(100),
                IN p_url_foto VARCHAR(255),
                IN p_contrasena VARCHAR(100)
            )
            BEGIN
                SET foreign_key_checks = 0;
                
                UPDATE hechas_por 
                SET DNI = p_dni 
                WHERE DNI = p_dni_resguardado;
                
                UPDATE artistas 
                SET DNI = p_dni,
                    NyA = p_nya,
                    res_biografia = p_biografia,
                    contacto = p_contacto,
                    URL_foto = COALESCE(p_url_foto, URL_foto),
                    contrasena = COALESCE(p_contrasena, contrasena)
                WHERE DNI = p_dni_resguardado;
                
                SET foreign_key_checks = 1;
            END;`,

            `DROP PROCEDURE IF EXISTS borrar_artista;`,
            `CREATE PROCEDURE borrar_artista(IN p_dni INT)
            BEGIN
                DELETE FROM hechas_por WHERE DNI = p_dni;
                DELETE FROM artistas WHERE DNI = p_dni;
            END;`,

            `DROP PROCEDURE IF EXISTS borrar_obra;`,
            `CREATE PROCEDURE borrar_obra(IN p_nombre_escultura VARCHAR(100))
            BEGIN
                DELETE FROM hechas_por WHERE nombre_escultura = p_nombre_escultura;
                DELETE FROM compiten WHERE nombre_escultura = p_nombre_escultura;
                DELETE FROM imagenes WHERE nombre_escultura = p_nombre_escultura;
                DELETE FROM votan WHERE nombre_escultura = p_nombre_escultura;
                DELETE FROM esculturas WHERE nombre = p_nombre_escultura;
            END;`
        ];

        for (const proc of procedures) {
            await connection.query(proc);
        }
        console.log('Procedimientos almacenados creados exitosamente!');

        // 6. Read and parse Populado de la Base de Datos/Contraseñas/artistas.csv
        const csvPath = path.join(__dirname, '../Populado de la Base de Datos/Contraseñas/artistas.csv');
        console.log(`Leyendo contraseñas de artistas desde ${csvPath}...`);
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const rows = parseCSV(csvContent);
        
        // CSV header: DNI,NyA,res_biografia,contacto,URL_foto,contrasena
        // Skip header line
        const artistsData = rows.slice(1);
        console.log(`Encontrados ${artistsData.length} artistas en el archivo CSV.`);

        // 7. Update/insert artists with their passwords
        console.log('Actualizando datos de los artistas e insertando los faltantes...');
        let updatedCount = 0;
        let insertedCount = 0;
        
        for (const artistRow of artistsData) {
            if (artistRow.length < 6) continue;
            const [dniStr, nya, res_biografia, contacto, url_foto, contrasenaPlain] = artistRow;
            const dni = parseInt(dniStr, 10);
            if (isNaN(dni)) continue;

            // Check if artist already exists in DB
            const [existing] = await connection.query('SELECT DNI FROM `artistas` WHERE `DNI` = ?', [dni]);
            
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(contrasenaPlain, saltRounds);

            if (existing.length > 0) {
                // Update existing artist including the hashed password
                await connection.query(
                    'UPDATE `artistas` SET `NyA` = ?, `res_biografia` = ?, `contacto` = ?, `URL_foto` = ?, `contrasena` = ? WHERE `DNI` = ?',
                    [nya, res_biografia, contacto, url_foto, hashedPassword, dni]
                );
                updatedCount++;
            } else {
                // Insert missing artist (like the group members)
                await connection.query(
                    'INSERT INTO `artistas` (`DNI`, `NyA`, `res_biografia`, `contacto`, `URL_foto`, `contrasena`) VALUES (?, ?, ?, ?, ?, ?)',
                    [dni, nya, res_biografia, contacto, url_foto, hashedPassword]
                );
                insertedCount++;
            }
        }
        console.log(`Proceso de artistas terminado: ${updatedCount} actualizados, ${insertedCount} insertados.`);

        // 8. Update visitors' passwords with bcrypt if they are unhashed in visitors CSV or visitors table
        // Note: Visitors in creacionPopulado.sql are inserted with random raw strings (like '}CH47H3R', 'y!_z9w%l').
        // Let's hash all Besucher/visitors passwords currently in the DB so they can login.
        console.log('Hasheando las contraseñas de todos los visitantes con bcrypt...');
        const [visitors] = await connection.query('SELECT `email`, `contraseña` FROM `visitantes`');
        let visitorsHashed = 0;
        for (const visitor of visitors) {
            // Check if password is already a bcrypt hash (starts with $2b$ or $2a$)
            if (!visitor.contraseña.startsWith('$2b$') && !visitor.contraseña.startsWith('$2a$')) {
                const hashed = await bcrypt.hash(visitor.contraseña, 10);
                await connection.query('UPDATE `visitantes` SET `contraseña` = ? WHERE `email` = ?', [hashed, visitor.email]);
                visitorsHashed++;
            }
        }
        console.log(`Contraseñas de visitantes hasheadas: ${visitorsHashed}.`);

        // 9. Update the root .env file
        const envPath = path.join(__dirname, '../.env');
        console.log(`Actualizando archivo de entorno .env en ${envPath}...`);
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace values using regex
        envContent = envContent.replace(/DB_HOST\s*=\s*['"]?.*?['"]?/g, `DB_HOST='${dbConfig.host}'`);
        envContent = envContent.replace(/DB_PORT\s*=\s*['"]?.*?['"]?/g, `DB_PORT=${dbConfig.port}`);
        envContent = envContent.replace(/DB_USER\s*=\s*['"]?.*?['"]?/g, `DB_USER='${dbConfig.user}'`);
        envContent = envContent.replace(/DB_PASSWORD\s*=\s*['"]?.*?['"]?/g, `DB_PASSWORD='${dbConfig.password}'`);
        envContent = envContent.replace(/DB_NAME\s*=\s*['"]?.*?['"]?/g, `DB_NAME='desarrollo'`);
        
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('Archivo .env actualizado exitosamente con las nuevas credenciales locales!');
        
        console.log('\n--- CONFIGURACIÓN COMPLETADA CON ÉXITO ---');
        console.log('Todo está listo en la base de datos local y el archivo de configuración.');
        
    } catch (err) {
        console.error('ERROR CRÍTICO DURANTE LA CONFIGURACIÓN:', err);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

run();
