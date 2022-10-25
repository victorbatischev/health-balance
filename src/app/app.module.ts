import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { HttpClientModule } from '@angular/common/http'
import { IonicStorageModule } from '@ionic/storage'

import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx'
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx'
import { Health } from '@awesome-cordova-plugins/health/ngx'
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx'
import { Media } from '@ionic-native/media/ngx'
import { Camera } from '@ionic-native/camera/ngx'
import { Crop } from '@ionic-native/crop/ngx'
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'
import { FileTransfer } from '@ionic-native/file-transfer/ngx'
import { IOSFilePicker } from '@ionic-native/file-picker/ngx'
import { FileChooser } from '@ionic-native/file-chooser/ngx'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx'
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx'
import { File } from '@ionic-native/file/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'

import { ConnectivityService } from '../providers/connectivity-service'
import { AlertService } from '../providers/alert-service'
import { CustomerService } from '../providers/customer-service'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__HealthBalanceDB',
      driverOrder: ['sqlite', 'websql', 'indexeddb', 'localstorage']
    }),
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Health,
    BackgroundMode,
    AndroidPermissions,
    Media,
    Camera,
    Crop,
    FileTransfer,
    IOSFilePicker,
    FileChooser,
    BarcodeScanner,
    OneSignal,
    Clipboard,
    ConnectivityService,
    AlertService,
    CustomerService,
    PDFGenerator,
    File,
    FileOpener,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
