import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Annotations } from 'src/model';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {
  encodedMessage! : Annotations;

  constructor(route: ActivatedRoute, router: Router) {
    if (route.snapshot.paramMap.keys.includes('encodedMessage')) {
      this.encodedMessage = JSON.parse(atob(route.snapshot.paramMap.get('encodedMessage')!)) as Annotations;
    } else if (route.snapshot.queryParamMap.has('ytid')) {
      const youtubeId = route.snapshot.queryParamMap.get('ytid')!;
      const encodedMessage: Annotations = {
        youtubeId,
        memos: [],
      };
      // TODO: This might result in strings that are way too long, or give inconsistent parameter names but it works for now.
      router.navigate(['editor', btoa(JSON.stringify(encodedMessage))]);
    }
  }

  ngOnInit(): void {
  }

}
