<p align="center">
    <h1 align="center">
      <span style="color: white; font-weight: bold;">OCBC Compliance GPT</span>
    </h1>
</p>
<p align="center">
  <!-- Typing SVG by DenverCoder1 - https://github.com/DenverCoder1/readme-typing-svg -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Sans&pause=1000&color=ED1C24&center=true&vCenter=true&width=435&lines=CRAYON+2024+Internship;OCBC+Indonesia;Arkan+Alexei+Andrei;" alt="Typing SVG" /></a>
</p>


## **Folder Structure**

Here's an overview of the main folders and files in this repository:

```plaintext
├── chain/                    
│   ├── chain_bi/             
│   ├── chain_ojk/           
│   ├── chain_sikepo/         
│   ├── chain_routing.py     
│   └── rag_chain.py        
├── constant/                
│   ├── bi/
│   ├── evaluation/
│   ├── ojk/
│   ├── sikepo/
│   └── prompt.py
├── database/                
│   ├── store_logs/
│   ├── vector_store/
│   └── chat_store.py
├── retriever/               
│   ├── retriever_bi/
│   ├── retriever_ojk/
│   ├── retriever_sikepo/
│   └── self_query.py
├── scraping/                
├── utils/
├── evaluation.ipynb
├── main.py
└── main_storing_ojk.ipynb
```

<br>

### **Key Folders and Files**

- **chain/**: Contains the logic and routing for different processing chains, including BI, OJK, and SIKEPO. Click [here](https://github.com/taytb/chatbot-be/blob/main/chain/README.md) for the details.
  - `chain_routing.py`: Manages routing between different chains.
  - `rag_chain.py`: Handles Retrieval-Augmented Generation (RAG) for chaining.

- **constant/**: Stores constant files (prompt) and configurations for BI, OJK, SIKEPO, and evaluation results.

- **database/**: Manages data storage, including logs, chat history, and vector database.
  - **vector_store/**: Contains files related to vector and graph storage.
  - **store_logs/**: Contains files related to logs when storing vector databases.
  - `chat_store.py`: Handle the abstraction for chat message history
    
- **retriever/**: Scripts for data retrieval from the vector database specific to BI, OJK, and SIKEPO.

- **scraping/**: Includes scripts for web scraping and data extraction.

- **utils/**: Utility scripts for tasks like document extraction and configuration management.

- ``evaluation.ipynb``: Notebooks related to the evaluation process.

- ``main.py``: The primary script for running the project.


<br>

## **Installation**

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/arkanalexei/JetBrains-Internship-Task-AI-Assistant
   ```

2. **Install Dependencies**  
   Ensure you're using Python 3.9.19, then install the required packages:  
   ```bash
   pip install -r requirements.txt
   ```
<br>

## **Usage**

1. **Start the API** <br>
   Launch the API with the following command:
   
   ```bash
   uvicorn main:app --reload
   ```

<br>

