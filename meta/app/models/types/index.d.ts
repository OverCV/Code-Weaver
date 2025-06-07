// Tipos para elementos detallados
export type DetailedElement = {
    t: 'fn' | 'cls' | 'var'  // tipo: función, clase, variable
    n: string                // nombre
    d?: string               // descripción
    i?: string[]             // inputs (parámetros)
    o?: string               // output (retorno)
}

// Tipos para los nodos del árbol detallado
export type DetailedNode = {
    n: string                 // nombre
    t: 'dir' | 'file'         // tipo
    d?: string                // descripción
    e?: DetailedElement[]     // elementos (funciones, clases, etc)
    c?: DetailedNode[]        // contenido (hijos)
}

// Tipo para los cambios registrados
export type ChangeLog = {
    fecha: string
    archivo?: string
    tipo: 'add' | 'mod' | 'del' | 'sys'
    desc: string
    accion?: string
}

// Tipo para tareas en funcionalidades
export type Task = {
    id: string
    desc: string
    estado: 'pendiente' | 'desarrollo' | 'completada' | 'bloqueado'
    rutas?: string[]
}

// Tipo para estado de pruebas
export type TestStatus = {
    unitarias: string     // formato: "completadas/total"
    integracion?: string  // formato: "completadas/total"
}

// Tipo para funcionalidades
export type Feature = {
    id: string
    nombre: string
    descripcion: string
    progreso: number      // 0-100
    fecha_inicio: string // formato: YYYY-MM-DD
    fecha_fin?: string   // formato: YYYY-MM-DD
    tareas?: Task[]
    pruebas?: TestStatus
}

// Tipo para configuración de GitHub
export type GitHubConfig = {
    token: string         // Personal Access Token
    owner: string         // Propietario del repositorio
    repo: string          // Nombre del repositorio
    branch: string        // Rama principal
}