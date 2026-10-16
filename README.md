# Nexus v1.1.1 — Escarlata Hispana

Cliente de escritorio multicuenta para Poke Idle World.

## Novedades

- Gimnasios organizados en subpestañas por tipo (Roca, Hada, etc.).
- Simulador de Gimnasios con equipos de distintas cuentas, bayas y orden aleatorio.
- Información de Held Items cuando el juego proporciona los datos.
- Se conservan las herramientas y ajustes de Nexus v1.1.0.

## Instalación local (Windows)

Ejecutar `INSTALAR NEXUS.bat` con Node.js LTS instalado. Genera `dist/Instalador-Nexus-1.1.1.exe` y lo abre al terminar. No subir `dist/` ni `node_modules/` al repositorio.

## Publicación

Subir el contenido de esta carpeta a la rama `main`, confirmar que `package.json` declara `1.1.1` y crear la etiqueta `v1.1.1` **sobre ese commit**. El workflow de GitHub Actions compilará el instalador. Verificar que el Release incluya `Instalador-Nexus-1.1.1.exe` antes de anunciarlo.

El instalador Electron contiene recursos JavaScript extraíbles; un repositorio privado por sí solo no protege todo el código distribuido.
