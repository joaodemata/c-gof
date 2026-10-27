# c-gof

Core del **Juego de la Vida de Conway**. Es un servidor de [Socket.IO](https://socket.io/) que recibe una grilla inicial, calcula cada generación en MongoDB con una agregación y envía el resultado al cliente en tiempo real hasta que no quedan células vivas.

## Requisitos

- Node.js 18 o superior
- MongoDB 5.0 o superior (la agregación usa `$lookup` con `localField`/`foreignField` y `pipeline` a la vez)

## Instalación

```bash
npm install
cp .env.example .env   # y ajustar los valores
```

### Variables de entorno

| Variable            | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| `JM_NODE_ENV`       | Ambiente (solo se muestra en el log)           |
| `JM_CGOF_CORE_NAME` | Nombre del Core, se guarda en cada documento   |
| `JM_CGOF_PORT`      | Puerto del servidor                            |
| `JM_CGOF_MDB_HOST`  | Host de MongoDB                                |
| `JM_CGOF_MDB_PORT`  | Puerto de MongoDB                              |
| `JM_CGOF_MDB_NAME`  | Base de datos                                  |

`c-gof.js` copia las variables `JM_CGOF_*` a sus equivalentes genéricas `JM_*` antes de cargar la aplicación. Las variables de usuario, contraseña, réplica y pool se mapean, pero la conexión actual todavía no las usa.

## Uso

```bash
npm run dev     # desarrollo con nodemon
npm start       # producción con pm2
```

El servidor acepta conexiones desde `http://localhost:3000` (CORS configurado en `app/index.js`).

## Protocolo de Socket.IO

| Dirección         | Evento       | Payload                                  |
| ----------------- | ------------ | ---------------------------------------- |
| Cliente → Server  | `start_game` | `[{ x, y, isAlive }]` grilla inicial     |
| Server → Cliente  | `change`     | `{ data: [{ x, y, isAlive }] }` por cada generación |
| Server → Cliente  | `finish`     | `{ iterations }` cuando mueren todas las células |

La grilla es de tamaño fijo: solo existen las células enviadas en `start_game`, y lo que está fuera de ella se considera muerto. Cada partida se identifica por el `id` del socket. La simulación se detiene si el cliente se desconecta.

Ejemplo de cliente:

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

socket.emit('start_game', [
  { x: 0, y: 1, isAlive: true },
  { x: 1, y: 1, isAlive: true },
  { x: 2, y: 1, isAlive: true },
  // ... resto de la grilla con isAlive: false
]);

socket.on('change', ({ data }) => render(data));
socket.on('finish', ({ iterations }) => console.log(`Fin tras ${iterations} generaciones`));
```

## Cómo funciona

1. **`start_game`**: cada punto se guarda en la colección `conway_games` con su clave `x_y` (`"x,y"`) y la lista de sus 8 vecinas (`around_points`).
2. **Siguiente generación** (`nextGenerationService`): una agregación cruza cada célula con sus vecinas, cuenta las vivas y aplica las reglas:
   - una célula viva con 2 o 3 vecinas vivas sobrevive (`maintainsAlive`)
   - una célula muerta con exactamente 3 vecinas vivas nace (`comesAlive`)
   - cualquier otra célula muere o sigue muerta
3. **Persistencia** (`saveGenerationService`): se actualiza `is_alive` en la base de datos y se emite `change`.
4. El ciclo se repite hasta que no quedan células vivas, y entonces se emite `finish`.

## Estructura

```
c-gof.js                        Punto de entrada: carga .env, conecta MongoDB y levanta el servidor
app/
  index.js                      Servidor HTTP + Socket.IO
  events/gof.event.js           Eventos del socket y bucle del juego
  services/operation.service.js Acceso a datos y cálculo de generaciones
  models/conway_game.model.js   Esquema de Mongoose de una célula
common/configs/                 Configuración (conexión a MongoDB)
```

## Limitaciones conocidas

- Un patrón que nunca muere (p. ej. un *blinker*) mantiene el bucle activo hasta que el cliente se desconecta.
- Los documentos de una partida no se eliminan al terminar.
