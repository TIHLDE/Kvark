import { EventCompact } from 'types/Event';
import { UserBase } from 'types/User';

export type Strike = {
  id: string;
  description: string;
  strike_size: number;
  expires_at: string;
  created_at: string;
  user: UserBase;
  creator: UserBase;
  event: EventCompact;
};
