Para compilar el proyecto en telefono android se debe de tener instalado los siguientes aspectos:

# Android Studio
1. Descargar Android Studio
2. Abrir Android Studio, despues dirigete a File -> Settings -> Languages & Frameworks -> Android SDK
3. Debe de descargar en SDK Tools las siguientes herramientas:
    - Android SDK Platform
    - Android SDK Build-Tools
    - Android Emulator
    - Android SDK Command-line Tools


# Node.js
1. Descargar Node.js desde el siguiente enlace: https://nodejs.org/es/download/
2. Instalar Node.js
3. Comprobar con el comando `node -v` que Node.js este instalado correctamente, en caso de que no funcione el comando debe de introducir el path de instalacion en el PATH de la variable de entorno.

# Gradle
1. Descargar el siguiente archivo de gradle https://services.gradle.org/distributions/gradle-8.10.2-all.zip, este archivo lo usaremos mas adelante para compilar el proyecto.

# JDK 17
1. Descargar JDK 17 o mayor


# Ejecucion del proyecto
Para ejecutar el proyecto primero debemos de instalar las dependencias de npm, desde la raiz del proyecto ejecutamos el siguiente comando:

`npm install`

Despues de instalar las dependencias de npm, debemos de crear el archivo "local.properties" en la carpeta "android" con el siguiente contenido: 

`skd.dir=<La direccion de donde esta instalado el SDK de android>`

Esta direccion si se sigue una instalacion por defecto debe de ser `C:\Users\<Nombre de usuario>\AppData\Local\Android\Sdk`, por ejemplo 
`C:\Users\Pc\AppData\Local\Android\Sdk`

Luego debemos de movernos a la terminal y ejecutar el siguiente comando:

`cd android`
`./gradlew clean build`

Este comando fallara por razones desconocidas, pero nos creara en la carpeta `C:\Users\<Nombre de usuario>\.gradle\wrapper\dists` una carpeta llamada `gradle-8.10.2-all`, dentro de esta carpeta existe otra carpeta la cual debe ser un hash, dentro de esta carpeta debemos de poner el archivo gradle que se habia descargado con anterioridad.

Finalmente debemos de ejecutar de nuevo el comando:
`./gradlew clean build`

Si todo funciona correctamente no deberia de aparecer ningun error en la terminal, si aparece alguno debe de informar inmediatamente para averiguar cual es el problema.

En caso de que no aparezca ningun error, entonces ya se puede ejecutar correctamente el proyecto, para ello se debe de activar la depuracion del telefono android y conectar un cable usb de la computadora al telefono.

El ultimo paso es ejecutar el comando `npm run android` desde la raiz del proyecto, este comando se encargara de compilar el proyecto y ejecutarlo en el telefono.