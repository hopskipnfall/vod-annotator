export interface Memo {
    timestampMs: number;
    message: string;
}

export interface Annotations {
    youtubeId: string;
    memos: Memo[];
}
