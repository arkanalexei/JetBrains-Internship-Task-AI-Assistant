# JetBrains Internship Task - AI Assistant

An AI-powered compliance assistant that answers questions over Indonesian financial regulations using a Retrieval-Augmented Generation (RAG) pipeline, hybrid retrieval strategies, and streaming chat UX.

This repository is submitted as a technical sample for the JetBrains internship in the AI assistant chat team to demonstrate:
- practical use of AI tools and frameworks,
- code structure across backend and frontend,
- clear engineering trade-offs between answer quality and latency.

## Why This Project

I built this project to tackle a real compliance pain point: regulatory documents are large, fragmented, and difficult to query quickly.  

The assistant combines multiple domain retrievers and synthesizes responses into one grounded answer, with support for different performance modes.

## What It Does

- Answers compliance questions across multiple document sources (OJK, BI, SIKEPO)*.
- Uses RAG with retriever routing and context compression.
- Supports two serving modes:
  - `quality`: source-specific answering + synthesis for stronger correctness.
  - `speed`: merged context flow for lower latency.
- Streams responses token-by-token to the frontend.
- Persists chat history and supports conversation management (rename, delete, clear all).

\* Explanation of terminologies: 
- OJK = Otoritas Jasa Keuangan. The Financial Services Authority of Indonesia
- BI = Bank Indonesia. The Central Bank of Indonesia
- SIKEPO = Online Banking Provisions Information System. An application developed by OJK to search banking related regulations.

## Repository Structure

```text
.
├── client/                 # React + Vite + TypeScript frontend
└── server/                 # FastAPI + LangChain backend
    ├── chain/              # Routing and RAG chain orchestration
    ├── constant/           # Domain prompts, filters, evaluation assets
    ├── database/           # Vector stores, graph store, chat store
    ├── retriever/          # Domain retrievers + self-query logic
    ├── scraping/           # Data ingestion scripts (OJK/BI/SIKEPO)
    └── main.py             # API entrypoint
```

## System Design (High Level)

1. User submits a question in the frontend.
2. Backend routes query to the relevant SIKEPO path (`rekam_jejak` vs `ketentuan_terkait`).
3. For regulation QA, backend runs multi-source retrieval (OJK/BI/SIKEPO) with self-query + MMR + compression.
4. Chain executes in either `quality` or `speed` mode.
5. Final response is streamed to UI via Server-Sent Events (SSE) and stored in chat history.

## Tech Stack

- **Backend:** FastAPI, LangChain, Azure OpenAI, Elasticsearch, Neo4j
- **Frontend:** React, TypeScript, Vite, Recoil, SWR, Ant Design, Tailwind
- **Evaluation/Experimentation:** notebooks and prompt/routing iterations in `server/`

## Local Setup

## 1) Backend

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend defaults to `http://localhost:8000` when run with uvicorn.

### Required backend environment variables (`server/.env`)

```bash
AZURE_OPENAI_KEY_LLM=
AZURE_API_VERSION_LLM=
AZURE_OPENAI_ENDPOINT_LLM=
AZURE_OPENAI_DEPLOYMENT_ID_LLM=

AZURE_OPENAI_KEY_EMB=
AZURE_API_VERSION_EMB=
AZURE_OPENAI_ENDPOINT_EMB=
AZURE_OPENAI_DEPLOYMENT_ID_EMB=

ES_URI=
ES_USERNAME=
ES_PASSWORD=

NEO4J_GRAPH_URL=
NEO4J_USERNAME=
NEO4J_PASSWORD=
NEO4J_DATABASE=
```

You also need populated Elasticsearch indexes expected by the app:
- `ojk`
- `bi-new`
- `sikepo-ketentuan-terkait`
- `sikepo-rekam-jejak`

## 2) Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```bash
VITE_API_URL=http://localhost:8000/api/
```

## API Endpoints (Main)

- `GET /api/chat/{model_type}` - streaming response endpoint (`speed` or `quality`)
- `GET /api/fetch_conversations/`
- `GET /api/fetch_messages/{conversation_id}`
- `PUT /api/rename_conversation/{conversation_id}`
- `DELETE /api/delete_conversation/{conversation_id}`
- `DELETE /api/delete_all_conversations/`

## Engineering Decisions and Trade-offs

- Implemented a **quality-first multi-stage answering strategy** for high-stakes compliance queries, even with higher latency.
- Kept a **speed mode** for better responsiveness when strict correctness is less critical.
- Used **hybrid retriever composition** (self-query, MMR, compression) to reduce irrelevant context and improve answer grounding.
- Added **chat history persistence and streaming UX** to make the assistant practical for iterative workflows.

## Results Snapshot

From prior production-oriented work on related compliance systems:
- improved answer correctness significantly through pipeline redesign,
- achieved strong context precision,
- accepted higher latency where correctness had higher business value.

This repository focuses on code structure and reproducible architecture rather than exposing proprietary datasets.

## How This Demonstrates Fit for the Internship

- **AI tool usage:** LangChain orchestration, retriever composition, prompt design, and LLM integration.
- **Code quality:** modular backend layering (`chain`, `retriever`, `database`, `constant`) and clean frontend separation.
- **Clarity of approach:** explicit quality-vs-speed design, documented setup, and transparent trade-offs.

## Links

- Presentation (project background and outcomes): [Google Slides](https://docs.google.com/presentation/d/1a1BKAY9I8aXkTul3PShXYivOnB7qC-o_MPmPjWejH-w/edit?usp=sharing)
- Repository: [arkanalexei/JetBrains-Internship-Task-AI-Assistant](https://github.com/arkanalexei/JetBrains-Internship-Task-AI-Assistant)

## Notes

- Some files in `server/scraping/` and notebooks are research/ingestion artifacts.
- This submission emphasizes architecture, reasoning, and implementation quality over production hardening.
