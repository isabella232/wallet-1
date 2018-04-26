/* tslint:disable */
import { TestBed, getTestBed, inject, async } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppProvider } from './app';
import { Logger } from '../../providers/logger/logger';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateFakeLoader
} from '@ngx-translate/core';
import { LanguageProvider } from '../../providers/language/language';
import { ConfigProvider } from '../../providers/config/config';
import { PersistenceProvider } from '../../providers/persistence/persistence';
import { PlatformProvider } from '../platform/platform';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

import * as appTemplate from './../../../app-template/bitpay/appConfig.json';

describe('AppProvider', () => {
  let injector: TestBed;
  let service: AppProvider;
  let httpMock: HttpTestingController;
  let urls = ['assets/appConfig.json', 'assets/externalServices.json'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        AppProvider,
        Logger,
        LanguageProvider,
        ConfigProvider,
        PersistenceProvider,
        PlatformProvider,
        Platform,
        File
      ]
    });

    injector = getTestBed();
    service = injector.get(AppProvider);
    httpMock = injector.get(HttpTestingController);
  });

  it('should load', () => {
    service.load().then();
    httpMock.expectOne(urls[1]).flush({});
    httpMock.expectOne(urls[0]).flush(appTemplate);
  });

  it('should catch an error when loading fails', done => {
    service.config.load = (): Promise<any> => {
      let prom = new Promise((resolve, reject) => {
        reject('test rejection');
      });
      return prom;
    };

    service.load().catch(() => {
      done();
    });
  });
});
