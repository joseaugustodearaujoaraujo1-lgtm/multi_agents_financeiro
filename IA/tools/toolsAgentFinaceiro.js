import axios from "axios";
import { tool } from "langchain";
import z from "zod";

export const ListarTicker = tool(
    async function ListarTickers({ ticker }) {

        const tickers = await axios.get(
            `https://brapi.dev/api/v2/tickers?search=${ticker}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_BRAPI}`
                }
            }
        )

        console.log("Passou pela a tool listar tickers...")

        return tickers.data
    }, {
    name: "toolListarTickers",
    description: `Busca e identifica ativos brasileiros, incluindo ações, FIIs, ETFs, BDRs e units. Use para localizar ou validar um código antes de consultar cotação, perfil ou indicadores. Recebe ticker como texto com um código completo, parcial ou antigo, enviado ao parâmetro search da API. Retorna o objeto completo: results contém os ativos encontrados e seus dados de identificação, classificação e resumo da cotação; indexes contém índices; facets informa valores disponíveis para filtros; pagination informa a existência de outras páginas. Confira symbol e o nome do ativo, pois a busca pode retornar várias correspondências. Esta implementação consulta somente a página padrão e não recebe filtros ou parâmetros de paginação. Não considere a resposta como a lista completa se pagination.hasNextPage for true. Não presuma cotação em tempo real. Não busca futuros, opções, Tesouro Direto, criptomoedas, câmbio ou indicadores econômicos.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)

export const Cotacoes = tool(
    async function Cotacoes({ ticker }) {

        const cotacao = await axios.get(
            `https://brapi.dev/api/v2/stocks/quote?symbols=${ticker}`,
            {
                headers: {
                    Authorization: "Bearer " + process.env.API_BRAPI
                }
            }
        )

        console.log("Passou pela a tool cotacoes...")

        return cotacao.data.results
    }, {
    name: "toolCotacoes",
    description: `Consulta a cotação disponível de ações, FIIs, BDRs, ETFs, units e índices brasileiros. Use para obter preço, variação, volume, valor de mercado, máxima e mínima do dia, faixa de 52 semanas e logo. Recebe ticker com um código ou vários códigos separados por vírgula, respeitando o limite do plano. Retorna diretamente um array de cotações, sem uma propriedade results envolvendo a resposta. Confira os códigos retornados, pois tickers inexistentes são omitidos; se nenhum tiver cotação, a API retorna 404. Tickers antigos podem ser substituídos pelo atual, conforme changed, requestedSymbol e symbol. AXIA5 e AXIA6 retornam a cotação de uma ação AXIA3; isso não informa a proporção de conversão de posições antigas. Campos nulos não representam zero. Não presuma atualização em tempo real. Para identificar códigos, use toolListarTickers; para contratos futuros, use toolCotacaoDeFuturos. Esta tool não retorna histórico de preços.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)

export const PerfilEmpresa = tool(
    async function PerfilEmpresa({ ticker }) {

        const perfil = await axios.get(
            `https://brapi.dev/api/v2/stocks/profile?symbols=${ticker}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_BRAPI}`
                }
            }
        )

        console.log("Passou pela a tool perfil da empresa...")

        return perfil.data.results
    }, {
    name: "toolPerfilEmpresa",
    description: `Consulta os dados cadastrais e o perfil da empresa vinculada ao ticker informado. Use para conhecer a atividade da empresa, setor, indústria, identificação e canais de contato. Recebe ticker com o código da empresa. Retorna diretamente um array, com os dados disponíveis na propriedade data de cada item: nome empresarial, CNPJ, endereço, site, telefone, número de funcionários, logo e descrição do negócio. Confira symbol, requestedSymbol e changed para identificar substituições de códigos antigos. Campos nulos indicam informações indisponíveis e não devem ser preenchidos por suposição. Como esses dados mudam pouco, reutilize respostas recentes já disponíveis no contexto quando forem suficientes; a tool não implementa cache automaticamente. Não fornece notícias, cotação, histórico de preços ou demonstrações financeiras. Para múltiplos, use toolEstatisticas; para resumo financeiro, use toolResumoFinaceiro.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)

export const Estatisticas = tool(
    async function Estaticas({ ticker }) {

        const estatisticas = await axios.get(
            `https://brapi.dev/api/v2/stocks/statistics?symbols=${ticker}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_BRAPI}`
                }
            }
        )

        console.log("Passou pela a tool estaticas...")

        return estatisticas.data.results
    }, {
    name: "toolEstatisticas",
    description: `Consulta múltiplos e estatísticas atuais de ações, incluindo P/L, P/VP, beta, dividend yield, lucro por ação, valor patrimonial por ação e valor de mercado, conforme disponibilidade. Use para comparar indicadores de empresas identificadas e apoiar análises de valuation. Recebe ticker com um código ou vários códigos separados por vírgula, respeitando o limite do plano. Retorna diretamente o array de resultados da API e utiliza o modo padrão current. Compare empresas considerando setor e período de referência dos indicadores. Múltiplos dependentes do preço podem mudar a cada pregão; indicadores dependentes apenas do balanço mudam com novos resultados. Confira as unidades e escalas antes de apresentar valores ou percentuais. Campos nulos não equivalem a zero. Esta implementação não recebe mode, period, startDate ou endDate, não consulta séries históricas e não busca todas as ações do mercado por filtros numéricos. Indicadores isolados não determinam se uma ação está barata ou cara, e dividend yield não garante pagamentos futuros.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)

export const ResumoFinaceiro = tool(
    async function ListarTickers({ ticker }) {

        const resumo = await axios.get(
            `https://brapi.dev/api/v2/stocks/financial-data?symbols=${ticker}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_BRAPI}`
                }
            }
        )

        console.log("Passou pela a tool resumo financeiros...")

        return resumo.data.results
    }, {
    name: "toolResumoFinaceiro",
    description: `Consulta o resumo financeiro atual da empresa vinculada ao ticker. Use para analisar receita, EBITDA, lucro bruto, margens, dívida, caixa, fluxo de caixa operacional e livre, liquidez, rentabilidade e crescimento de receita e lucro, conforme disponibilidade. Recebe ticker com um código ou vários códigos separados por vírgula, respeitando o limite do plano. Retorna diretamente um array, com os dados financeiros na propriedade data de cada item. Utiliza o modo padrão current, com resumo dos últimos 12 meses e saldos patrimoniais referentes à posição reportada. Diferencie valores acumulados no período, como receita e fluxo de caixa, de saldos em uma data, como caixa e dívida. Compare períodos e unidades equivalentes e não confunda EBITDA, lucro e geração de caixa. Campos nulos indicam dados indisponíveis, não zero; não presuma moeda quando ela não estiver identificada. Confira changed, requestedSymbol e symbol para mudanças de ticker. Esta implementação não consulta histórico nem substitui demonstrações completas. Para P/L e P/VP, use toolEstatisticas; para cotação, use toolCotacoes.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)

export const CotacaoDeFuturos = tool(
    async function CotacaoFuturos({ ticker }) {

        const cotacao = await axios.get(
            `https://brapi.dev/api/v2/futures/quote?symbols=${ticker}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_BRAPI}`
                }
            }
        )

        console.log("Passou pela a tool cotacao de futuros...")

        return cotacao.data.quotes
    }, {
    name: "toolCotacaoDeFuturos",
    description: `Consulta dados de fim de dia do último pregão disponível de até 20 contratos futuros. Use para obter ajuste diário, último negócio, máxima, mínima, variação, volume e características do contrato. Recebe ticker com códigos completos, incluindo vencimento, separados por vírgula. Não escolha silenciosamente um vencimento se o contrato desejado estiver indefinido. Retorna diretamente um array de contratos, sem uma propriedade quotes envolvendo a resposta. settlement representa o preço de ajuste diário; close representa o último negócio. Para quotationType=rate, como DI1 e DAP, close, high, low e average são taxas em % ao ano, settlement é expresso em reais e settlementRate contém a taxa do ajuste. Campos nulos não representam zero; settlement pode estar preenchido mesmo sem close, high ou low. Confira symbol, expirationDate e date e verifique quais contratos foram retornados, pois códigos desconhecidos são omitidos. Considere multiplicador e regras do contrato em cálculos de posições; esta tool não calcula automaticamente lucro, prejuízo ou ajuste da carteira. Não fornece dados em tempo real ou séries históricas. Requer plano Pro; a modalidade sem token aceita apenas códigos iniciados por WIN ou WDO, mas esta implementação envia o token configurado.`,
    schema: z.object({
        ticker: z.string().trim()
    })
}
)
