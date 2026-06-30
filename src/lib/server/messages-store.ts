import { promises as fs } from "fs";
import path from "path";
import {
  platformUsers as seedUsers,
  conversations as seedConversations,
  messageThreads as seedThreads,
  type Conversation,
  type DirectMessage,
  type PlatformUser,
} from "@/lib/mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

type MessagesData = {
  users: PlatformUser[];
  conversations: Conversation[];
  threads: Record<string, DirectMessage[]>;
  conversationIdCounter: number;
  messageIdCounter: number;
};

function initialData(): MessagesData {
  return {
    users: seedUsers,
    conversations: seedConversations,
    threads: seedThreads,
    conversationIdCounter: seedConversations.length,
    messageIdCounter: 100,
  };
}

async function readData(): Promise<MessagesData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as MessagesData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: MessagesData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// 同時書き込みによるファイル競合を避けるための簡易キュー
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
}

export async function getMessagesData() {
  const data = await readData();
  return { users: data.users, conversations: data.conversations, threads: data.threads };
}

export function findOrCreateConversation(userId: string) {
  return enqueue(async () => {
    const data = await readData();
    const user = data.users.find((u) => u.id === userId);
    if (!user) return null;

    let conversation = data.conversations.find((c) => c.type === "dm" && c.userId === userId);
    if (!conversation) {
      data.conversationIdCounter += 1;
      conversation = {
        id: `cv-${data.conversationIdCounter}`,
        type: "dm",
        userId: user.id,
        name: user.name,
        avatarInitial: user.avatarInitial,
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unread: 0,
      };
      data.conversations = [conversation, ...data.conversations];
      data.threads[conversation.id] = [];
      await writeData(data);
    }

    return {
      conversation,
      conversations: data.conversations,
      messages: data.threads[conversation.id] ?? [],
    };
  });
}

export function sendMessage(conversationId: string, input: { text: string; image?: string }) {
  return enqueue(async () => {
    const data = await readData();
    const conversation = data.conversations.find((c) => c.id === conversationId);
    if (!conversation) return null;

    data.messageIdCounter += 1;
    const message: DirectMessage = {
      id: `dm-${data.messageIdCounter}`,
      sender: "me",
      text: input.text,
      image: input.image,
      createdAt: new Date().toISOString(),
    };

    data.threads[conversationId] = [...(data.threads[conversationId] ?? []), message];

    const preview = input.text || (input.image ? "📷 画像を送信しました" : "");
    data.conversations = data.conversations.map((c) =>
      c.id === conversationId ? { ...c, lastMessage: preview, lastMessageAt: message.createdAt } : c
    );

    await writeData(data);
    return { message, conversation: data.conversations.find((c) => c.id === conversationId)! };
  });
}

export function markConversationRead(conversationId: string) {
  return enqueue(async () => {
    const data = await readData();
    let updated: Conversation | undefined;
    data.conversations = data.conversations.map((c) => {
      if (c.id !== conversationId) return c;
      updated = { ...c, unread: 0 };
      return updated;
    });
    if (!updated) return null;
    await writeData(data);
    return updated;
  });
}
