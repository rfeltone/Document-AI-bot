const BACKEND_URL = "http://127.0.0.1:8000/chat/ask";
const UPLOAD_URL = "http://127.0.0.1:8000/documents/upload";



export async function askBackend(chatId: number | string, question: string) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: String(chatId),
      question,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`askBackend failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { answer: string };
  return data.answer;
}

export async function uploadFileToBackend(
  chatId: number | string,
  fileBytes: ArrayBuffer    ,
  filename: string
) {
  const formData = new FormData();
  formData.append("chat_id", String(chatId));
  formData.append("file", new Blob([fileBytes]), filename);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`uploadFileToBackend failed: ${response.status} ${text}`);
  }
}