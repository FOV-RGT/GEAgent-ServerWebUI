export interface MCPConfigType {
    name: string
    version: string
    transport: MCPTransport,
    status: MCPStatus,
    methods: string
} | null

export interface MCPTransport {
    command: string
    args: string[]
}

export interface MCPStatus {
    state: string,
    error: string | null,
    toolsCount: number,
    lastConnected: string | null,
    lastUpdated: string | null
}