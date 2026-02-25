BG Marketplace (HTML + CSS + JS)

Incluye:
- Página responsive (index.html)
- Filtros por categoría + buscador
- Carrito persistente (localStorage)
- Botón para finalizar pedido por WhatsApp

Cómo editar productos:
1) Abre /js/app.js
2) Busca "const PRODUCTS = [...]"
3) Cambia:
   - name (nombre)
   - category (Aretes, Collares, etc.)
   - price (número en COP)
   - status: "available" o "soldout"
   - img: ruta a la imagen

Cómo cambiar imágenes:
- Reemplaza archivos dentro de /assets/imagenes
- Mantén el mismo nombre o actualiza la ruta en PRODUCTS.

IMPORTANTE sobre Canva:
- Canva NO permite “subir” una carpeta HTML y publicarla como web directamente.
- Lo recomendado es:
  A) Publicar este sitio (gratis) en Netlify o GitHub Pages
  B) En Canva, insertar el link (Embed) o usarlo como enlace/botón.

Netlify (rápido):
1) Entra a Netlify -> Add new site -> Deploy manually
2) Arrastra y suelta el ZIP completo
3) Te da un link público.

GitHub Pages:
1) Crea un repo
2) Sube el contenido
3) Settings -> Pages -> Deploy from branch
