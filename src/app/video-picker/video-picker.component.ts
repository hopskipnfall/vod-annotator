import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Annotations } from 'src/model';

const URL_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w\d_=\-]+)(?:[?&][^/]*)?$/;
const YT_ID_GROUP_NUMBER = 1;

@Component({
  selector: 'app-video-picker',
  templateUrl: './video-picker.component.html',
  styleUrls: ['./video-picker.component.scss'],
})
export class VideoPickerComponent implements OnInit {
  url: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isValidUrl(): boolean {
    return URL_REGEX.test(this.url);
  }

  launchEditor() {
    const ytid = URL_REGEX.exec(this.url)![YT_ID_GROUP_NUMBER];
    this.router.navigate(['editor'], { queryParams: { ytid } });
  }
}
