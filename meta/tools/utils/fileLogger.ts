import fs from 'fs-extra'
import path from 'path'
import { ChangeLog } from '../../app/models/types/index.js'

// Ruta al archivo de log
let LOG_FILE = path.resolve(process.cwd(), '..', 'logs', 'debug.log')

// Ruta al archivo de log
const LOG_FILE_LOGS = path.resolve(process.cwd(), '..', 'logs', 'changes_log.jsonl')

/**
 * Registra un cambio en el archivo de log
 */
export async function logChange(change: ChangeLog): Promise<void> {
    try {
        // Asegurar que el archivo existe
        await fs.ensureFile(LOG_FILE_LOGS)

        // Validar que los tipos sean correctos
        if (change.tipo !== 'add' && change.tipo !== 'mod' && change.tipo !== 'del' && change.tipo !== 'sys') {
            change.tipo = 'sys' // Valor por defecto seguro
        }

        // Convertir el cambio a JSON y añadirlo al archivo
        const logEntry = JSON.stringify(change) + '\n'
        await fs.appendFile(LOG_FILE_LOGS, logEntry)

        // Registrar en nuestro file logger
        info(`Log: ${change.tipo} - ${change.desc}`)
    } catch (error: any) {
        debug(`Error al registrar cambio: ${error.message}`)
    }
}

/**
 * Lee los últimos N cambios del log
 */
export async function getRecentChanges(count: number = 10): Promise<ChangeLog[]> {
    try {
        if (!await fs.pathExists(LOG_FILE_LOGS)) {
            return []
        }

        const content = await fs.readFile(LOG_FILE_LOGS, 'utf-8')
        const lines = content.trim().split('\n')

        // Tomar las últimas 'count' líneas
        const lastLines = lines.slice(-count)

        // Convertir cada línea a objeto
        return lastLines.map(line => JSON.parse(line))
    } catch (error: any) {
        debug(`Error leyendo log de cambios: ${error.message}`)
        return []
    }
}

// Inicializar el logger
export function initLogger(logDir: string) {
    LOG_FILE = path.resolve(logDir, 'debug.log')
    fs.ensureDirSync(path.dirname(LOG_FILE))

    // Escribir mensaje inicial
    fs.appendFileSync(LOG_FILE, `\n[${new Date().toISOString()}] === MCP INICIADO ===\n`)
}

// Función para log de debug
export function debug(message: string) {
    try {
        const logEntry = `[${new Date().toISOString()}] [DEBUG] ${message}\n`
        fs.appendFileSync(LOG_FILE, logEntry)
    } catch (error) {
        // No podemos usar console.log aquí
    }
}

// Función para log de info
export function info(message: string) {
    try {
        const logEntry = `[${new Date().toISOString()}] [INFO] ${message}\n`
        fs.appendFileSync(LOG_FILE, logEntry)
    } catch (error) {
        // No podemos usar console.log aquí
    }
}

// Función para log de error
export function error(message: string, err?: any) {
    try {
        let logEntry = `[${new Date().toISOString()}] [ERROR] ${message}\n`
        if (err) {
            logEntry += `${err.stack || err.message || JSON.stringify(err)}\n`
        }
        fs.appendFileSync(LOG_FILE, logEntry)
    } catch (error) {
        // No podemos usar console.log aquí
    }
}
