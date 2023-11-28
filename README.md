![Image](https://github.com/VictorPortilla/Churn-Rate-And-Clustering-At-Telco/blob/main/resources/Presentation.png?raw=true)

https://github.com/VictorPortilla/Churn-Rate-And-Clustering-At-Telco/assets/73489755/6b5b8745-f90a-4eae-80fb-762b9d4bdca0

[Video en YouTube](https://www.youtube.com/watch?v=0Ira65BFHSY)

## Miembros del equipo
    - Hector Miranda Garcia A01658845
    - Misael Chavez Ramos A01659759
    - Victor hugo Portilla Ortiz A01659198
    - German Wong del Toro A01655080

## Contexto del problema

Este reto consiste en utilizar información de los clientes para su debido tratamiento y creacion de un Modelo Predictivo de Churn con base en su historial de comportamiento dentro del servicio además de un extra.

## Propuesta de la solución del reto

### Herramientos utilizadas
Para el Notebook se utilizaron las siguientes herramientas:

    - Pandas
    - seaborn
    - NumPy
    - ADS
    - matplotlib
    - SciPy
    - sklearn
    - Oracle
    
Para la página web 

    - Supabase
    - NodeMailer
    - Flask
    - Oracle
    - Twilio
    - Llama2
    - Next.js
    - Oracle

Además de entrenar un modelo para la identificación de los usuarios que esten a punto de salirse, mostramos diversos datos con respecto a cada cluster para identificar multiples causas por las cuales estos esten abandonando y por medio de una plataforma web poder enviar marketing dirigido para evitar la perdida de clientes.

## Requerimientos para Desplegar Nuestra Solución

Nuestros requerimientos técnicos se dividen en cuatro áreas, ya que utilizamos diversos servicios y herramientas:

### Oracle Data Warehouse
Se requiere una instancia de Oracle Data Warehouse para cargar los datasets del proyecto. Posteriormente, las credenciales de conexión se deben descargar desde un archivo zip.

### Oracle Data Science
Utilizamos la herramienta Oracle Data Science para el análisis y procesamiento de datos. Esta herramienta consiste en un servicio de Jupyter Notebook con integraciones de entornos Conda y módulos propios de Oracle. La solución se ejecuta en una instancia con 20 GB de RAM, 3 CPUs y 50 GB de almacenamiento, lo cual es suficiente para la implementación. Se utiliza un entorno Conda propio de Oracle llamado AutoML v5. Más información [aquí](https://docs.oracle.com/es-ww/iaas/data-science/using/conda-automlx-fam.htm). También, se establece una conexión a la base de datos Oracle Data Warehouse mediante un archivo con las credenciales. Se deben instalar los módulos comentados al inicio del notebook; simplemente descomentelos para iniciar la instalación.

### Flask - Model Deployment
Para implementar los modelos, se utiliza una instancia de Ubuntu 22 con 1 GB de RAM y 1 CPU. Se crea un entorno con Python 3.9 y se requiere tener los pickles generados por el notebook. Además, se conecta a una instancia de LLaMa, por lo que se necesitan las credenciales de Google Cloud. Es necesario habilitar el tráfico de entrada y salida a los puertos necesarios desde Oracle Cloud. Si se ejecuta desde una instancia de Oracle, se debe configurar el certificado SSL para hacer solicitudes desde servicios de despliegue de aplicaciones como "Vercel".

### LLaMa - Vertex AI
Se debe crear una instancia de LLaMa utilizando los servicios de Google Cloud, específicamente "Vertex AI". Se deben generar las credenciales necesarias para acceder a Google Cloud y configurarla para realizar solicitudes a esta instancia.

### NextJs - Frontend
Para el frontend, es necesario instalar los paquetes registrados durante el desarrollo y utilizar NextJS 13.5. También se requiere el archivo de entorno que contiene credenciales de acceso a servicios como la base de datos Supabase, Twilio y NodeMailer, entre otros.

### Supabase - Base de Datos
Se crea un proyecto de base de datos en la página oficial de Supabase para implementar los servicios de autenticación de usuarios y funcionalidades adicionales, como el registro de contribuciones y nombramientos de clusters.

### Credenciales
Por motivos de seguridad, las credenciales necesarias para ejecutar el proyecto están almacenadas en un espacio distinto. Se requiere iniciar sesión con una cuenta del Tec para acceder a dichas credenciales. Cada conjunto de credenciales debe ser descargado y aplicado en sus respectivas áreas, ya sea en el backend, frontend o el notebook. Aquí está el enlace: [Credenciales](https://drive.google.com/drive/folders/1nQ783o7gSLVzFEbj22j6N-TOQDiojkaz?usp=sharing)

## Plataforma web
Si desea registrarse y probar la plataforma en línea, puede registrarse usando [este enlace](https://data-telco-masking-web.vercel.app/) con este código de grupo: 
No usar cuentas del Tec de Monterrey
Preferentemente usar un navegador con Chromium
