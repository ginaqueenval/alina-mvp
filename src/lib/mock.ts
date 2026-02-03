export type Creator = {
  username: string;
  displayName: string;
  bio: string;
  priceUsd: number;
  avatarEmoji: string;
};

export type Post = {
  id: string;
  creatorUsername: string;
  caption: string;
  isLocked: boolean;
  createdAt: string;
};

export const creators: Creator[] = [
  {
    username: "luna",
    displayName: "Luna",
    bio: "Late-night vibes. Exclusive posts weekly.",
    priceUsd: 12,
    avatarEmoji: "🌙",
  },
  {
    username: "aria",
    displayName: "Aria",
    bio: "Behind the scenes + daily updates.",
    priceUsd: 9,
    avatarEmoji: "🖤",
  },
  {
    username: "nova",
    displayName: "Nova",
    bio: "Premium content drops. DM-friendly.",
    priceUsd: 15,
    avatarEmoji: "✨",
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    creatorUsername: "luna",
    caption: "New drop — full set available for subscribers only.",
    isLocked: true,
    createdAt: "2026-02-03",
  },
  {
    id: "p2",
    creatorUsername: "aria",
    caption: "Public teaser: what I’m working on this week.",
    isLocked: false,
    createdAt: "2026-02-02",
  },
  {
    id: "p3",
    creatorUsername: "nova",
    caption: "Exclusive video post uploaded. Unlock to view.",
    isLocked: true,
    createdAt: "2026-02-01",
  },
];

export function getCreator(username: string) {
  return creators.find((c) => c.username === username) ?? null;
}

export function getPost(id: string) {
  return posts.find((p) => p.id === id) ?? null;
}
