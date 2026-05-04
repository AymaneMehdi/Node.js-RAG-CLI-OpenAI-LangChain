// ==========================
// STEP 0: IMPORTS
// ==========================

// Load environment variables (.env)
import "dotenv/config";

// Chat model (LLM) + embeddings from OpenAI via LangChain
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

// Vector store (database in memory)
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Text splitter (to split long text into chunks)
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// CLI (terminal input)
import readline from "readline";


// ==========================
// STEP 1: LOAD YOUR DATA
// ==========================

// This is your "knowledge base"
// In real projects: PDF / database / API
// Here: simple text string
const text = `
RAG stands for Retrieval Augmented Generation.
It retrieves relevant information before generating answers.
Embeddings convert text into vectors.
Vector search finds similar meanings between texts.
`;


// ==========================
// STEP 2: SPLIT TEXT INTO CHUNKS
// ==========================

// Why we split?
// Because LLMs and embeddings work better with small pieces

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,     // max characters per chunk
  chunkOverlap: 10,   // overlap to avoid losing context
});

// Convert raw text → array of documents (chunks)
const docs = await splitter.createDocuments([text]);

// Example output:
// [
//   { pageContent: "RAG stands for..." },
//   { pageContent: "Embeddings convert..." }
// ]


// ==========================
// STEP 3: CREATE EMBEDDINGS
// ==========================

// This object will convert text → vectors (numbers)
const embeddings = new OpenAIEmbeddings();

// Important:
// You do NOT call embeddings manually here
// LangChain will use it automatically inside the vector store


// ==========================
// STEP 4: CREATE VECTOR STORE
// ==========================

// This step does 3 things automatically:
// 1. Takes your docs
// 2. Converts them to embeddings
// 3. Stores them in memory

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  embeddings
);

// Now you have a "mini database" of vectors


// ==========================
// STEP 5: CREATE RETRIEVER
// ==========================

// Retriever = search engine
// It will:
// - take a question
// - convert it to embedding
// - find similar docs

const retriever = vectorStore.asRetriever({
  k: 3, // return top 3 similar chunks
});


// ==========================
// STEP 6: CREATE LLM (MODEL)
// ==========================

// This is the AI that generates answers
const model = new ChatOpenAI({
  model: "gpt-4.1-mini",
});


// ==========================
// STEP 7: CLI INPUT
// ==========================

// This function lets user type in terminal
function askQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Ask a question: ", (q) => {
      rl.close();
      resolve(q); // return user input
    });
  });
}


// ==========================
// STEP 8: MAIN RAG FLOW
// ==========================

async function main() {

  // 1. Get question from user
  const question = await askQuestion();

  // ==========================
  // 2. RETRIEVE RELEVANT DOCS
  // ==========================

  // Behind the scenes:
  // - convert question → embedding
  // - compare with stored embeddings
  // - return best matches

  const relevantDocs = await retriever.invoke(question);

  // Example:
  // [
  //   { pageContent: "RAG stands for..." },
  //   { pageContent: "Embeddings convert..." }
  // ]


  // ==========================
  // 3. BUILD CONTEXT
  // ==========================

  // Combine retrieved chunks into one text
  const context = relevantDocs
    .map(doc => doc.pageContent)
    .join("\n");

  // This context will be sent to LLM


  // ==========================
  // 4. GENERATE ANSWER
  // ==========================

  const response = await model.invoke([
    {
      role: "system",
      content: "Answer ONLY using the provided context. If not found, say you don't know.",
    },
    {
      role: "user",
      content: `
Context:
${context}

Question:
${question}
      `,
    },
  ]);


  // ==========================
  // 5. OUTPUT RESULT
  // ==========================

  console.log("\nAnswer:");
  console.log(response.content);
}


// ==========================
// STEP 9: RUN APP
// ==========================

main();