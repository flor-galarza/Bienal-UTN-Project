from faker import Faker
import pandas as pd
import random
from datetime import datetime, timedelta

# Inicializamos Faker
fake = Faker()

# Cantidad de registros que queremos generar
num_records = 50

# Listas para almacenar los datos generados
nombre = []
lugar = []
fecha_inicio = []
fecha_fin = []
tematica = []
hora_inicio = []
hora_fin = []

# Posibles tematicas de los eventos
tematicas = ['Arte Contemporaneo', 'Escultura Urbana', 'Patrimonio Cultural', 'Tecnologia y Arte', 'Historia del Arte', 'Esculturas Modernas']

# Definir el rango de fechas (desde una semana atras hasta ayer)
end_date = datetime.now() - timedelta(days=1)
start_date = end_date - timedelta(days=7)

# Generar horas posibles entre 8:00 AM y 10:00 PM (con intervalos de 30 minutos)
horas = [f'{hour:02}:00' for hour in range(8, 22)] + [f'{hour:02}:30' for hour in range(8, 22)]

# Generacion de los datos
for _ in range(num_records):
    nombre_evento = f"Expo {fake.word().capitalize()}"  # Nombre de eventos sin el ano, p.ej. "Expo Innovacion"
    nombre.append(nombre_evento)
    
    lugar_evento = fake.city()  # Lugar como una ciudad
    lugar.append(lugar_evento)
    
    fecha_evento_inicio = fake.date_between(start_date=start_date, end_date=end_date)  # Fecha de inicio entre hace 1 semana y ayer
    fecha_inicio.append(fecha_evento_inicio)
    
    # Fecha de fin entre la fecha de inicio y un maximo de 2 dias despues
    fecha_evento_fin = fake.date_between(start_date=fecha_evento_inicio, end_date=fecha_evento_inicio + timedelta(days=2))
    fecha_fin.append(fecha_evento_fin)
    
    tematica_evento = random.choice(tematicas)  # Seleccionamos una tematica al azar
    tematica.append(tematica_evento)
    
    # Aseguramos que siempre haya opciones para hora de fin seleccionando hora_inicio entre 8:00 AM y 9:30 PM
    hora_evento_inicio = random.choice(horas[:-3])  # Evitamos que hora de inicio sea 21:30 o mas tarde
    posibles_horas_fin = [hora for hora in horas if hora > hora_evento_inicio]  # Horas posibles despues de la hora de inicio
    hora_evento_fin = random.choice(posibles_horas_fin)
    
    hora_inicio.append(hora_evento_inicio)
    hora_fin.append(hora_evento_fin)

# Crear un DataFrame con los datos
df = pd.DataFrame({
    'nombre': nombre,
    'lugar': lugar,
    'fecha_inicio': fecha_inicio,
    'fecha_fin': fecha_fin,
    'tematica': tematica,
    'hora_inicio': hora_inicio,
    'hora_fin': hora_fin
})

# Guardamos el DataFrame en un archivo CSV
df.to_csv('eventos.csv', index=False)

print("Archivo eventos.csv creado exitosamente uwu")
