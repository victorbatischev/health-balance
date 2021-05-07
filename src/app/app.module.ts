import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage'

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Health } from '@ionic-native/health/ngx';
import { Media } from '@ionic-native/media/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
//import { FilePath } from '@ionic-native/file-path/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { ConnectivityService } from '../providers/connectivity-service';
import { AlertService } from '../providers/alert-service';
import { CustomerService } from '../providers/customer-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__HealthBalanceDB',
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Health,
    Media,
    Camera,
    Crop,
    FileTransfer,
    IOSFilePicker,
    FileChooser,
    //FilePath,
    BarcodeScanner,
    OneSignal,
    ConnectivityService,
    AlertService,
    CustomerService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
