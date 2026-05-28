import { crearConexion } from './conexiondb.js';

async function fixCollations() {
  const con = crearConexion();
  con.connect(async (err) => {
    if (err) throw err;
    console.log("Connected to Aiven DB.");

    const queries = [
      "SET FOREIGN_KEY_CHECKS = 0;",
      "ALTER DATABASE defaultdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE artistas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE eventos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE esculturas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE compiten CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE hechas_por CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE visitantes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE votan CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "ALTER TABLE imagenes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
      "SET FOREIGN_KEY_CHECKS = 1;"
    ];

    for (let q of queries) {
      await new Promise((resolve, reject) => {
        con.query(q, (err) => {
          if (err) {
              console.error("Error running query:", q);
              console.error(err);
              resolve(); // ignore error to continue
          } else {
              console.log("Successfully ran:", q);
              resolve();
          }
        });
      });
    }
    con.end();
    console.log("All done!");
  });
}

fixCollations();
