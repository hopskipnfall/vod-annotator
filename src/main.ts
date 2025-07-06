import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const require: any;
const translations = require(`raw-loader!./locale/messages.ja.xlf`);
const localeId = 'ja';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [
      { provide: TRANSLATIONS, useValue: translations },
      { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
      { provide: LOCALE_ID, useValue: localeId }
    ]
  })
  .catch((err) => console.error(err));
