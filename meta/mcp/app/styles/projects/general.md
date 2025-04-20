# Framework MCP-CODE

## Estructura Fundamental

El proyecto se divide en dos directorios principales:

```
proyecto/
├── code/       # Implementación del problema en el lenguaje apropiado
└── mcp/        # Tooling, configuración y gestión del proyecto
```

### Directorio `code/`

Contiene la implementación concreta del problema, organizada según el paradigma y tecnologías más adecuadas:

- Para ML/AI: Estructura basada en Python (módulos, clases, pipelines)
- Para desarrollo web: React/NextJS o similar
- Para backend: FastAPI, Django, Express, etc.

Elementos críticos dentro de `code/`:

- `context/`: Árboles de directorio y metadatos del proyecto
  - Habrán árboles con directorios de `code/` únicamente
  - Árbol ASCII para visión rápida (`arbol_*.txt`)
  - Árboles detallados en JSON para análisis profundo (`project_tree_*.json`)

- `tracking/`: Seguimiento del progreso de features y estado global
  - `features/`: Archivos YAML detallando cada funcionalidad
  - `database.md`: Esquema de base de datos (debe sincronizarse vía MCP)
  - `status.yaml`: Progreso global del proyecto e indicadores

- `tests/`: **Todos** los tests deben residir aquí, organizados por componente/feature
  - Facilita la ejecución automatizada y reportes de cobertura
  - Asegura que cualquier desarrollador sepa dónde buscar/añadir tests

- `README.md`: Documentación detallada del proyecto
  - Instrucciones precisas de ejecución (desde qué directorio, comandos)
  - Configuración necesaria para desarrollo/producción
  - Descripción de componentes principales y su interacción

Así mismo según se defina el proyecto habrán sub-directorios adicionales como `code/src/`, `code/app/`, etc.

### Directorio `mcp/`

Centro de operaciones para la gestión del proyecto:

- `context/`: Árboles de directorio y metadatos del proyecto
  - Habrán árboles con directorios de `mcp/` únicamente
  - Árbol ASCII para visión rápida (`arbol_*.txt`)
  - Árboles detallados en JSON para análisis profundo (`project_tree_*.json`)

- `tools/`: Herramientas personalizadas para el proyecto
  - Scripts de automatización
  - Herramientas de análisis
  - Configuración específica

- `issues/`: Registro de problemas encontrados durante el desarrollo
  - Documentación clara: entrada/salida esperada/real
  - Análisis de la causa raíz
  - Recomendaciones para evitar recurrencia

Acá todo código de implementación concreto será en TypeScript.

## Flujo de Trabajo

### Inicio del Proyecto

1. Ejecución de `mcd` con parámetros de configuración inicial
   - Revisa el árbol detallado de `code/context/` si hay, si no hace un escaneo del directorio `code/` para actualizar el árbol ascii *(el detallado surge de comprender el objetivo del proyecto y poder crear estos nodos significativos)*
   - Procede a revisar si hay features definidas en `code/tracking/features/`
   - Si el usuario no ha definido features, le pregunta si desea crear una nueva

   - Define arquitectura base del proyecto
   - Establece convenciones de código y estructura
   - Complementa con el estilo predefinido desarrollo del LLM (Experto | Senior | Arquitecto)

2. Implementación de arquitectura base siguiendo principios sólidos
   - Clean Architecture / Screaming Architecture
   - Estructura modular y testable
   - Documentación clara de decisiones arquitectónicas

El desarrollo debe buscar siempre ser incremental, lograr algo muy pequeño y funcional, probarlo y seguir creciendo.
El lenguaje de desarrollo claro es lo que ya se haya pre-definido pero fundamentalmente es según el objetivo, sean modelos e ia Python, para web/frontend React/NextJS etc.

### Ciclo de Desarrollo

1. **Definición de Features**
   - Creación de archivos YAML en `code/tracking/features/`
   - Desglose en tareas específicas con estados (pendiente, progreso, completado). Una tarea no se cancela, cambia de ser necesario.
   - Asignación de pruebas unitarias e integración
   - Las rutas son ubicaciones relativas de los archivos a mutar en el proceso de forma que se tenga su enlace rápido.

2. **Implementación**
   - Desarrollo siguiendo la estructura definida
   - Creación de tests en `code/tests/` (si aplica, según lenguaje)
   - Actualización del árbol del proyecto periódicamente

3. **Pruebas**
   - Ejecución de tests para verificar funcionalidad
   - Notificación cuando todos los tests de una feature pasan
   - Documentación de problemas en `mcp/issues/` cuando sea necesario

4. **Actualización de Tracking**
   - Actualización del progreso en archivos YAML
   - Sincronización del esquema de base de datos si aplica
   - Actualización del status global del proyecto

## Recomendaciones de Mejora

### Automatización Adicional

1. **Script de Verificación**
   - Herramienta que compruebe automáticamente que los tests están en el directorio correcto
   - Validación de estructura de archivos YAML de features

2. **Workflow de Integración**
   - Hook pre-commit que actualice automáticamente los árboles
   - Validación de que los cambios respetan la arquitectura definida

3. **Dashboard de Progreso**
   - Visualización gráfica del progreso basada en `status.yaml`
   - Integración con herramientas de CI/CD

### Extensiones MCP

1. **mcp-sync-db**
   - Sincronización bidireccional entre código y esquema DB
   - Generación automática de migraciones

2. **mcp-test-coverage**
   - Análisis de cobertura de tests por feature
   - Recomendaciones para áreas con baja cobertura

3. **mcp-doc-generator**
   - Generación automática de documentación a partir del código
   - Actualización del README con cambios significativos

## Conclusión

Este marco de trabajo proporciona:

1. **Estructura clara y consistente** para cualquier tipo de proyecto
2. **Trazabilidad** de features y progreso
3. **Organización eficiente** de código, tests y documentación
4. **Automatización** de tareas repetitivas
5. **Gestión efectiva** de problemas y soluciones

La separación entre `code/` y `mcp/` permite una clara distinción entre la implementación del problema y la infraestructura de gestión, facilitando el desarrollo colaborativo y la evolución del proyecto a lo largo del tiempo. Así mismo es importante que revises el directorio en el que estás trabajando ya que es usual que al no mirarlo creas estás haciendo algo en `mcp/` y lo estás haciendo en `code/` o viceversa.

## Proyecto de Desarrollo General

Este proyecto sigue principios universales de ingeniería de software, aplicables a cualquier tipo de desarrollo, con énfasis en calidad, mantenibilidad y escalabilidad.

### Estructura y Organización

La estructura del proyecto seguirá principios de modularidad y separación de responsabilidades:

- **Core**: Componentes centrales y modelos de dominio
- **Features**: Funcionalidades organizadas por dominio de negocio
- **Infrastructure**: Servicios externos, bases de datos, comunicación
- **UI/API**: Interfaz con usuarios o sistemas externos
- **Tests**: Pruebas completas a todos los niveles

### Principios de Desarrollo

1. **SOLID**: Principios sólidos de diseño orientado a objetos
2. **DRY**: No repetir código innecesariamente
3. **KISS**: Mantener soluciones simples y directas
4. **TDD**: Desarrollo guiado por pruebas cuando sea posible
5. **CI/CD**: Integración y despliegue continuos

### Enfoque Técnico

- Arquitectura basada en capas bien definidas
- Interfaces claras entre componentes
- Manejo explícito de errores y excepciones
- Gestión eficiente de dependencias
- Documentación estratégica y significativa

### Proceso de Desarrollo

- Desarrollo incremental y evolutivo
- Revisión regular de código
- Mejora continua y refactorización
- Priorización de calidad y mantenibilidad
- Entrega regular de incrementos funcionales

El desarrollo seguirá un enfoque pragmático, equilibrando las mejores prácticas con las necesidades específicas del proyecto, adaptando las soluciones técnicas al contexto particular y evitando tanto la sobre-ingeniería como las soluciones ad-hoc.