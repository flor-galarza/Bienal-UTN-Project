from faker import Faker
import pandas as pd
import random
import string

# Inicializamos Faker
fake = Faker()

# Cantidad de registros que queremos generar
num_records = 100

# Listas para almacenar los datos generados
email = []
nyA = []
contrasena = []

# Funcion para generar contrasenas aleatorias
def generar_contrasena(longitud=8):
    caracteres = string.ascii_letters + string.digits + string.punctuation  # Letras, numeros y simbolos
    return ''.join(random.choice(caracteres) for _ in range(longitud))

# Generacion de los datos
for _ in range(num_records):
    email_artista = fake.unique.email()  # Correo electronico unico
    email.append(email_artista)
    
    nombre_apellido = fake.name()  # Nombre y apellido
    nyA.append(nombre_apellido)
    
    contrasena_artista = generar_contrasena()  # Generar contrasena
    contrasena.append(contrasena_artista)

# Crear un DataFrame con los datos
df = pd.DataFrame({
    'email': email,
    'NyA': nyA,
    'contrasena': contrasena
})

# Guardamos el DataFrame en un archivo CSV
df.to_csv('visitantes.csv', index=False)

print("Archivo visitantes.csv creado exitosamente uwu")
