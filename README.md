# Parcial 2 Aplicaciones Móviles

## Opcion elegida
Gestor de tareas

## Como ejecutar la app

```bash
npm install
npx expo start
```

## Como ejecutar los tests

```bash
npm test
```

## Funcionalidades

- Registro de usuario con AsyncStorage

- Login con validacion local

- Pantalla principal con lista de tareas

- Agregar nuevas tareas

- Marcar tareas como completadas

- Eliminar tareas con confirmacion

- Persistencia de datos al cerrar la app

- Notificacion local al guardar una tarea

- Cierre de sesion

## Funcionalidades agregadas parcial 2

- Se pudo corregir y agregar notificaciones con expo-notifications

- Se agregaron varios campos nuevos opcionales (Imagen asociada a la tarea, Ubicación, Contacto, Día asociado con recordatorio)

- Todos estos campos hacen uso de las librerías de expo y cada funcionalidad pide los permisos correspondientes

- Se migro el manejo de datos a zustand

- Se genero 3 archivos de test mediante Opencode y se editó el readme desde opencode describiendo los casos de pruebas + prompt utilizado

## Testing

Se implementaron tests automatizados con Jest para validar el funcionamiento correcto de los componentes y la lógica de negocio.

### Tests implementados

| Test Suite | Descripcion |
|------------|-------------|
| `validacion.test.js` | Validacion de titulo vacio y formato de fecha YYYY-MM-DD |
| `useTaskStore.test.js` | Store Zustand: addTask, deleteTask, toggleTask |
| `TaskItem.test.js` | Estilos del componente TaskItem y logica de validacion |

### Prompt utilizado para generar los tests

Se utilizó Jest junto con React Native Testing Library para implementar tests automatizados que incluyen:

- Tests de componentes reutilizables, verificando renderizado correcto e interacciones
- Tests de lógica de negocio, incluyendo validación de formularios y formateo de datos
- Tests del store global (Zustand), confirmando que las acciones actualizan correctamente el estado

Todos los tests pueden ejecutarse con un único comando: `npm test`

## Video demo

[Ver demo en YouTube](https://www.youtube.com/shorts/zYvzQOG3s9U)
