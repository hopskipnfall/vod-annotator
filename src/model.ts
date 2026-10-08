export type MemoKind = 'win' | 'loss';

export interface Memo {
  timestampSeconds: number;
  message: string;
  /** Absent for ordinary user memos. */
  kind?: MemoKind;
}

export interface Annotations {
  youtubeId: string;
  memos: Memo[];
}
