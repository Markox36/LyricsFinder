# LyricsFinder

**LyricsFinder** es un paquete de npm para buscar letras de canciones con soporte para rotación de direcciones IPv6.

## Instalación

Puedes instalar **LyricsFinder** a través de npm utilizando el siguiente comando:

```bash
npm install lyricsfinder
```

## Uso

Para utilizar **LyricsFinder**, primero debes importarlo y luego crear una instancia de `LyricsFinder`. A continuación, puedes usar el método `findLyrics` para buscar letras de canciones. Aquí tienes un ejemplo básico:

### Ejemplo sin ipv6 block

```typescript
import { LyricsFinder } from 'lyricsfinder';

// Crea una instancia de LyricsFinder con una lista de bloqueo de IPv6 vacía.
const lyricsFinder = new LyricsFinder({ ipv6_blocklist: [] });

// Busca letras para la canción especificada.
lyricsFinder
  .findLyrics(\"Despacito - Luis Fonsi\")
  .then(console.log)
  .catch((err: unknown) => console.log(err));
```

## Métodos

### `findLyrics(query: string): Promise<string>`

- **query**: La consulta de búsqueda que especifica la canción y el artista.
- **Returns**: Una promesa que se resuelve con la letra de la canción en formato de cadena.

## Configuración

Puedes configurar el comportamiento del `LyricsFinder` pasando opciones al constructor. Actualmente, puedes especificar una lista de bloqueo de direcciones IPv6:

```typescript
const lyricsFinder = new LyricsFinder({ ipv6_blocklist: ["::1"] });
```

## Contribución

Si quieres contribuir a **LyricsFinder**, por favor, sigue estos pasos:

1. Realiza un fork del repositorio.
2. Crea una rama para tus cambios (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commits (`git commit -am 'Añadir nueva funcionalidad'`).
4. Envía tus cambios a tu repositorio (`git push origin feature/nueva-funcionalidad`).
5. Crea una solicitud de extracción en GitHub.

## Licencia

Este proyecto está licenciado bajo la Licencia ISC - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para más información, puedes contactar al autor en [hello@markox.dev](mailto:tu-email@example.com) o visitar el [repositorio de GitHub](https://github.com/Markox36/LyricsFinder).

---

¡Gracias por usar **LyricsFinder**! Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un problema en el repositorio de GitHub.
