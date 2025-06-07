// mcp\app\shared\files.mcp.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import path from "path"
import { paths } from "../../app/config/paths.js"
import fs from "fs-extra"
import { readFile, writeFile, modifyFile } from "./read.item.js"
import { debug, logChange } from "../utils/fileLogger.js"

/**
 * Registra la herramienta de escaneo de proyecto en el servidor MCP
 */
export function registerFileMcp(server: McpServer) {
    // Herramienta para leer archivos
    // También necesitamos actualizar leer-archivo para manejar el mismo prefijo

    server.tool(
        'archivo-leer',
        "Lee el contenido de un archivo. Lee un archivo del proyecto",
        {
            ruta: z.string().describe("Ruta relativa al archivo desde la raíz del proyecto")
        },
        async ({ ruta }) => {
            try {
                let filePath = path.join(paths.PROJECT_BASE, ruta)

                const content = await readFile(filePath)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Contenido de ${ruta}:\n\n${content}`
                        }
                    ]
                }
            } catch (err: any) {
                debug(`Error en leer-archivo: ${err.message}`)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error al leer archivo: ${err.message}`
                        }
                    ]
                }
            }
        }
    )

    // Herramienta para escribir archivos
    server.tool(
        'archivo-crear',
        "Crea un archivo condicionado por los tokens de respuesta. Escribe contenido en un archivo",
        {
            ruta: z.string().describe("Ruta relativa del proyecto raíz al archivo"),
            desc: z.string().describe("Breve descripción del cambio alterar luego la feature o tarea asociada"),
            cont: z.string().describe("Contenido a escribir en el archivo"),
        },
        async ({ ruta, desc, cont }) => {
            try {
                const filePath = path.join(paths.PROJECT_BASE, ruta)

                await writeFile(filePath, cont)
                await logChange({
                    fecha: new Date().toISOString(),
                    archivo: filePath,
                    tipo: "add",
                    desc: desc
                })

                await fs.ensureDir(path.dirname(filePath))
                await fs.writeFile(filePath, cont)

                return {
                    content: [
                        {
                            type: "text",
                            text: `Archivo creado exitosamente: ${ruta}`
                        }
                    ]
                }
            } catch (err: any) {
                debug(`Error en escribir-archivo: ${err.message}`)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error al escribir archivo: ${err.message}`
                        }
                    ]
                }
            }
        }
    )

    // Herramienta para modificar parte de un archivo
    server.tool(
        'archivo-editar',
        "Modifica una parte específica de un archivo. Reemplaza texto dentro de un archivo",
        {
            ruta: z.string().describe("Ruta relativa al archivo desde la raíz del proyecto"),
            desc: z.string().describe("Breve descripción del cambio para el registro"),
            busca: z.string().describe("Texto a buscar"),
            cambio: z.string().describe("Texto de reemplazo"),
        },
        async ({ ruta, desc, busca, cambio }) => {
            try {
                const filePath = path.join(paths.PROJECT_BASE, ruta)

                await modifyFile(
                    filePath,
                    busca,
                    cambio
                )

                await logChange({
                    fecha: new Date().toISOString(),
                    archivo: ruta,
                    tipo: "mod",
                    desc: desc
                })

                return {
                    content: [
                        {
                            type: "text",
                            text: `Archivo modificado exitosamente: ${ruta}`
                        }
                    ]
                }
            } catch (err: any) {
                debug(`Error en modificar-archivo: ${err.message}`)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error al modificar archivo: ${err.message}`
                        }
                    ]
                }
            }
        }
    )

    // Herramienta para mover archivos o directorios
    server.tool(
        'mover',
        "Mueve un archivo o directorio a otra ubicación.",
        {
            origen: z.string().describe("Ruta relativa al archivo o directorio a mover"),
            destino: z.string().describe("Ruta relativa al nuevo destino"),
            desc: z.string().describe("Breve descripción del cambio para el registro")
        },
        async ({ origen, destino, desc }) => {
            try {
                const rutaOrigen = path.join(paths.PROJECT_BASE, origen)
                const rutaDestinoCompleta = path.join(paths.PROJECT_BASE, destino)

                // Verificar que el origen existe
                if (!await fs.pathExists(rutaOrigen)) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: No se encontró el archivo o directorio de origen: ${origen}`
                            }
                        ]
                    }
                }

                // Crear directorio de destino si no existe
                await fs.ensureDir(path.dirname(rutaDestinoCompleta))

                // Mover el archivo o directorio
                await fs.move(rutaOrigen, rutaDestinoCompleta, { overwrite: true })

                await logChange({
                    fecha: new Date().toISOString(),
                    archivo: origen,
                    tipo: "mod",
                    desc: `Movido de ${origen} a ${destino}: ${desc}`
                })

                return {
                    content: [
                        {
                            type: "text",
                            text: `Archivo o directorio movido exitosamente de ${origen} a ${destino}`
                        }
                    ]
                }
            } catch (err: any) {
                debug(`Error en mover-archivo: ${err.message}`)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error al mover archivo: ${err.message}`
                        }
                    ]
                }
            }
        }
    )
}