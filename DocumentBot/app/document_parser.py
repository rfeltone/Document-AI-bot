from io import BytesIO

from docx import Document
from pypdf import PdfReader

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    normalizeFilename = filename.lower()
    if normalizeFilename.endswith(".txt"):
        return file_bytes.decode("utf-8")
    elif normalizeFilename.endswith(".docx"):
        doc = Document(BytesIO(file_bytes))
        text = "\n".join(paragraph.text for paragraph in doc.paragraphs)
        return text
    elif normalizeFilename.endswith(".pdf"):
        reader = PdfReader(BytesIO(file_bytes))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        return text
    else:
        raise ValueError("неподдерживаемый формат")