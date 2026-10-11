import "dotenv/config"
import { tool } from "langchain"
import z from "zod"
import agentFinaceiro from "../agents/agentsFinaceiro.js"
import agentJornalistico from "../agents/agentsJornalistico.js"

export const toolAgentFinanceiro = tool(
    async function Financeiro({any}){

        const resposta = await agentFinaceiro.invoke({
            messages: [
                {
                    role: "user" , content: any
                }
            ]
        })

        return resposta.messages.at(-1).content
    } , {
        name: "toolAgentFinanceiro",
        description: `Delega uma solicitação ao agente especializado em dados financeiros de ativos brasileiros. Use para identificar tickers, consultar cotações de ações, FIIs, ETFs, BDRs, units e índices, conhecer o perfil de empresas, comparar múltiplos e indicadores, analisar resumos financeiros e consultar dados de fim de dia de contratos futuros. Recebe no parâmetro any uma solicitação completa em linguagem natural, com os ativos envolvidos, o objetivo e o contexto necessário. O histórico do orquestrador não é enviado automaticamente; substitua referências vagas pelo nome ou ticker correspondente e inclua informações relevantes fornecidas pelo usuário. Para futuros, informe o contrato e vencimento quando conhecidos. O agente consulta suas próprias ferramentas e retorna sua resposta final, sem expor o histórico interno de execução. Preserve os valores, datas, fontes e limitações apresentados ao elaborar a resposta ao usuário. Não presuma cotações em tempo real nem invente dados ausentes. As ferramentas atuais não consultam notícias ou séries históricas, não executam ordens e não acessam automaticamente a carteira do usuário. Use o agente jornalístico para notícias e acontecimentos recentes, quando disponível`,
        schema: z.object({
            any: z.string().trim()
        })
    }
)

export const toolAgentJornalistico = tool(
    async function Jornalistico({any}){

        const resposta = await agentJornalistico.invoke({
            messages: [
                {
                    role: "user" , content: any
                }
            ]
        })

        return resposta.messages.at(-1).content
    } , {
        name: "toolAgentJornalistico",
        description: `Delega uma solicitação ao agente jornalístico especializado em pesquisar notícias, localizar atualizações e conferir afirmações por meio da GNews e da Tavily. Use para investigar acontecimentos, verificar informações e contextualizar notícias, priorizando economia, finanças, empresas e investimentos. Também atende assuntos fora dessa área quando solicitados explicitamente pelo usuário. Recebe no parâmetro any uma solicitação completa em linguagem natural, com o assunto, entidades envolvidas, período desejado e contexto necessário. O histórico do orquestrador não é enviado automaticamente; esclareça referências vagas e inclua os detalhes relevantes da conversa. O agente busca fontes primárias e confirmação independente quando necessário, distingue fatos documentados de alegações, opiniões e projeções e retorna sua resposta final com fontes, links, datas e limitações disponíveis. Preserve essas informações ao responder ao usuário. Não trate a consulta como garantia absoluta de veracidade ou cobertura em tempo real: a GNews pode apresentar atraso, e os conteúdos encontrados podem estar incompletos. Se a verificação for inconclusiva, mantenha essa incerteza na resposta. Não utiliza notícias como substituto de cotações atuais ou indicadores financeiros; encaminhe essas consultas ao agente financeiro.`,
        schema: z.object({
            any: z.string().trim()
        })
    }
)