import { Injectable } from '@angular/core';
import { Annotations, MemoKind } from 'src/model';

const V2_MARKER = 'v2';
const KIND_TO_CODE: Record<MemoKind, string> = { win: 'w', loss: 'l' };
const CODE_TO_KIND: Record<string, MemoKind | undefined> = {
  w: 'win',
  l: 'loss',
};

@Injectable({
  providedIn: 'root',
})
export class ObjectSerializerService {
  constructor() {}

  // https://stackoverflow.com/a/30106551/2875073
  private b64EncodeUnicode(str: string) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }

  // https://stackoverflow.com/a/30106551/2875073
  private b64DecodeUnicode(str: string) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  /**
   * v1: [youtubeId, ts, msg, ts, msg, ...]
   * v2: [youtubeId, "v2", ts, msg, kind, ts, msg, kind, ...] with kind "w", "l" or "".
   * v1 is emitted unless some memo has a kind, so ordinary links stay unchanged.
   */
  serializeAnnotations(annotations: Annotations): string {
    const hasKinds = annotations.memos.some((memo) => memo.kind);
    const simplified = hasKinds
      ? [
          annotations.youtubeId,
          V2_MARKER,
          ...annotations.memos.flatMap((memo) => [
            memo.timestampSeconds,
            memo.message,
            memo.kind ? KIND_TO_CODE[memo.kind] : '',
          ]),
        ]
      : [
          annotations.youtubeId,
          ...annotations.memos.flatMap((memo) => [
            memo.timestampSeconds,
            memo.message,
          ]),
        ];
    return this.b64EncodeUnicode(JSON.stringify(simplified));
  }

  deserializeAnnotations(serialized: string): Annotations {
    const parsed: (string | number)[] = JSON.parse(
      this.b64DecodeUnicode(serialized)
    );

    const annotations: Annotations = {
      youtubeId: parsed[0] as string,
      memos: [],
    };

    // A v1 payload always has a number (or nothing) at index 1.
    if (typeof parsed[1] === 'string') {
      if (parsed[1] !== V2_MARKER) {
        throw new Error(`Unsupported annotations format: ${parsed[1]}`);
      }
      for (let i = 2; i + 2 < parsed.length; i += 3) {
        const kind = CODE_TO_KIND[parsed[i + 2] as string];
        annotations.memos.push({
          timestampSeconds: parsed[i] as number,
          message: parsed[i + 1] as string,
          ...(kind ? { kind } : {}),
        });
      }
      return annotations;
    }

    for (let i = 1; i + 1 < parsed.length; i += 2) {
      annotations.memos.push({
        timestampSeconds: parsed[i] as number,
        message: parsed[i + 1] as string,
      });
    }
    return annotations;
  }
}
