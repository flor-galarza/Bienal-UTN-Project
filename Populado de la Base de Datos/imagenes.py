import pandas as pd
import random

# Cargar datos de esculturas desde el CSV
esculturas_df = pd.read_csv('esculturas.csv')

# Lista de URLs de imágenes (https://imgur.com/a/grupo-6-desarrollo-de-software-bienal-de-chco-Wv2jEjP)
imgur_links = [
    "https://i.imgur.com/6linGZs.jpeg",
    "https://i.imgur.com/LNaKKOw.jpeg",
    "https://i.imgur.com/e9lrzoS.jpeg",
    "https://i.imgur.com/bqyBQEU.jpeg",
    "https://i.imgur.com/AstSVpK.jpeg",
    "https://i.imgur.com/L45kMkj.jpeg",
    "https://i.imgur.com/1yLLymm.jpeg",
    "https://i.imgur.com/4ZAfMVe.jpeg",
    "https://i.imgur.com/Z7mAKAT.jpeg",
    "https://i.imgur.com/un0RMx9.jpeg",
    "https://i.imgur.com/0DAUZWd.jpeg",
    "https://i.imgur.com/1CG1GlI.jpeg",
    "https://i.imgur.com/E5AP8gq.jpeg",
    "https://i.imgur.com/HVbcdMZ.jpeg",
    "https://i.imgur.com/SFPVTzH.jpeg",
    "https://i.imgur.com/KpBwnhO.jpeg",
    "https://i.imgur.com/I3K6Q6q.jpeg",
    "https://i.imgur.com/FpzGKTT.jpeg",
    "https://i.imgur.com/CsZNfbN.jpeg",
    "https://i.imgur.com/rMTBoVp.jpeg",
    "https://i.imgur.com/Ob5PiPi.jpeg",
    "https://i.imgur.com/PNWsOBr.jpeg",
    "https://i.imgur.com/uuCUmcg.jpeg",
    "https://i.imgur.com/Wc0V9Tm.jpeg",
    "https://i.imgur.com/A6tw1A8.jpeg", 
    "https://i.imgur.com/9kdyNku.jpeg",
    "https://i.imgur.com/gOnWGvl.jpeg",
    "https://i.imgur.com/cWL6W5h.jpeg",
    "https://i.imgur.com/hYRgFUX.jpeg",
    "https://i.imgur.com/xjhRUvS.jpeg", 
    "https://i.imgur.com/FHGWt0l.jpeg", 
    "https://i.imgur.com/FsvZGDB.jpeg",
    "https://i.imgur.com/88bVzdM.jpeg",
    "https://i.imgur.com/co7bJUV.jpeg",
    "https://i.imgur.com/a5HkvyO.jpeg",
    "https://i.imgur.com/qyTprZy.jpeg",
    "https://i.imgur.com/zDnoECO.jpeg",
    "https://i.imgur.com/GunxQ9K.jpeg",
    "https://i.imgur.com/m2jasin.jpeg",
    "https://i.imgur.com/mex8aK5.jpeg",
    "https://i.imgur.com/HoScr5I.jpeg",
    "https://i.imgur.com/gRpCRpE.jpeg",
    "https://i.imgur.com/veKKUPo.jpeg",
    "https://i.imgur.com/wIT3GRz.jpeg",
    "https://i.imgur.com/x9xdmSP.jpeg",
    "https://i.imgur.com/hSOLuXD.jpeg",
    "https://i.imgur.com/hLhRIF8.jpeg",
    "https://i.imgur.com/f76xFAl.jpeg",
    "https://i.imgur.com/URpYIg0.jpeg",
    "https://i.imgur.com/ZcDPCy5.jpeg",
    "https://i.imgur.com/gFrXG3K.jpeg",
    "https://i.imgur.com/XsZTHRt.jpeg",
    "https://i.imgur.com/RNgoBiv.jpeg",
    "https://i.imgur.com/y8Un6BA.jpeg",
    "https://i.imgur.com/ZDTtNtH.jpeg",
    "https://i.imgur.com/lcRIdEF.jpeg",
    "https://i.imgur.com/WyX8KkK.jpeg",
    "https://i.imgur.com/0opyKSZ.jpeg",
    "https://i.imgur.com/iKrcgnt.jpeg",
    "https://i.imgur.com/vLVcxGF.jpeg",
    "https://i.imgur.com/WxWhsX5.jpeg",
    "https://i.imgur.com/BGJoGao.jpeg",
    "https://i.imgur.com/naxExUB.jpeg",
    "https://i.imgur.com/bz1goQf.jpeg",
    "https://i.imgur.com/GroiJON.jpeg",
    "https://i.imgur.com/M0TPZ2a.jpeg",
    "https://i.imgur.com/SeBSAt1.jpeg",
    "https://i.imgur.com/3vbbE0s.jpeg",
    "https://i.imgur.com/EQTqxYY.jpeg",
    "https://i.imgur.com/q9o0eQe.jpeg",
    "https://i.imgur.com/ExV5zQR.jpeg",
    "https://i.imgur.com/UrpEIiO.jpeg",
    "https://i.imgur.com/ZVoQAYp.jpeg",
    "https://i.imgur.com/HMT3r98.jpeg",
    "https://i.imgur.com/zEO03ZR.jpeg",
    "https://i.imgur.com/EtNULUZ.jpeg",
    "https://i.imgur.com/s4by0ji.jpeg",
    "https://i.imgur.com/Av4A1Fv.jpeg",
    "https://i.imgur.com/wfeOIZP.jpeg",
    "https://i.imgur.com/9AB0cry.jpeg",
    "https://i.imgur.com/8R8JwVu.jpeg",
    "https://i.imgur.com/jpVmmnh.jpeg",
    "https://i.imgur.com/TANIu54.jpeg",
    "https://i.imgur.com/YxYQxfC.jpeg",
    "https://i.imgur.com/9AJrN9X.jpeg",
    "https://i.imgur.com/cjMUT1m.jpeg",
    "https://i.imgur.com/M1RJfnd.jpeg",
    "https://i.imgur.com/XWAsJt3.jpeg",
    "https://i.imgur.com/JBIpLx9.jpeg",
    "https://i.imgur.com/rXs0YaK.jpeg",
    "https://i.imgur.com/Kd2hKtw.jpeg",
    "https://i.imgur.com/PBac05e.jpeg",
    "https://i.imgur.com/SWPHI8i.jpeg",
    "https://i.imgur.com/1ssY5aT.jpeg",
    "https://i.imgur.com/TuSLRo5.jpeg",
    "https://i.imgur.com/UTxRzKv.jpeg",
    "https://i.imgur.com/NiLOxJu.jpeg",
    "https://i.imgur.com/qMl9uFZ.jpeg",
    "https://i.imgur.com/blQrtfB.jpeg",
    "https://i.imgur.com/x8glEmB.jpeg",
    "https://i.imgur.com/nCroSDZ.jpeg",
    "https://i.imgur.com/ipEHcGy.jpeg",
    "https://i.imgur.com/mCoPOSQ.jpeg",
    "https://i.imgur.com/UftaX19.jpeg",
    "https://i.imgur.com/puTDk7Y.jpeg",
    "https://i.imgur.com/nbIlnp8.jpeg",
    "https://i.imgur.com/ytY8WRy.jpeg",
    "https://i.imgur.com/xg5pNBA.jpeg",
    "https://i.imgur.com/0ytmOt6.jpeg",
    "https://i.imgur.com/hWeXnwW.jpeg",
    "https://i.imgur.com/PwX2twJ.jpeg",
    "https://i.imgur.com/0H38iip.jpeg",
    "https://i.imgur.com/EJbm6kX.jpeg",
    "https://i.imgur.com/k3vdjum.jpeg", 
    "https://i.imgur.com/v6ACieJ.jpeg",
    "https://i.imgur.com/IJ7nnHY.jpeg",
    "https://i.imgur.com/6pEmhi1.jpeg",
    "https://i.imgur.com/OLRzKIR.jpeg",
    "https://i.imgur.com/O61P7jO.jpeg",
    "https://i.imgur.com/SqO1RG8.jpeg",
    "https://i.imgur.com/8xinn1V.jpeg",
    "https://i.imgur.com/wE57U9Z.jpeg",
    "https://i.imgur.com/gg0Z3vX.jpeg",
    "https://i.imgur.com/ITXUloG.jpeg",
    "https://i.imgur.com/FKy39x8.jpeg",
    "https://i.imgur.com/W93QOx6.jpeg",
    "https://i.imgur.com/qOTRYcE.jpeg",
    "https://i.imgur.com/XmnOKRm.jpeg",
    "https://i.imgur.com/YylZ368.jpeg",
    "https://i.imgur.com/6PjCeJM.jpeg",
    "https://i.imgur.com/FLHJdpQ.jpeg",
    "https://i.imgur.com/Aqhtn6C.jpeg",
    "https://i.imgur.com/01SnOaD.jpeg",
    "https://i.imgur.com/4BP9a2W.jpeg",
    "https://i.imgur.com/wTrIHBW.jpeg",
    "https://i.imgur.com/oXHAEy2.jpeg",
    "https://i.imgur.com/nQHP9DV.jpeg",
    "https://i.imgur.com/qAtAlZx.jpeg",
    "https://i.imgur.com/wtDQgNj.jpeg",
    "https://i.imgur.com/CyBtHDU.jpeg",
    "https://i.imgur.com/f2bhRs5.jpeg",
    "https://i.imgur.com/Ale8j6c.jpeg",
    "https://i.imgur.com/qHthugN.jpeg",
    "https://i.imgur.com/UVGBV5h.jpeg",
    "https://i.imgur.com/KKbQJW1.jpeg",
    "https://i.imgur.com/d9JMlFZ.jpeg",
    "https://i.imgur.com/Ol1uO7i.jpeg",
    "https://i.imgur.com/k6ePPUU.jpeg",
    "https://i.imgur.com/Sg1nl4X.jpeg",
    "https://i.imgur.com/CgxHBiH.jpeg",
    "https://i.imgur.com/JHE5ze8.jpeg",
    "https://i.imgur.com/UkvTPav.jpeg",
    "https://i.imgur.com/BSXYzTW.jpeg",
    "https://i.imgur.com/pjzLfkf.jpeg",
    "https://i.imgur.com/6INk75E.jpeg"
]

# Asegurarse de que haya suficientes links para cada escultura
if len(imgur_links) < len(esculturas_df):
    raise ValueError("No hay suficientes links para asignar a cada escultura.")

# Lista para almacenar los datos generados
urls = []
etapas = []
nombre_escultura = []

# Asignar un link único a cada escultura primero
for nombre in esculturas_df['nombre']:
    # Asignar un URL único a cada escultura
    url = imgur_links.pop(0)  # Sacar el primer link de la lista
    urls.append(url)
    etapas.append('Etapa ' + str(random.randint(1, 5)))  # Generar una etapa aleatoria
    nombre_escultura.append(nombre)

# Luego, anadir más enlaces, permitiendo repeticiones
for nombre in esculturas_df['nombre']:
    num_additional_links = random.randint(0, 2)  # Por ejemplo, entre 0 y 2 enlaces adicionales
    for _ in range(num_additional_links):
        url = random.choice(imgur_links)  # Elegir una URL aleatoria de los que quedan
        urls.append(url)
        etapas.append('Etapa ' + str(random.randint(1, 5)))  # Generar una etapa aleatoria
        nombre_escultura.append(nombre)

# Crear un DataFrame con los datos de la tabla Imagenes
df_imagenes = pd.DataFrame({
    'URL': urls,
    'etapa': etapas,
    'nombre_escultura': nombre_escultura
})

# Guardamos el DataFrame en un archivo CSV
df_imagenes.to_csv('imagenes.csv', index=False)

print("Archivo imagenes.csv creado exitosamente uwu")
