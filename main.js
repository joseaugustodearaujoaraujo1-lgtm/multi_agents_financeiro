import "dotenv/config"
import input from "readline-sync"
import agentOrquetsrador from "./IA/agents/agentOrquestrador.js"

const historicoContexto = []

async function ChatEmTempoReal() {
    try {
        while (true) {

            console.log("\n" + "===== FACA UMA PERGUNTA =====")
            const pergunta = input.question(">>> ")

            if (pergunta.toLowerCase() === "sair") {
                console.log("Saindo do sistema...")
                break
            } else if (pergunta.toLowerCase() === "historico") {
                if (historicoContexto.length === 0) {
                    return console.log("Nenhuma conversa encontrada!")
                }
                console.log(historicoContexto)
            }

            historicoContexto.push({ role: "user", content: pergunta })

            const resposta = await agentOrquetsrador.invoke({
                messages: [
                    ...historicoContexto,
                    {
                        role: "user", content: pergunta
                    }
                ]
            })

            historicoContexto.push({ role: "assistant", content: resposta.messages.at(-1).content })

            console.log("===== RESPOSTA DO AGENT =====")
            console.log(">>> " + resposta.messages.at(-1).content)

        }
    } catch (error) {
        console.log(error)
    }
}

ChatEmTempoReal()