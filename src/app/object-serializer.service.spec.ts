import { TestBed } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Annotations } from 'src/model';

import { ObjectSerializerService } from './object-serializer.service';

// Fixtures shared with the rmgr-viewer exporter.
const V2_JSON =
  '["dQw4w9WgXcQ","v2",12.3,"Neutral win > footsie??","w",45,"","l",61.5,"Dropped combo, 日本語",""]';
const V2_BASE64 =
  'WyJkUXc0dzlXZ1hjUSIsInYyIiwxMi4zLCJOZXV0cmFsIHdpbiA+IGZvb3RzaWU/PyIsInciLDQ1LCIiLCJsIiw2MS41LCJEcm9wcGVkIGNvbWJvLCDml6XmnKzoqp4iLCIiXQ==';
const V2_ANNOTATIONS: Annotations = {
  youtubeId: 'dQw4w9WgXcQ',
  memos: [
    { timestampSeconds: 12.3, message: 'Neutral win > footsie??', kind: 'win' },
    { timestampSeconds: 45, message: '', kind: 'loss' },
    { timestampSeconds: 61.5, message: 'Dropped combo, 日本語' },
  ],
};

const V1_BASE64 = 'WyJkUXc0dzlXZ1hjUSIsMTIuMywiSGVsbG8iLDQ1LCJXb3JsZCJd';
const V1_ANNOTATIONS: Annotations = {
  youtubeId: 'dQw4w9WgXcQ',
  memos: [
    { timestampSeconds: 12.3, message: 'Hello' },
    { timestampSeconds: 45, message: 'World' },
  ],
};

describe('ObjectSerializerService', () => {
  let service: ObjectSerializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(ObjectSerializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits v1 when no memo has a kind', () => {
    expect(service.serializeAnnotations(V1_ANNOTATIONS)).toBe(V1_BASE64);
  });

  it('deserializes v1 links', () => {
    expect(service.deserializeAnnotations(V1_BASE64)).toEqual(V1_ANNOTATIONS);
  });

  it('deserializes a v1 link with no memos', () => {
    const empty: Annotations = { youtubeId: 'abc', memos: [] };
    expect(
      service.deserializeAnnotations(service.serializeAnnotations(empty))
    ).toEqual(empty);
  });

  it('emits v2 when some memo has a kind', () => {
    expect(service.serializeAnnotations(V2_ANNOTATIONS)).toBe(V2_BASE64);
  });

  it('deserializes v2 links', () => {
    expect(service.deserializeAnnotations(V2_BASE64)).toEqual(V2_ANNOTATIONS);
  });

  it('fixture base64 decodes to the documented JSON', () => {
    expect(decodeURIComponent(escape(atob(V2_BASE64)))).toBe(V2_JSON);
  });

  it('rejects unknown format markers', () => {
    const payload = btoa(JSON.stringify(['abc', 'v9', 1, 'x', '']));
    expect(() => service.deserializeAnnotations(payload)).toThrow();
  });

  describe('round trip through URL query parsing', () => {
    it('fixture base64 contains +, / and =', () => {
      expect(V2_BASE64).toContain('+');
      expect(V2_BASE64).toContain('/');
      expect(V2_BASE64).toContain('=');
    });

    it('survives encodeURIComponent and the router query parser', () => {
      const url = `/editor?annotations=${encodeURIComponent(V2_BASE64)}`;
      const tree = TestBed.inject(UrlSerializer).parse(url);
      const param = tree.queryParamMap.get('annotations')!;
      expect(param).toBe(V2_BASE64);
      expect(service.deserializeAnnotations(param)).toEqual(V2_ANNOTATIONS);
    });

    it('survives the router when building the in-app share link', () => {
      const router = TestBed.inject(Router);
      const urlSerializer = TestBed.inject(UrlSerializer);
      const tree = router.createUrlTree(['editor'], {
        queryParams: {
          annotations: service.serializeAnnotations(V2_ANNOTATIONS),
        },
      });
      const parsed = urlSerializer.parse(urlSerializer.serialize(tree));
      expect(
        service.deserializeAnnotations(parsed.queryParamMap.get('annotations')!)
      ).toEqual(V2_ANNOTATIONS);
    });
  });
});
