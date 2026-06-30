import { promises as fs } from "fs";
import path from "path";
import {
  communities as seedCommunities,
  communityTimeline as seedPosts,
  currentUser,
  type Community,
  type CommunityComment,
  type CommunityPost,
} from "@/lib/mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "community.json");

type CommunityData = {
  communities: Community[];
  posts: CommunityPost[];
  postIdCounter: number;
  commentIdCounter: number;
};

function initialData(): CommunityData {
  return {
    communities: seedCommunities,
    posts: seedPosts,
    postIdCounter: seedPosts.length,
    commentIdCounter: 100,
  };
}

async function readData(): Promise<CommunityData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as CommunityData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: CommunityData): Promise<void> {
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

export async function getCommunityData() {
  const data = await readData();
  return { communities: data.communities, posts: data.posts };
}

export function toggleCommunityJoin(id: string) {
  return enqueue(async () => {
    const data = await readData();
    data.communities = data.communities.map((c) =>
      c.id === id
        ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 }
        : c
    );
    await writeData(data);
    return data.communities;
  });
}

export function createCommunityPost(input: {
  community: string;
  category: string;
  text: string;
  image?: string;
  likes?: number;
}) {
  return enqueue(async () => {
    const data = await readData();
    data.postIdCounter += 1;
    const newPost: CommunityPost = {
      id: `cp-${data.postIdCounter}`,
      community: input.community,
      category: input.category,
      author: currentUser.name,
      avatarInitial: currentUser.avatarInitial,
      text: input.text,
      image: input.image,
      time: "たった今",
      likes: input.likes ?? 0,
      liked: false,
      comments: [],
    };
    data.posts = [newPost, ...data.posts];
    await writeData(data);
    return newPost;
  });
}

export function togglePostLike(postId: string) {
  return enqueue(async () => {
    const data = await readData();
    let updated: CommunityPost | undefined;
    data.posts = data.posts.map((p) => {
      if (p.id !== postId) return p;
      updated = { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      return updated;
    });
    if (!updated) return null;
    await writeData(data);
    return updated;
  });
}

export function addPostComment(postId: string, text: string) {
  return enqueue(async () => {
    const data = await readData();
    data.commentIdCounter += 1;
    const comment: CommunityComment = {
      id: `cmt-${data.commentIdCounter}`,
      author: currentUser.name,
      avatarInitial: currentUser.avatarInitial,
      text,
    };
    let updated: CommunityPost | undefined;
    data.posts = data.posts.map((p) => {
      if (p.id !== postId) return p;
      updated = { ...p, comments: [...p.comments, comment] };
      return updated;
    });
    if (!updated) return null;
    await writeData(data);
    return updated;
  });
}
