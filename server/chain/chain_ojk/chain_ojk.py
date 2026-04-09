from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.retrievers import BaseRetriever
from utils.models import ModelName


# ===== Only OJK (Financial Services Authority) Logic Chain =====
def create_ojk_chain(qa_system_prompt_str: str, retriever: BaseRetriever, llm_model: ModelName):
    _context_chain = RunnablePassthrough() | itemgetter("question") | {
        # "context": retriever | _combine_documents,
        "context": retriever,
        "question": RunnablePassthrough()
    }
    QA_SYSTEM_PROMPT_STR = qa_system_prompt_str
    QA_PROMPT = ChatPromptTemplate.from_template(QA_SYSTEM_PROMPT_STR)
    conversational_qa_with_context_chain = (
        _context_chain
        | {
            "rewrited question": itemgetter("question"),
            "answer": QA_PROMPT | llm_model | StrOutputParser(),
            "context": itemgetter("context"),
        } | RunnablePassthrough()
    )
    return conversational_qa_with_context_chain
