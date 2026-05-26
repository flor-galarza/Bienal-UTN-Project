import pandas as pd
import random

# Cargar datos de eventos y esculturas desde los CSV
eventos_df = pd.read_csv('eventos.csv')
esculturas_df = pd.read_csv('esculturas.csv')

# Crear un diccionario para almacenar que esculturas estan en cada evento
eventos_y_esculturas = {}

# Asignar al menos una escultura a cada evento
for nombre_evento in eventos_df['nombre'].tolist():
    # Seleccionar aleatoriamente entre 1 y 3 esculturas para asociar a este evento
    num_esculturas = random.randint(1, 3)
    esculturas_seleccionadas = random.sample(list(esculturas_df['nombre']), min(num_esculturas, len(esculturas_df)))
    
    # Guardar la relacion en el diccionario
    eventos_y_esculturas[nombre_evento] = esculturas_seleccionadas

# Asegurar que cada escultura este en al menos un evento
esculturas_asignadas = set()
for esculturas in eventos_y_esculturas.values():
    esculturas_asignadas.update(esculturas)

# Si alguna escultura no ha sido asignada, asignarla a un evento aleatorio
for escultura in esculturas_df['nombre']:
    if escultura not in esculturas_asignadas:
        # Elegir un evento aleatorio para la escultura no asignada
        evento_aleatorio = random.choice(eventos_df['nombre'].tolist())
        eventos_y_esculturas[evento_aleatorio].append(escultura)

# Listas para almacenar los datos generados para la tabla Compiten
nombre_evento = []
nombre_escultura = []

# Llenar las listas con los datos
for evento, esculturas in eventos_y_esculturas.items():
    for escultura in esculturas:
        nombre_evento.append(evento)
        nombre_escultura.append(escultura)

# Crear un DataFrame con los datos de la tabla Compiten
df_compiten = pd.DataFrame({
    'nombre_evento': nombre_evento,
    'nombre_escultura': nombre_escultura
})

# Guardamos el DataFrame en un archivo CSV
df_compiten.to_csv('compiten.csv', index=False)

print("Archivo compiten.csv creado exitosamente uwu")
