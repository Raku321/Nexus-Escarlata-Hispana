# Poke Azul para Nexus

Añade a Nexus tres cosas de Poke Azul:

- **Modo simple** (sustituye al de Nexus): una tarjeta por cuenta con el líder, su barra de nivel y tiempo hasta subir, los **IV del líder sobre 32** (con margen hasta el nivel 30, exactos desde ahí), XP/h, oro/h, derrotas/h, capturas y últimas capturas.
- **Calculadora de IV** (sustituye a la de Nexus en el botón 🧮): ficha con nivel, calidad, IV total, poder, IV por stat editable y golpes. Calcula también pokémon de jugador en gimnasio (bonus ×1,30).
- **Tarjetas de las cuentas** (sustituyen a las del menú lateral "Entrenadores"): líder con su imagen y tipos, barra de nivel con tiempo hasta subir, barra del entrenador, hunt actual, mejor hunt para el líder (con el modelo de la Tierlist de Nexus), XP/h, oro/h, kills/h, capturas, shinies y mejor IV de la sesión.
- **Cerrar los anuncios solos** (Configuración → Apariencia y juego): cierra las ventanas de publicidad del juego, como el "Passe de Batalha".
- **Memoria** (Configuración → Gráficos y rendimiento): limpiar memoria cada 10 min sin recargar, recargar una cuenta si se pasa del límite de MB y recarga programada cada N horas (como mucho una recarga cada 10 min y 3 por hora y cuenta; si sigue pasándose, se pausa y avisa).
- **🏆 Gimnasios** (nuevo, debajo de la calculadora): gimnasios tomados por jugadores con calidad e IV de su equipo, **conquistas de las 15:00** (guarda quién tenía cada gimnasio justo antes del reparto, hoy y el día anterior) y **simulador de combate** contra cualquiera de ellos.

Todo es **solo lectura**: lee lo que el colector de Nexus ya guarda en cada panel (`window.__poke`) y pide por GET las mismas listas que usa el juego (`/game/creatures.json`, `/api/game/gyms`). No envía nada al juego.

## Archivos
- `src/poke-azul/pa-lib.js` — motor (cálculo de calidad/IV, lectura de gimnasios, simulador, hora de España).
- `src/poke-azul/pa.js` — interfaz (modo simple, calculadora, gimnasios).
- `main.js` y `preload.js` — dos funciones nuevas para la memoria (`pa:mem` lee cuánta memoria usa cada cuenta, `pa:trim` la libera sin recargar).
- `index.html` — 3 cambios: `refreshCards` llama al modo simple nuevo (el antiguo queda como `refreshCardsNexus`), `refreshAccounts` del menú lateral pinta las tarjetas nuevas, y se cargan los dos scripts al final.

Las conquistas se guardan en `localStorage` (`pa-conquistas`). Para que se guarden, Nexus tiene que estar abierto entre las 14:55 y las 15:00 (hora de España) con al menos una cuenta dentro del juego.

Recuerda subir el número de versión en `package.json` si quieres que las instalaciones existentes detecten la actualización.
