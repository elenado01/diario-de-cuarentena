# Diario de cuarentena 👑🦠

Una recreación visual del chat **Diario de cuarentena**, presentado como una conversación de WhatsApp a partir del export original.

## Ver la página

**[Abrir Diario de cuarentena](https://elenado01.github.io/diario-de-cuarentena/)**

La página incluye:

- Mensajes agrupados por fecha, con autor y hora.
- Fondo y burbujas inspirados en WhatsApp.
- Buscador dentro del diario.
- Favicon con el emoji 🦠.

## Publicación

El proyecto se publica automáticamente en GitHub Pages mediante [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) cada vez que se hace `push` a la rama `main`.

## Estructura

```text
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── data/
│   └── Chat de WhatsApp con Diario de cuarentena 👑🦠.txt
└── .github/workflows/
	└── deploy-pages.yml
```