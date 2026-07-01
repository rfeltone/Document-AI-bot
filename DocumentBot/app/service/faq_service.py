from app.faq.faq_data import FAQ_ITEMS 


def search_faq(question: str) -> str|None:
    question = question.strip().lower()
