import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Annotations } from 'src/model';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnInit {
  annotations!: Annotations;

  constructor(route: ActivatedRoute) {
    if (route.snapshot.paramMap.keys.includes('encodedMessage')) {
      this.annotations = JSON.parse(atob(route.snapshot.paramMap.get('encodedMessage')!)) as Annotations;
    }
  }

  ngOnInit(): void {
  }
}
