export type GangRole = 'LEADER' | 'OFFICER' | 'MEMBER';

export interface Gang {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  leaderId: string;
  level: number;
  respect: number;
  money: number;
  maxMembers: number;
  imageUrl: string | null;
  memberCount: number;
}

export interface GangMember {
  id: string;
  playerId: string;
  username: string;
  level: number;
  profession: string;
  role: GangRole;
  isOnline: boolean;
  joinedAt: string;
}
