import pandas as pd
import random

# Cargar datos de visitantes y esculturas desde los CSV
visitantes_df = pd.read_csv('visitantes.csv')
esculturas_df = pd.read_csv('esculturas.csv')

# Cantidad de registros que queremos generar para la tabla Votan
num_records = 1000

# Listas para almacenar los datos generados
email = []
nombre_escultura = []
cant_estrellas = []

# Conjunto para controlar combinaciones de votos
votos_realizados = set()

# Generacion de los datos
while len(email) < num_records:
    # Elegir un email aleatorio de la lista de visitantes
    email_votante = random.choice(visitantes_df['email'].tolist())
    
    # Elegir un nombre de escultura aleatorio de la lista de esculturas
    nombre_escultura_votada = random.choice(esculturas_df['nombre'].tolist())
    
    # Crear una combinacion unica de voto
    voto_combinacion = (email_votante, nombre_escultura_votada)

    # Verificar si la combinacion ya ha sido votada
    if voto_combinacion not in votos_realizados:
        # Agregar la combinacion al conjunto para evitar repeticiones
        votos_realizados.add(voto_combinacion)
        
        # Generar una cantidad de estrellas entre 1 y 5
        estrellas = random.randint(1, 5)

        # Almacenar los datos
        email.append(email_votante)
        nombre_escultura.append(nombre_escultura_votada)
        cant_estrellas.append(estrellas)

# Crear un DataFrame con los datos de la tabla Votan
df_votan = pd.DataFrame({
    'email': email,
    'nombre_escultura': nombre_escultura,
    'cant_estrellas': cant_estrellas
})

# Guardamos el DataFrame en un archivo CSV
df_votan.to_csv('votan.csv', index=False)

print("Archivo votan.csv creado exitosamente uwu")
