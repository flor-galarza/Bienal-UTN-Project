from faker import Faker
import pandas as pd
import random
from datetime import datetime, timedelta

# Inicializamos Faker
fake = Faker()

# Cantidad de registros que queremos generar
num_records = 100

# Listas para almacenar los datos generados
nombre = []
f_creacion = []
antecedentes = []
tecnica = []

# Posibles tecnicas para las esculturas
tecnicas = ['Cincelado', 'Fundicion', 'Modelado', 'Tallado', 'Soldadura']

# Rango de fechas: desde 2 anos atras hasta el dia anterior
end_date = datetime.now() - timedelta(days=1)
start_date = end_date - timedelta(days=10*365)  # Aproximadamente 2 anos

# Listas de adjetivos y sustantivos representativos
adjetivos = [
    'Majestuosa', 'Eterna', 'Intrincada', 'Resplandeciente', 'Sublime',
    'Abstraccion', 'Serena', 'Imponente', 'Trascendental', 'Dinamica',
    'Armonica', 'Atemporal', 'Elegante', 'Sofisticada', 'Radiante',
    'Mistica', 'Delicada', 'Vanguardista', 'Enigmatica', 'Estilizada',
    'Impactante', 'Monumental', 'Espiritual', 'Naturalista', 'Abstracta',
    'Brillante', 'Expresiva', 'Contemplativa', 'Visionaria', 'Clasica'
]
sustantivos = [
    'Piedra', 'Figura', 'Esencia', 'Forma', 'Silencio',
    'Reflejo', 'Horizonte', 'Monumento', 'Sombra', 'Luz',
    'Obra', 'Concepto', 'Materia', 'Trazos', 'Simetria',
    'Realidad', 'Imaginacion', 'Destello', 'Infinito', 'Movimiento',
    'Tranquilidad', 'Legado', 'Sueno', 'Profundidad', 'Caracter',
    'Perspectiva', 'Templo', 'Inspiracion', 'Tradicion', 'Identidad'
]

# Usamos un conjunto para rastrear los nombres unicos
nombres_unicos = set()

# Generacion de los datos
while len(nombre) < num_records:
    # Generar nombre de escultura combinando un adjetivo y un sustantivo
    nombre_escultura = f"{random.choice(adjetivos)} {random.choice(sustantivos)}"
    
    # Asegurarse de que el nombre sea unico
    if nombre_escultura not in nombres_unicos:
        nombres_unicos.add(nombre_escultura)  # Anadir a conjunto de nombres unicos
        nombre.append(nombre_escultura)  # Anadir el nombre de la escultura
        f_creacion.append(fake.date_between(start_date=start_date, end_date=end_date))  # Fechas entre 2 anos atras y ayer
        antecedentes.append(random.choice([0, 1]))  # Antecedentes booleanos
        tecnica.append(random.choice(tecnicas))  # Selecciona una tecnica al azar

# Crear un DataFrame con los datos
df = pd.DataFrame({
    'nombre': nombre,
    'f_creacion': f_creacion,
    'antecedentes': antecedentes,
    'tecnica': tecnica
})

# Guardamos el DataFrame en un archivo CSV
df.to_csv('esculturas.csv', index=False)

print("Archivo esculturas.csv creado exitosamente uwu")
