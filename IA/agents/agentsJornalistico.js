import "dotenv/config"
import * as tool from "../tools/toolsAgentJornalistico.js"
import { createAgent, modelFallbackMiddleware } from "langchain"
import modelosOpenrouter from "../modelos/openrouter.js"
import modeloGroq from "../modelos/groq.js"
import { promptJornalistico } from "../prompts/allPrompst.js"

const agentJornalistico = createAgent({
    model: modelosOpenrouter,
    systemPrompt: promptJornalistico ,
    tools: [
        tool.BuscarNoticias,
        tool.tavily
    ],
    middleware: [
        modelFallbackMiddleware(modeloGroq)
    ]
})

export default agentJornalistico