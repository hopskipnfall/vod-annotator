import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { EditorViewComponent } from './editor-view.component';
import { TimestampPipe } from '../timestamp.pipe';

describe('EditorViewComponent', () => {
  let component: EditorViewComponent;
  let fixture: ComponentFixture<EditorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EditorViewComponent],
      providers: [
        TimestampPipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({ ytid: 'abc' }) },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the video id from the ytid query param', () => {
    expect(component.annotations.youtubeId).toBe('abc');
    expect(component.annotations.memos).toEqual([]);
  });
});
