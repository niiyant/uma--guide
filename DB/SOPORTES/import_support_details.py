import os
import requests
import json
import time

# Ruta al JSON principal de supports
data_path = os.path.join("DB", "SOPORTES", "supports.json")
with open(data_path, encoding="utf-8") as f:
    data = json.load(f)

# Extraer la lista de supports
supports = data.get('pageProps', {}).get('supportData', [])

# Carpeta destino para los detalles
output_dir = os.path.join("DB", "SOPORTES", "details")
os.makedirs(output_dir, exist_ok=True)

# URL base para los detalles
url_base = "https://gametora.com/_next/data/DhIa8-MT3feKqLdpP5l3i/umamusume/supports/{}.json?id={}"

for support in supports:
    url_name = support.get('url_name')
    if not url_name:
        continue
    url = url_base.format(url_name, url_name)
    out_path = os.path.join(output_dir, f"{url_name}.json")
    if os.path.exists(out_path):
        print(f"Ya existe: {out_path}")
        continue
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(resp.text)
            print(f"Descargado: {out_path}")
        else:
            print(f"No encontrado: {url}")
    except Exception as e:
        print(f"Error con {url}: {e}")
    time.sleep(0.5)  # Espera para no saturar el servidor

print("Descarga de detalles finalizada.")
