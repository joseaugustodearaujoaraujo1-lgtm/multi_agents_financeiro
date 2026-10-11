import "dotenv/config"
import { ChatGroq } from "@langchain/groq"

const modeloGroq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.API_GROQ,
    temperature: 0.5
})

export default modeloGroq