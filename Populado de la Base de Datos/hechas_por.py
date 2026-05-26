import pandas as pd
import random

# Cargar datos de artistas y esculturas desde los CSV
artistas_df = pd.read_csv('artistas.csv')
esculturas_df = pd.read_csv('esculturas.csv')

# Cantidad de registros que queremos generar para la tabla Hechas_Por
num_records = 200

# Listas para almacenar los datos generados
dni = []
nombre_escultura = []

# Asignar un autor a cada escultura
for nombre_escultura_hecha in esculturas_df['nombre'].tolist():
    dni_artista = random.choice(artistas_df['DNI'].tolist())
    dni.append(dni_artista)
    nombre_escultura.append(nombre_escultura_hecha)

# Generar mas combinaciones (permitiendo repeticiones)
while len(dni) < num_records:
    # Elegir un DNI aleatorio de la lista de artistas
    dni_artista = random.choice(artistas_df['DNI'].tolist())
    
    # Elegir un nombre de escultura aleatorio de la lista de esculturas
    nombre_escultura_hecha = random.choice(esculturas_df['nombre'].tolist())

    # Almacenar los datos
    dni.append(dni_artista)
    nombre_escultura.append(nombre_escultura_hecha)

# Crear un DataFrame con los datos de la tabla Hechas_Por
df_hechas_por = pd.DataFrame({
    'DNI': dni,
    'nombre_escultura': nombre_escultura
})

# Guardamos el DataFrame en un archivo CSV
df_hechas_por.to_csv('hechas_por.csv', index=False)

print("Archivo hechas_por.csv creado exitosamente uwu")
