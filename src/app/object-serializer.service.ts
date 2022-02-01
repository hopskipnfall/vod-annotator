import { Injectable } from '@angular/core';
import { Annotations } from 'src/model';

@Injectable({
  providedIn: 'root'
})
export class ObjectSerializerService {

  constructor() { }

  // https://stackoverflow.com/a/30106551/2875073
  private b64EncodeUnicode(str: string) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }

  // https://stackoverflow.com/a/30106551/2875073
  private b64DecodeUnicode(str: string) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  serializeAnnotations(annotations: Annotations): string {
    const simplified =
      [annotations.youtubeId, ...annotations.memos.flatMap(memo => [memo.timestampMs, memo.message])];
    return this.b64EncodeUnicode(JSON.stringify(simplified));
  }

  deserializeAnnotations(serialized: string): Annotations {
    const parsed: (string | number)[] = JSON.parse(this.b64DecodeUnicode(serialized));

    const annotations: Annotations = {
      youtubeId: parsed[0] as string,
      memos: [],
    };

    for (let i = 1; i + 1 < parsed.length; i += 2) {
      annotations.memos.push({
        timestampMs: parsed[i] as number,
        message: parsed[i + 1] as string,
      });
    }
    return annotations;
  }
}
