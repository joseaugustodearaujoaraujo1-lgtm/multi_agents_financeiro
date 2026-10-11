import modelosOpenrouter from "../modelos/openrouter.js";
import modeloGroq from "../modelos/groq.js";
import {  promptOrquestrador } from "../prompts/allPrompst.js";
import { createAgent, modelFallbackMiddleware } from "langchain";
import * as agent from "../tools/toolsAgentOrquestrador.js"

const agentOrquetsrador = createAgent({
    model: modelosOpenrouter,
    systemPrompt: promptOrquestrador,
    middleware: [
        modelFallbackMiddleware(modeloGroq)
    ],
    tools: [
        agent.toolAgentFinanceiro,
        agent.toolAgentJornalistico
    ]
})

export default agentOrquetsrador