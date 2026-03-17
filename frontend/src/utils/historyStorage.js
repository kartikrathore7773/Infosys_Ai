import {
  appendMessage as appendMessageToServer,
  createChat as createChatOnServer,
  deleteChat as deleteChatOnServer,
  fetchHistory as fetchHistoryFromServer,
  updateTitle as updateTitleOnServer,
} from "../services/historyService";

const STORAGE_KEY = "creator_chat_history";

function emitHistoryUpdate(newValue) {
  if (typeof window === "undefined") return;

  try {
    const event = new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue,
      storageArea: localStorage,
      url: window.location.href,
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("Failed to dispatch history event", error);
  }
}

function persist(history) {
  const snapshot = JSON.stringify(history);
  localStorage.setItem(STORAGE_KEY, snapshot);
  emitHistoryUpdate(snapshot);
}

function runSyncTask(task) {
  task().catch((error) => {
    console.error("History sync failed", error);
  });
}

/* ================= PUBLIC: INITIAL FETCH ================= */
export async function hydrateHistoryFromServer() {
  try {
    const remoteHistory = await fetchHistoryFromServer();
    if (!Array.isArray(remoteHistory)) return null;

    persist(remoteHistory);
    return remoteHistory;
  } catch (error) {
    console.error("Unable to hydrate history", error);
    return null;
  }
}

/* ================= GET ALL CHATS ================= */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Failed to parse history:", error);
    return [];
  }
}

/* ================= CREATE CHAT IF NOT EXISTS ================= */
export function createChatIfNotExists(chatId, title) {
  const history = getHistory();

  // If chat already exists, return existing chatId
  const existing = history.find((c) => c.chatId === chatId);
  if (existing) return chatId;

  // Create new chat
  const newChatId = chatId || Date.now().toString();
  const newChat = {
    chatId: newChatId,
    title: title || "Untitled chat",
    createdAt: new Date().toISOString(),
    messages: [],
  };

  history.unshift(newChat);
  persist(history);

  runSyncTask(() =>
    createChatOnServer({
      chatId: newChat.chatId,
      title: newChat.title,
      createdAt: newChat.createdAt,
      type: newChat.type,
      messages: newChat.messages,
    }),
  );

  return newChatId;
}

/* ================= SAVE MESSAGE (🔥 FIXED) ================= */
export function saveChatMessage({ chatId, role, content, meta = null }) {
  if (chatId === "__AB_TEST__" || meta?.abTest) {
    return;
  }

  const history = getHistory();
  const chat = history.find((c) => c.chatId === chatId);
  if (!chat) return;

  const message = {
    messageId: Date.now(),
    role,
    content,
    meta,
    createdAt: new Date().toISOString(),
  };

  chat.messages.push(message);
  persist(history);

  runSyncTask(() => appendMessageToServer(chatId, message));
}

/* ================= UPDATE CHAT TITLE ================= */
export function updateChatTitle(chatId, title) {
  if (!title) return;

  const history = getHistory();
  const chat = history.find((c) => c.chatId === chatId);
  if (!chat) return;

  if (chat.title === title) return;

  chat.title = title;
  persist(history);

  runSyncTask(() => updateTitleOnServer(chatId, title));
}

/* ================= GET SINGLE CHAT ================= */
export function getChatById(chatId) {
  return getHistory().find((c) => c.chatId === chatId);
}

/* ================= DELETE SINGLE CHAT ================= */
export function deleteChat(chatId) {
  const updated = getHistory().filter((c) => c.chatId !== chatId);
  persist(updated);
  runSyncTask(() => deleteChatOnServer(chatId));
}

/* ================= CLEAR ALL HISTORY ================= */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  emitHistoryUpdate(null);
}

export function getChatPrimaryType(chat) {
  if (!chat?.messages?.length) return "General";

  const typeCount = {};
  chat.messages.forEach((m) => {
    const t = m.meta?.type;
    if (t) typeCount[t] = (typeCount[t] || 0) + 1;
  });

  const entries = Object.entries(typeCount);
  if (entries.length === 0) return "General";
  if (entries.length === 1) return entries[0][0];

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function createChatFromAB({
  chatId,
  title,
  userPrompt,
  assistantReply,
  type,
}) {
  const history = getHistory();

  const newChatId = chatId || Date.now().toString();
  const newChat = {
    chatId: newChatId,
    title: title || userPrompt.slice(0, 40),
    createdAt: new Date().toISOString(),
    type,
    messages: [
      {
        messageId: Date.now(),
        role: "user",
        content: userPrompt,
        meta: { type },
        createdAt: new Date().toISOString(),
      },
      {
        messageId: Date.now() + 1,
        role: "assistant",
        content: assistantReply,
        meta: { type },
        createdAt: new Date().toISOString(),
      },
    ],
  };

  history.unshift(newChat);
  persist(history);

  runSyncTask(() =>
    createChatOnServer({
      chatId: newChat.chatId,
      title: newChat.title,
      createdAt: newChat.createdAt,
      type: newChat.type,
      messages: newChat.messages,
    }),
  );

  return newChatId;
}
