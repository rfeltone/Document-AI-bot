from pydantic import BaseModel

class AskDocumentRequest(BaseModel):
    document_text: str
    question: str

class AskDocumentResponse(BaseModel):
    answer: str
    
class ChatAskRequest(BaseModel):
    chat_id: str
    question: str


from app.faq.faq_data import FAQ_ITEMS

for faq_item in FAQ_ITEMS:
    print(faq_item)