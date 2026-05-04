# Node.js RAG CLI with LangChain

A clean, powerful **Retrieval-Augmented Generation (RAG)** system built with **Node.js** and **LangChain**. This CLI application demonstrates how to combine local documents with OpenAI's language models to answer questions based on your own data.

## What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that enhances Large Language Models (LLMs) by:
1. Retrieving relevant information from a knowledge base first
2. Using that information as context
3. Generating accurate answers based on that context

Instead of relying solely on the LLM's training data, RAG retrieves specific, relevant information and feeds it to the model, resulting in more accurate and grounded answers.

---

## How It Works: The RAG Pipeline with LangChain

The system follows this workflow:

### **Step 1: Load** 
- Load your knowledge base text data
- In this project, data is stored as a string in `RAG.js`
- In real projects: load from PDFs, files, databases, or APIs

### **Step 2: Split (RecursiveCharacterTextSplitter)** 
- Break the document into smaller, manageable **chunks**
- Uses LangChain's `RecursiveCharacterTextSplitter`
- Configurable chunk size and overlap for context preservation
- Example: 100 characters per chunk with 10 character overlap

### **Step 3: Create Embeddings** 
- Convert each chunk into a numerical representation (embedding)
- Uses OpenAI's embedding API via LangChain
- Embeddings capture semantic meaning as vectors
- This creates a **vector database** in memory

### **Step 4: Create Vector Store** 
- LangChain's `MemoryVectorStore` stores embeddings and documents
- Ready for semantic search
- Fast retrieval for small to medium datasets

### **Step 5: Create Retriever** 
- LangChain retriever handles the search logic
- Automatically converts questions to embeddings
- Compares with stored embeddings using similarity metrics
- Returns top K relevant chunks (default: top 3)

### **Step 6: User Input** 
- CLI prompts user to ask a question
- Uses Node.js `readline` for terminal input

### **Step 7: Retrieve Relevant Documents** 
- Question is converted to an embedding
- Retriever finds the most similar chunks
- Returns the best matching context

### **Step 8: Generate Answer** 
- Sends retrieved context + question to GPT-4 mini
- LLM is instructed to: *"Answer ONLY using the provided context"*
- Generates accurate, grounded answers

### **Step 9: Display Answer** 
- Output the generated response to the user
- Close the CLI session

---

## Visual Pipeline

```
Knowledge Base (Text)
   ↓
[RecursiveCharacterTextSplitter] → Chunks: ["chunk1", "chunk2", ...]
   ↓
[OpenAI Embeddings] → Vector embeddings
   ↓
[MemoryVectorStore] → In-memory vector database
   ↓
User asks: "What is X?"
   ↓
[Retriever] → Converts question to embedding
   ↓
[Similarity Search] → Finds top 3 relevant chunks
   ↓
[Context Building] → Combines retrieved chunks
   ↓
[ChatOpenAI (GPT-4 mini)] → Generates answer with context
   ↓
Answer Output
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher - for ES modules support)
- **npm** or **yarn**
- **OpenAI API Key** (get one at https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AymaneMehdi/Node.js-RAG-CLI-OpenAI-LangChain.git
   cd Node.js-RAG-CLI-OpenAI-LangChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file**
   ```bash
   echo OPENAI_API_KEY=your_api_key_here > .env
   ```
   Replace `your_api_key_here` with your actual OpenAI API key.

### Running the Application

```bash
node RAG.js
```

You'll see a prompt:
```
Ask a question: 
```

Type your question and press Enter. The system will:
1. Convert your question to an embedding
2. Search for relevant chunks using the retriever
3. Send context to the LLM
4. Display the answer

**Example:**
```
Ask a question: What is RAG?
Answer:
RAG stands for Retrieval Augmented Generation. It retrieves relevant information before generating answers.
```

---

## Project Structure

```
Node.js-RAG-CLI-OpenAI-LangChain/
├── RAG.js                # Main RAG application with LangChain
├── package.json          # Project dependencies and metadata
├── package-lock.json     # Locked dependency versions
├── README.md             # This file
├── SECURITY.md           # Security guidelines
├── .gitignore            # Git ignore rules
└── LICENSE               # ISC License
```

**Files you need to create:**
- `.env` - Store your `OPENAI_API_KEY` here (keep secret)

---

## How the Code Works

### LangChain Components

| Component | Purpose |
|-----------|---------|
| **RecursiveCharacterTextSplitter** | Splits long text into manageable chunks with configurable size and overlap |
| **OpenAIEmbeddings** | Converts text chunks and questions into numerical vectors |
| **MemoryVectorStore** | In-memory vector database that stores embeddings and documents |
| **Retriever** | Search engine that finds similar chunks based on embedding similarity |
| **ChatOpenAI** | OpenAI's language model (GPT-4 mini) for generating answers |
| **readline** | CLI interface for user input |

### Key Code Steps (in `RAG.js`)

1. **Import LangChain modules** - Set up all dependencies
2. **Define knowledge base** - Store your text data
3. **Create splitter** - Configure `RecursiveCharacterTextSplitter` with chunk size and overlap
4. **Split documents** - Convert raw text to document chunks
5. **Initialize embeddings** - Create `OpenAIEmbeddings` instance
6. **Create vector store** - Build `MemoryVectorStore` with embeddings
7. **Create retriever** - Set up retriever with k=3 (top 3 results)
8. **Initialize model** - Create `ChatOpenAI` instance with GPT-4 mini
9. **CLI input loop** - Prompt user for questions
10. **Retrieve & generate** - Use retriever to find context, then send to LLM

### Configuration in RAG.js

```javascript
// Adjust chunk size and overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,      // Increase for larger chunks
  chunkOverlap: 10,    // Increase to preserve more context
});

// Adjust number of retrieved documents
const retriever = vectorStore.asRetriever({
  k: 3,  // Change to return more/fewer results
});

// Change the LLM model
const model = new ChatOpenAI({
  model: "gpt-4.1-mini",  // Or use gpt-4, gpt-3.5-turbo, etc.
});
```

---

## Example Workflow

**Scenario:** Knowledge base about RAG concepts

**Knowledge Base (in RAG.js):**
```javascript
const text = `
RAG stands for Retrieval Augmented Generation.
It retrieves relevant information before generating answers.
Embeddings convert text into vectors.
Vector search finds similar meanings between texts.
LLMs are large language models that generate text.
Vector databases store embeddings for fast retrieval.
`;
```

**User Input:**
```
Ask a question: What is RAG?
```

**System Process:**
1. Text is split into chunks using `RecursiveCharacterTextSplitter`
2. Each chunk is converted to embeddings using `OpenAIEmbeddings`
3. Embeddings are stored in `MemoryVectorStore`
4. User question is converted to embedding
5. Retriever finds top 3 similar chunks using similarity search
6. Context is built from the retrieved chunks
7. Context + question is sent to ChatOpenAI (GPT-4 mini)
8. LLM generates answer

**Answer Output:**
```
Answer:
RAG stands for Retrieval Augmented Generation. It retrieves relevant information 
before generating answers. Embeddings convert text into vectors, and vector search 
finds similar meanings between texts.
```

---

## Configuration

### Adjustable Parameters (in `RAG.js`)

#### RecursiveCharacterTextSplitter
```javascript
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,      // Smaller = more precise chunks, Larger = more context
  chunkOverlap: 10,    // Overlap between chunks to preserve context
});
```

#### Retriever
```javascript
const retriever = vectorStore.asRetriever({
  k: 3,  // Number of top results to retrieve (default: 3)
});
```

#### LLM Model
```javascript
const model = new ChatOpenAI({
  model: "gpt-4.1-mini",  // Can use gpt-4, gpt-3.5-turbo, etc.
});
```

#### System Prompt
```javascript
{
  role: "system",
  content: "Answer ONLY using the provided context. If not found, say you don't know.",
}
```

### Examples of Common Configurations

**For more precise answers (smaller chunks):**
```javascript
chunkSize: 50,
chunkOverlap: 5,
k: 5  // Retrieve more chunks
```

**For faster performance (larger chunks):**
```javascript
chunkSize: 500,
chunkOverlap: 50,
k: 2  // Retrieve fewer chunks
```

**For more thorough searches:**
```javascript
k: 10  // Return top 10 relevant chunks instead of 3
```

---

## Tips & Best Practices

1. **Knowledge Base Quality:** Better, more organized content = better answers. Keep your knowledge base clean and relevant.

2. **Chunk Size Tuning:** 
   - Smaller chunks (50-100 chars) = more precise matching but may lose context
   - Larger chunks (500+ chars) = more context but less precise
   - Find the sweet spot for your use case

3. **Chunk Overlap:** 
   - Small overlap (5-10) = less redundancy, faster processing
   - Larger overlap (50+) = better context preservation between chunks

4. **Retriever Configuration:**
   - `k: 2-3` for quick answers
   - `k: 5-10` for more thorough context
   - Balance between accuracy and latency

5. **System Prompt Engineering:** 
   - Customize the system message to guide LLM behavior
   - Example: Tell it to answer in a specific format or style

6. **API Costs:** 
   - Each embedding creation costs money
   - Each LLM call costs money
   - Monitor usage on OpenAI dashboard
   - Pre-embed all documents once and reuse

7. **Error Handling:**
   - Add try-catch blocks around API calls
   - Handle rate limiting gracefully
   - Implement retry logic for failed requests

8. **Scaling Considerations:**
   - `MemoryVectorStore` is great for prototypes but limited for large datasets
   - Consider persistent vector databases (Pinecone, Weaviate, Milvus) for production
   - LangChain supports many vector store backends

---

## Security

- **Never commit `.env` to Git.** Add it to `.gitignore`:
  ```
  .env
  node_modules/
  ```
- Keep your OpenAI API key private
- Don't share your `.env` file with others

---

## Dependencies

### Core Dependencies

- **[openai](https://www.npmjs.com/package/openai)** - Official OpenAI Node.js SDK
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Load environment variables from `.env` file

### LangChain Packages (installed via openai)

- **[@langchain/openai](https://js.langchain.com/docs/integrations/llms/openai)** - OpenAI integrations for LangChain
  - `ChatOpenAI` - Language model for chat
  - `OpenAIEmbeddings` - Embeddings API client

- **[langchain](https://www.npmjs.com/package/langchain)** - Core LangChain framework
  - `RecursiveCharacterTextSplitter` - Smart text splitting
  - `MemoryVectorStore` - In-memory vector database

### Installation of LangChain (Optional - for reference)

If you need to install LangChain packages separately:

```bash
npm install langchain @langchain/openai openai dotenv
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `OPENAI_API_KEY is undefined` | Check your `.env` file and ensure the key is set correctly |
| `Cannot find module '@langchain/openai'` | Run `npm install` to ensure all dependencies are installed |
| `Cannot find module 'langchain'` | You need both `langchain` and `@langchain/openai` packages installed |
| `SyntaxError: Cannot use import statement` | Ensure Node.js version is 18+, and your package.json has `"type": "commonjs"` or use `.mjs` extension |
| `Model not found` | Verify you're using a valid OpenAI model name (e.g., `gpt-4`, `gpt-3.5-turbo`, `gpt-4.1-mini`) |
| `No relevant results` | Your question might not match the knowledge base; try different wording or add more diverse content |
| `Slow performance` | Large documents take longer to embed; reduce chunk size or limit knowledge base size |
| `High API costs` | Each embedding and LLM call costs money; reduce chunk size or retrieve fewer results (reduce `k` value) |

---

## Learn More

### LangChain Documentation
- [LangChain JS/TS Docs](https://js.langchain.com/)
- [LangChain OpenAI Integration](https://js.langchain.com/docs/integrations/llms/openai)
- [Vector Stores in LangChain](https://js.langchain.com/docs/modules/data_connection/vectorstores/)

### OpenAI Documentation
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI Chat Completions API](https://platform.openai.com/docs/guides/gpt)
- [Available Models](https://platform.openai.com/docs/models)

### RAG & AI Concepts
- [RAG Concept](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)
- [Embeddings Explained](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)
- [Vector Similarity Search](https://en.wikipedia.org/wiki/Cosine_similarity)

---

## License

This project is licensed under the [MIT License](LICENSE).
---
Copyright© Aymane Mehdi