# Health Live

Monorepo inicial para la aplicación móvil **Health Live**, enfocada en el monitoreo de la salud personal.

## Framework seleccionado

Se utiliza **React Native** como framework principal. El esqueleto del proyecto fue creado manualmente replicando la estructura generada por `npx react-native init HealthLiveApp`, debido a las restricciones de red del entorno de trabajo. En un entorno con acceso completo bastará ejecutar el comando para regenerar los artefactos nativos.

```bash
npx react-native init HealthLiveApp
```

## Estructura del repositorio

```
Health_live/
├── .gitignore
├── README.md
└── HealthLiveApp/
    ├── App.tsx
    ├── app.json
    ├── babel.config.js
    ├── index.js
    ├── metro.config.js
    ├── package.json
    ├── tsconfig.json
    ├── android/
    ├── ios/
    └── src/
        ├── modules/
        │   ├── monitoring/
        │   ├── reminders/
        │   └── profile/
        └── navigation/
```

Cada módulo cuenta con sus propios componentes y puntos de entrada (`index.ts`) para facilitar la reutilización y el escalado.

## Dependencias principales

Las dependencias y herramientas incluidas en `HealthLiveApp/package.json` son:

- **react-native 0.74.3** y **react 18.2.0** para el desarrollo multiplataforma.
- **TypeScript 5** para tipado estático en los módulos.
- **ESLint**, **Prettier** y `@react-native/eslint-config` para mantener un estilo de código consistente.
- Tipados específicos para React y React Native (`@types/react`, `@types/react-native`).

> Nota: no se ejecutó `npm install` en este entorno por falta de acceso al registro de npm. Antes de iniciar el desarrollo en una máquina local será necesario instalar las dependencias con `npm install` o `yarn install`.

## Scripts de desarrollo

Desde el directorio `HealthLiveApp` se encuentran disponibles los siguientes scripts:

- `npm run start`: inicia el bundler de Metro.
- `npm run android`: compila y lanza la aplicación en un emulador o dispositivo Android.
- `npm run ios`: compila y lanza la aplicación en un simulador iOS.
- `npm run lint`: ejecuta ESLint sobre el proyecto.

## Próximos pasos sugeridos

1. Ejecutar `npm install` dentro de `HealthLiveApp`.
2. Generar los proyectos nativos completos con `npx react-native init HealthLiveApp` o sincronizar los artefactos mediante `npx react-native upgrade`.
3. Configurar integraciones con dispositivos o servicios de salud para alimentar el módulo de monitoreo.
4. Definir casos de uso para los recordatorios y personalización del perfil del usuario.
