import "dotenv/config"
import modeloGroq from "../modelos/groq.js"
import modelosOpenrouter from "../modelos/openrouter.js"
import { createAgent, modelFallbackMiddleware } from "langchain"
import * as tool from "../tools/toolsAgentFinaceiro.js"
import { promptfinanceiro } from "../prompts/allPrompst.js"

const agentFinaceiro = createAgent({
    model: modelosOpenrouter,
    systemPrompt: promptfinanceiro,
    middleware: [
        modelFallbackMiddleware(modeloGroq)
    ],
    tools : [
        tool.CotacaoDeFuturos,
        tool.Cotacoes,
        tool.Estatisticas,
        tool.ListarTicker,
        tool.PerfilEmpresa,
        tool.ResumoFinaceiro
    ]
})

export default agentFinaceiro