import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { Annotations } from 'src/model';
import { ObjectSerializerService } from '../object-serializer.service';
import { VideoService } from '../video.service';
import { saveAs } from 'file-saver';
import { TimestampPipe } from '../timestamp.pipe';
import { MemoListComponent } from '../memo-list/memo-list.component';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const COMMA = ',';
const PERIOD = '.';
const SPACE = ' ';
const K = 'k';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss'],
})
export class EditorViewComponent implements OnInit {
  @ViewChild('memoList') memoList!: MemoListComponent;

  selectedQualityLevel?: YT.SuggestedVideoQuality;

  annotations!: Annotations;

  playerWidth = 400;
  singleColumnMode = false;

  constructor(
    private video: VideoService,
    route: ActivatedRoute,
    private router: Router,
    private urlSerializer: UrlSerializer,
    private objectSerializer: ObjectSerializerService,
    private clipboard: Clipboard,
    private timestamp: TimestampPipe,
    private location: Location
  ) {
    if (route.snapshot.queryParamMap.has('ytid')) {
      this.annotations = {
        youtubeId: route.snapshot.queryParamMap.get('ytid') || '',
        memos: [],
      };
    } else if (route.snapshot.queryParamMap.has('annotations')) {
      this.annotations = this.objectSerializer.deserializeAnnotations(
        route.snapshot.queryParamMap.get('annotations')!
      );
    }

    // Periodically if the iframe has focus and take it back so we can control what the arrow keys do.
    setInterval(() => {
      if (document.activeElement?.tagName === 'IFRAME') {
        console.info(
          'YouTube iframe is in focus, blurring to maintain keyboard shortcuts'
        );
        (document.activeElement as HTMLElement).blur();
      }
      // 3 seconds is slow enough where users can change quality if they're quick. Unfortunately YT removed the ability to set quality via the JS API.
    }, 3000);
  }

  ngOnInit(): void {
    this.onResize();

    this.video.getReady().subscribe((ready) => {
      if (!ready) return;

      this.video.getSelectedQualityLevel().subscribe((level) => {
        this.selectedQualityLevel = level;
      });
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (document.activeElement?.tagName === 'TEXTAREA') {
      // Ignore inputs when typing into something.
      return;
    }

    const fps60QualityLevels: YT.SuggestedVideoQuality[] = [
      'hd1080',
      'hd720',
      // No idea what this means, but let's err on the side of 60fps.
      'default',
    ];
    const frameLength = fps60QualityLevels.includes(this.selectedQualityLevel!)
      ? 1 / 60
      : 1 / 30;

    const key = event.key;
    if (key === ARROW_LEFT) {
      this.video.seekTo(Math.max(this.video.getTime() - 2, 0));
    } else if (key === ARROW_RIGHT) {
      this.video.seekTo(this.video.getTime() + 2);
    } else if (key === COMMA) {
      this.video.seekTo(this.video.getTime() - frameLength);
      this.video.pause();
    } else if (key === PERIOD) {
      this.video.seekTo(this.video.getTime() + frameLength);
      this.video.pause();
    } else if (key === SPACE || key === K) {
      this.togglePlayback();

      // Prevent spacebar from scrolling the page.
      event.preventDefault();
    }
  }

  goForwardSeconds(seconds: number) {
    this.video.seekTo(this.video.getTime() + seconds);
  }

  togglePlayback() {
    const state = this.video.getPlayerState();
    if (
      state === YT.PlayerState.BUFFERING ||
      state === YT.PlayerState.PLAYING
    ) {
      this.video.pause();
    } else if (
      state === YT.PlayerState.PAUSED ||
      state === YT.PlayerState.UNSTARTED ||
      state === YT.PlayerState.CUED
    ) {
      this.video.play();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.singleColumnMode = window.innerWidth < 768;
    this.playerWidth = window.innerWidth * (this.singleColumnMode ? 0.9 : 0.62);
  }

  createShareLink() {
    const thingy = this.router.createUrlTree(['editor'], {
      queryParams: {
        annotations: this.objectSerializer.serializeAnnotations(
          this.annotations
        ),
      },
    });
    const path =
      location.origin +
      this.location.prepareExternalUrl(this.urlSerializer.serialize(thingy));
    console.log('serialized path', path);
    if (this.clipboard.copy(path)) {
      // TODO: Show a toast.
      // TODO: Give a warning if the length is over 2K characters that it might not work in all browsers.
    }
  }

  saveAsCsv() {
    // This is extremely stupid but to escape a double quote you.. do a second double quote.
    // https://stackoverflow.com/a/17808731/2875073
    const sanitize = (s: string) => s.replace(/"/g, '""');

    let output = 'Timestamp,Comment,YouTube Link\n';
    for (let i = 0; i < this.annotations.memos.length; i++) {
      const memo = this.annotations.memos[i];
      const timestampString = this.timestamp.transform(memo.timestampSeconds);
      const url = `https://www.youtube.com/watch?v=${
        this.annotations.youtubeId
      }&t=${Math.floor(memo.timestampSeconds)}s`;
      output += `"${timestampString}","${sanitize(memo.message)}","${url}"\n`;
    }

    saveAs(
      new Blob([output], { type: 'text/csv;charset=utf-8' }),
      'vod_annotations.csv'
    );
  }

  addNote() {
    this.memoList.createMemo();
  }
}
