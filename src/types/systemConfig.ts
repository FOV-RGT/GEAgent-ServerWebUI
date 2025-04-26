export type MCPConfigType = {
    name: string
    version: string
    transport: MCPTransport
    status: MCPStatus
    method: string
    description: string | null
} | null;

export interface MCPTransport {
    command: string
    args: string[]
}

export interface MCPStatus {
    state: string,
    error: string | null,
    toolsCount: number,
    lastConnected: Date | null,
    lastUpdated: Date | null
}