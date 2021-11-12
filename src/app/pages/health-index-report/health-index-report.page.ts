import { Component } from '@angular/core'
import { NavController, AlertController } from '@ionic/angular'

import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { ConnectivityService } from '../../../providers/connectivity-service'
import { AlertService } from '../../../providers/alert-service'

import { Customer } from '../../../models/customer-model'

import { DomSanitizer } from '@angular/platform-browser'

import { PDFGenerator } from '@ionic-native/pdf-generator/ngx'

import { File } from '@ionic-native/file/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'

@Component({
  selector: 'app-health-index-report',
  templateUrl: './health-index-report.page.html',
  styleUrls: ['./health-index-report.page.scss']
})
export class HealthIndexReportPage {
  customerData: Customer = {
    token: '',
    name: '',
    role: 0,
    team_id: 0,
    is_captain: false,
    phone: '',
    email: '',
    password: '',
    team: '',
    establishment: ''
  }

  result: any

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    public file: File,
    private fileOpener: FileOpener,
    private pdfGenerator: PDFGenerator,
    private connectivityServ: ConnectivityService,
    private alertServ: AlertService,
    protected sanitizer: DomSanitizer
  ) {
    this.loadResults()
  }

  loadResults() {
    this.storage.get('customerData').then((val) => {
      this.customerData = val
      if (this.connectivityServ.isOnline()) {
        this.httpClient
          .get(
            this.connectivityServ.apiUrl +
              'questionary/recommendation?token=' +
              this.customerData.token
          )
          .subscribe(
            (data: any) => {
              this.result = data
            },
            (error) => {
              console.log(error)
            }
          )
      } else {
        this.alertServ.showToast('Нет соединения с сетью')
      }
    })
  }

  writeFile(fileName: string, fileBlob: any) {
    let fs = this.file.dataDirectory
    let options = {
      replace: true
    }
    this.file.writeFile(fs, fileName, fileBlob, options).then((entry) => {
      if (entry.nativeURL) {
        this.fileOpener
          .open(entry.nativeURL, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch((e) => console.log('Error opening file', e))
      }
    })
  }

  downloadReport() {
    // генерируем PDF из отчёта
    this.pdfGenerator
      .fromData(this.result, { documentSize: 'A4', type: 'base64' })
      .then((base64) => {
        // скачиваем PDF на телефон
        this.writeFile(
          'report.pdf',
          this.b64toBlob(base64, 'application/pdf', 512)
        )
      })
      .catch((err) => this.alertServ.showToast('error' + err))
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || ''
    sliceSize = sliceSize || 512

    var byteCharacters = atob(b64Data)
    var byteArrays = []

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize)

      var byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      var byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    var blob = new Blob(byteArrays, { type: contentType })
    return blob
  }
}
