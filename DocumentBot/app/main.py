from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from app.schemas import AskDocumentRequest, AskDocumentResponse, ChatAskRequest
from app.service.qa_service import ask_about_document, ask_in_chat
from app.document_parser import extract_text_from_file
from app.chat_state import save_active_document, get_chat_state

app = FastAPI(title="Document QA Bot")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask-document", response_model=AskDocumentResponse)
def ask_document(payload: AskDocumentRequest):
    answer = ask_about_document(payload.document_text, payload.question)
    return AskDocumentResponse(answer=answer)

@app.post("/chat/ask", response_model=AskDocumentResponse)
def chat_ask(payload: ChatAskRequest):
    response = ask_in_chat(payload.chat_id, payload.question)
    return AskDocumentResponse(answer=response)



@app.post("/documents/upload")
async def upload_document(
    chat_id: str = Form(...),
    file: UploadFile = File(...)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is missing")

    file_bytes = await file.read()
    document_text = extract_text_from_file(
        file_bytes=file_bytes,
        filename=file.filename
    )

    save_active_document(
        chat_id=chat_id,
        document_text=document_text,
        filename=file.filename
    )
    print("Добавленные документы:", chat_id, get_chat_state(chat_id=chat_id))
    return {
        "status": "ok",
        "chat_id": chat_id,
        "filename": file.filename
    }
    