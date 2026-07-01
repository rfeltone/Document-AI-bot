from typing import Any

chat_storage: dict[str, dict[str, Any]] = {
    
    
}
def save_active_document(chat_id: str, document_text: str, filename: str) -> None:
    chat_storage[chat_id] = {
        "active_document_text": document_text,
        "active_filename": filename,
        "last_messages": []
    }


def get_chat_state(chat_id: str): 
    return chat_storage.get(chat_id)

def add_message(chat_id: str, role: str, content: str) -> None:
    state = chat_storage.get(chat_id)
    if state is None:
        return
    state["last_messages"].append({
        "role": role,
        "content": content
    })
    state["last_messages"] = state["last_messages"][-10:]

# {
#     "chat_123": {
#         "active_document_text": "Текст документа...",
#         "active_filename": "rules.txt",
#         "last_messages": []
#     }
# }