// mcp\app\shared\index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { registerFileMcp } from "./files/filesystem.tools.js"
import { registerSystemMcp } from "./system/sys.mcp.js"
import { registerStyleMcp } from "./styles/style.mcp.js"
import { registerFeaturesMcp } from "./features/features.mcp.js"
// import { registerGithubMcp } from "./github/git.mcp.js"
// import { registerDatabaseMcp } from "./database/database.mcp.js"

/**
 * Registra todas las herramientas MCP en el servidor
 */
export function registerAllTools(server: McpServer) {
    registerFeaturesMcp(server)
    registerSystemMcp(server)
    registerFileMcp(server)
    registerStyleMcp(server)
    // registerScanMcp(server)
    // registerGithubMcp(server)
    // registerDatabaseMcp(server)
}