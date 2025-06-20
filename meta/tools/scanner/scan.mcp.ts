// mcp\app\shared\scan.mcp.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { generateAsciiTree, scanProject } from "../tools/scanner.js"
import { logChange } from "../utils/logger.js"
import { debug } from "../utils/fileLogger.js"

import path from "path"
import paths from "../../app/config/paths.js"
import fs from "fs-extra"
import { writeFile } from "../tools/filesystem.js"
import { IGNORE_DIRS } from "../../app/config/paths.js"


// todo: RAG
/**
 * Registra la herramienta de escaneo de proyecto en el servidor MCP
 */
export function registerScanMcp(server: McpServer) {
    // Herramienta para escanear el proyecto
    server.tool(
        'escanear-proyecto',
        "Escanea el proyecto y genera árboles de directorios. Escanea el proyecto y actualiza árboles de directorios",
        {
            params: z.object({
                directorio: z.string().describe("Directorio a escanear (code | meta)"),
            }),
        },
        async ({ params }) => {
            try {
                const dirToScan = params.directorio || 'code'
                const scanPath = dirToScan === 'code'
                    ? path.join(paths.PROJECT_BASE, 'code')
                    : path.join(paths.PROJECT_BASE, 'meta/mcp')

                const { detailed } = await scanProject(scanPath)

                // Guardar árbol básico
                await fs.writeFile(
                    path.join(paths.metaContextDir, `project_tree_${dirToScan}.json`),
                    JSON.stringify(detailed, null, 2)
                )

                await logChange({
                    fecha: new Date().toISOString(),
                    accion: "scan",
                    tipo: "system",
                    desc: `Árboles de directorios para '${dirToScan}' actualizados`
                })

                return {
                    content: [
                        {
                            type: "text",
                            text: `Proyecto '${dirToScan}' escaneado exitosamente. "Árbol detallado generado."`
                        }
                    ]
                }
            } catch (error: any) {
                debug(`Error en escanear-proyecto: ${error.message}`)
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error al escanear proyecto: ${error.message}`
                        }
                    ]
                }
            }
        }
    )
}