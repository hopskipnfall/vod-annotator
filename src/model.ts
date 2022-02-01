export interface Memo {
    timestampSeconds: number;
    message: string;
}

export interface Annotations {
    youtubeId: string;
    memos: Memo[];
}
