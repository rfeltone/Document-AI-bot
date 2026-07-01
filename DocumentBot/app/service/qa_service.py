from app.LLM.llm_client import build_document_qa_prompt, ask_llm
from fastapi import HTTPException
from app.chat_state import get_chat_state, add_message



def ask_about_document(document: str, question: str)-> str:
    prompt = build_document_qa_prompt(document_text=document, question=question )
    answer = ask_llm(prompt=prompt)
    return answer

def ask_in_chat(chat_id: str, question: str) -> str:
    state = get_chat_state(chat_id) or {}
    document_text = state.get("active_document_text", "")

    print("DOCUMENT TEXT:", repr(document_text))

    add_message(chat_id, "user", question)
    answer = ask_about_document(document_text, question)
    if not answer.startswith("Сервис временно недоступен. Попробуй еще раз."):
        add_message(chat_id, "assistant", answer)

    return answer