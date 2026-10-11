export async function sendMessage(credentials, chatId, message) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;

  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || `Ошибка API: ${response.status}`);
  }

  return data;

  
}

export async function receiveNotification(credentials) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;

  const url = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка получения уведомления: ${response.status}`);
  }

  const text = await response.text();

  // Если уведомлений нет, сервер может вернуть пустой ответ.
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text);
}

export async function deleteNotification(credentials, receiptId) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;

  const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Ошибка удаления уведомления: ${response.status}`);
  }

  return response.json();
}

export async function getChats(credentials) {
  const { apiUrl, idInstance, apiTokenInstance } = credentials;

  const url = `${apiUrl}/waInstance${idInstance}/getChats/${apiTokenInstance}`;

  const response = await fetch(url);
  const responseText = await response.text();

  // console.log('GetChats status:', response.status);
  // console.log('GetChats response:', responseText);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${responseText || 'Пустой ответ'}`);
  }

  if (!responseText.trim()) {
    throw new Error(`GREEN-API вернул пустой ответ. HTTP ${response.status}`);
  }

  return JSON.parse(responseText);
}


