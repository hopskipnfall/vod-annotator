import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Annotations, Memo, MemoKind } from 'src/model';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-memo-list',
  templateUrl: './memo-list.component.html',
  styleUrls: ['./memo-list.component.scss'],
})
export class MemoListComponent implements OnInit {
  @Input() annotations!: Annotations;

  playerReady: Observable<Boolean>;

  // View-only filters; they never affect share links or CSV export.
  showWins = true;
  showLosses = true;
  showMemos = true;

  constructor(private video: VideoService) {
    this.playerReady = video.getReady();
  }

  ngOnInit() {}

  hasKindedMemos(): boolean {
    return this.annotations.memos.some((memo) => memo.kind);
  }

  count(kind?: MemoKind): number {
    return this.annotations.memos.filter((memo) => memo.kind === kind).length;
  }

  isVisible(memo: Memo): boolean {
    switch (memo.kind) {
      case 'win':
        return this.showWins;
      case 'loss':
        return this.showLosses;
      default:
        return this.showMemos;
    }
  }

  allHidden(): boolean {
    return (
      this.annotations.memos.length > 0 &&
      !this.annotations.memos.some((memo) => this.isVisible(memo))
    );
  }

  createMemo() {
    // Otherwise the new note would be created invisibly.
    this.showMemos = true;
    this.annotations.memos.push({
      timestampSeconds: Math.round(this.video.getTime() * 10) / 10,
      message: '',
    });

    // Should probably be using observables and pipes lol.
    this.annotations.memos = this.annotations.memos.sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds
    );
    this.video.pause();
  }

  seekTo(seconds: number) {
    this.video.seekTo(seconds);
    this.video.play();
  }

  removeMemoAtIndex(index: number) {
    this.annotations.memos.splice(index, 1);
  }
}
