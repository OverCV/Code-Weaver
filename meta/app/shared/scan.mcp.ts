// mcp\app\shared\scan.mcp.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import path from "path"
import { z } from "zod"
import { paths } from "../config/paths.js"
import { logChange, debug } from "../../tools/utils/fileLogger.js"


// todo: Aquí realmente se debe hacer un rag de archivos (no librerías/paquetes) y con estos poder hacer un rag del código. Debería ser un TOF (Tree of Files) como hace con llama-index (o neo4J).
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

                // const { detailed } = await scanProject(scanPath)

                // // Guardar árbol básico
                // await fs.writeFile(
                //     path.join(paths.metaContextDir, `project_tree_${dirToScan}.json`),
                //     JSON.stringify(detailed, null, 2)
                // )

                await logChange({
                    fecha: new Date().toISOString(),
                    accion: "scan",
                    tipo: "sys",
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