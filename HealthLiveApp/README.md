# HealthLiveApp

Plantilla base de la aplicación móvil Health Live desarrollada con React Native.

## Módulos disponibles

- `monitoring`: componentes para visualizar métricas y tendencias de salud.
- `reminders`: listado de recordatorios y rutinas del usuario.
- `profile`: resumen del perfil e información contextual del paciente.

Cada módulo expone sus componentes principales mediante un archivo `index.ts` para facilitar su importación desde otras capas.

## Scripts

Ejecutar los scripts desde este directorio:

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run lint`

## Preparación del entorno

1. Instalar dependencias con `npm install` o `yarn install`.
2. Instalar pods (solo iOS): `npx pod-install`.
3. Ejecutar el bundler con `npm run start` y luego correr la app en el simulador o dispositivo deseado.
