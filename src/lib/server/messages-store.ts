import { put, get } from "@vercel/blob";
import {
  platformUsers as seedUsers,
  conversations as seedConversations,
  messageThreads as seedThreads,
  type Conversation,
  type DirectMessage,
  type PlatformUser,
} from "@/lib/mock-data";

// Next.jsのサーバーレス関数はファイルシステムが読み取り専用のため、
// ローカルファイルではなくVercel Blobにメッセージデータを永続化する
const BLOB_PATHNAME = "messages-data.json";

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
    const result = await get(BLOB_PATHNAME, { access: "private", useCache: false });
    if (!result) throw new Error("blob not found");
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as MessagesData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: MessagesData): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
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

/** 外部メッセンジャーから届いた実メッセージを、対応する会話に取り込む（存在しなければユーザー・会話を新規作成） */
export function receiveExternalMessage(input: {
  platform: "line" | "telegram";
  platformUserId: string;
  displayName: string;
  text: string;
}) {
  return enqueue(async () => {
    const data = await readData();
    const userId = `${input.platform}-${input.platformUserId}`;
    const platformLabel = input.platform === "line" ? "LINE" : "Telegram";

    let user = data.users.find((u) => u.id === userId);
    if (!user) {
      user = {
        id: userId,
        name: input.displayName || `${platformLabel}ユーザー`,
        handle: `@${input.platform}`,
        avatarInitial: (input.displayName || platformLabel).slice(0, 1),
        bio: `${platformLabel}から連携中のトーク`,
        platform: input.platform,
        platformUserId: input.platformUserId,
      };
      data.users = [...data.users, user];
    }

    let conversation = data.conversations.find((c) => c.type === "dm" && c.userId === userId);
    if (!conversation) {
      data.conversationIdCounter += 1;
      conversation = {
        id: `cv-${data.conversationIdCounter}`,
        type: "dm",
        userId,
        name: user.name,
        avatarInitial: user.avatarInitial,
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unread: 0,
        platform: input.platform,
      };
      data.conversations = [conversation, ...data.conversations];
      data.threads[conversation.id] = [];
    }

    data.messageIdCounter += 1;
    const message: DirectMessage = {
      id: `dm-${data.messageIdCounter}`,
      sender: "other",
      text: input.text,
      createdAt: new Date().toISOString(),
    };
    data.threads[conversation.id] = [...(data.threads[conversation.id] ?? []), message];
    data.conversations = data.conversations.map((c) =>
      c.id === conversation!.id ? { ...c, lastMessage: input.text, lastMessageAt: message.createdAt, unread: c.unread + 1 } : c
    );

    await writeData(data);
    return { conversation: data.conversations.find((c) => c.id === conversation!.id)!, message };
  });
}

/** 外部連携の会話かどうかを調べ、連携済みなら送信先プラットフォームとユーザーIDを返す */
export function getExternalRecipientForConversation(conversationId: string) {
  return enqueue(async () => {
    const data = await readData();
    const conversation = data.conversations.find((c) => c.id === conversationId);
    if (!conversation || !conversation.platform || !conversation.userId) return null;
    const user = data.users.find((u) => u.id === conversation.userId);
    if (!user?.platformUserId) return null;
    return { platform: conversation.platform, platformUserId: user.platformUserId };
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
