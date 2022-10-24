import {
  enableProdMode,
  Component,
  ViewChildren,
  QueryList
} from '@angular/core'
import { Router } from '@angular/router'
import {
  Platform,
  NavController,
  IonRouterOutlet,
  MenuController,
  ModalController,
  PopoverController,
  AlertController
} from '@ionic/angular'

import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { AlertService } from '../providers/alert-service'

import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx'
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx'
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'

import { ConnectivityService } from '../providers/connectivity-service'

import { Customer } from '../models/customer-model'
import { CustomerService } from '../providers/customer-service'

import * as moment from 'moment'
import 'moment/locale/ru'

enableProdMode()

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  customerData: Customer

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>

  lastTimeBackPress = 0
  timePeriodToExit = 2000
  localStorageKey = 'theme'
  lightTheme = JSON.parse(localStorage.getItem(this.localStorageKey))
  root = document.documentElement
  showSubMenu = false
  currentId: number

  menuItems = [
    { id: 1, title: 'Личный кабинет' },
    { id: 2, title: 'Программы' },
    {
      id: 3,
      title: 'Задания',
      subMenu: [
        { id: 3.1, title: 'Командные', count: 0 },
        { id: 3.2, title: 'Индивидуальные', count: 0 }
      ]
    },
    {
      id: 4,
      title: 'Лидерборд',
      subMenu: [
        { id: 4.1, title: 'Командный', count: 0 },
        { id: 4.2, title: 'Индивидуальный', count: 0 }
      ]
    },
    {
      id: 5,
      title: 'Новости',
      subMenu: [
        { id: 5.1, title: 'Командные', count: 0 }
        // { id: 5.2, title: 'Индивидуальные', count: 0 }
      ]
    },
    { id: 6, title: 'Календарь' },
    { id: 7, title: 'Опросы' },
    {
      id: 8,
      title: 'Индекс здоровья',
      subMenu: [
        { id: 8.1, title: 'Посмотреть предыдущие результаты', count: 0 },
        { id: 8.2, title: 'Пройти опрос', count: 0 },
        { id: 8.3, title: 'Индивидуальный отчёт', count: 0 }
      ]
    },
    { id: 9, title: 'Магазин' },
    { id: 10, title: 'Чат поддержки' },
    { id: 11, title: 'Настройки профиля' },
    { id: 12, title: 'Светлая тема' },
    { id: 13, title: 'Выход' }
  ]

  constructor(
    private platform: Platform,
    private router: Router,
    private navCtrl: NavController,
    private menu: MenuController,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public storage: Storage,
    private alertServ: AlertService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public customerServ: CustomerService,
    private connectivityServ: ConnectivityService,
    private oneSignal: OneSignal,
    // private backgroundMode: BackgroundMode,
    private androidPermissions: AndroidPermissions
  ) {
    this.customerServ.getCustomerData().subscribe((val) => {
      this.customerData = val
    })
    this.initializeApp()
    this.initializeTheme()
  }

  initializeApp() {
    localStorage.setItem(this.localStorageKey, this.lightTheme)
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent()
      this.statusBar.overlaysWebView(false)
      this.splashScreen.hide()

      moment.locale('ru')

      this.storage.get('customerData').then((val) => {
        if (val !== null) {
          this.navCtrl.navigateRoot('portfolio')
        }
      })

      this.oneSignal.startInit(
        '6c585b11-b33a-44f5-8c7b-3ffac2059d19',
        '640598372453'
      )
      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.Notification
      )
      this.oneSignal.getIds().then((ids) => {
        this.storage.set('deviceToken', ids.userId)
      })
      this.oneSignal.handleNotificationReceived().subscribe((message: any) => {
        this.showPushMessage(message.payload.body)
      })
      this.oneSignal.handleNotificationOpened().subscribe((message: any) => {
        this.showPushMessage(message.payload.body)
      })
      this.oneSignal.promptForPushNotificationsWithUserResponse()
      this.oneSignal.promptLocation()
      this.oneSignal.endInit()

      this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION
      )

      // this.backgroundMode.enable()

      if (this.platform.is('android')) {
        this.backButtonEvent()
      }
    })
  }

  async showPushMessage(message) {
    let alert = await this.alertCtrl.create({
      subHeader: message,
      buttons: [
        {
          text: 'OK'
        }
      ]
    })
    return await alert.present()
  }

  menuOpened() {
    if (this.connectivityServ.isOnline()) {
      this.httpClient
        .get(
          this.connectivityServ.apiUrl +
            'menu/info?token=' +
            this.customerData.token
        )
        .subscribe(
          (data: any) => {
            this.menuItems = [
              { id: 1, title: 'Личный кабинет' },
              { id: 2, title: 'Программы' },
              {
                id: 3,
                title: 'Задания',
                subMenu: [
                  {
                    id: 3.1,
                    title: 'Командные',
                    count: data.result.lessons
                  },
                  {
                    id: 3.2,
                    title: 'Индивидуальные',
                    count: data.result.individual_lessons
                  }
                ]
              },
              {
                id: 4,
                title: 'Лидерборд',
                subMenu: [
                  { id: 4.1, title: 'Командный', count: 0 },
                  { id: 4.2, title: 'Индивидуальный', count: 0 }
                ]
              },
              {
                id: 5,
                title: 'Новости',
                subMenu: [
                  { id: 5.1, title: 'Командные', count: data.result.team_news }
                  // { id: 5.2, title: 'Индивидуальные', count: 0},
                ]
              },
              { id: 6, title: 'Календарь' },
              { id: 7, title: 'Опросы' },
              {
                id: 8,
                title: 'Индекс здоровья',
                subMenu: [
                  {
                    id: 8.1,
                    title: 'Посмотреть предыдущие результаты',
                    count: 0
                  },
                  { id: 8.2, title: 'Пройти опрос', count: 0 },
                  { id: 8.3, title: 'Индивидуальный отчёт', count: 0 }
                ]
              },
              { id: 9, title: 'Магазин' },
              { id: 10, title: 'Чат поддержки' },
              { id: 11, title: 'Настройки профиля' },
              { id: 12, title: 'Светлая тема' },
              { id: 13, title: 'Выход' }
            ]
          },
          (error) => {
            console.log(error)
          }
        )
    } else {
      this.alertServ.showToast('Нет соединения с сетью')
    }
  }

  closeMenu() {
    this.menu.close()
  }

  changeTheme() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(!this.lightTheme))
    this.lightTheme = JSON.parse(localStorage.getItem(this.localStorageKey))
    this.initializeTheme()
  }

  initializeTheme() {
    if (this.lightTheme) {
      this.root.style.setProperty('--backgroundMain', '#f4f3f3')
      this.root.style.setProperty('--backgroundContent', '#fff')
      this.root.style.setProperty('--colorBlack', '#fff')
      this.root.style.setProperty('--backgroundCalendar', '#fff')
      this.root.style.setProperty('--backgroundChat', '#fff')
      this.root.style.setProperty('--backgroundPreviewBtn', '#2669CD')
      this.root.style.setProperty('--colorPreviewBtn', '#fff')
      this.root.style.setProperty('--colorBtnLink', '#7A7A7A')
      this.root.style.setProperty('--colorMain', '#000')
      this.root.style.setProperty('--colorCaption', '#000')
      this.root.style.setProperty('--borderColor', '#E4E4E4')
      this.root.style.setProperty('--backgroundGray', '#e4e4e4')
      this.root.style.setProperty('--colorTabStatistic', '#7A7A7A')
      this.root.style.setProperty('--colorPlatform', '#7A7A7A')
      this.root.style.setProperty('--activeBackground', '#2669CD')
      this.root.style.setProperty('--colorBlue', '#2669CD')
      this.root.style.setProperty('--backgroundTransitionBtn', '#E4E4E4')
      this.root.style.setProperty('--backgroundButtonPush', '#2669CD')
      this.root.style.setProperty('--grayGradient', '#2669CD')
      this.root.style.setProperty('--filter', 'invert(0)')
      this.root.style.setProperty('--filterInvert', 'invert(1)')
      this.root.style.setProperty('--colorSelect', '#000')
      this.root.style.setProperty('--colorCaptionPreview', '#2e2e2e')
    } else {
      this.root.style.setProperty('--backgroundMain', defaultStatus)
      this.root.style.setProperty('--backgroundContent', defaultStatus)
      this.root.style.setProperty('--activeBackground', defaultStatus)
      this.root.style.setProperty('--colorMain', defaultStatus)
      this.root.style.setProperty('--colorBlack', defaultStatus)
      this.root.style.setProperty('--colorBlue', defaultStatus)
      this.root.style.setProperty('--backgroundTransitionBtn', defaultStatus)
      this.root.style.setProperty('--colorCaption', defaultStatus)
      this.root.style.setProperty('--colorTabStatistic', defaultStatus)
      this.root.style.setProperty('--colorPlatform', defaultStatus)
      this.root.style.setProperty('--borderColor', defaultStatus)
      this.root.style.setProperty('--colorBtnLink', defaultStatus)
      this.root.style.setProperty('--backgroundButtonPush', defaultStatus)
      this.root.style.setProperty('--backgroundCalendar', defaultStatus)
      this.root.style.setProperty('--filter', defaultStatus)
      this.root.style.setProperty('--backgroundGray', defaultStatus)
      this.root.style.setProperty('--backgroundChat', defaultStatus)
      this.root.style.setProperty('--backgroundPreviewBtn', defaultStatus)
      this.root.style.setProperty('--filterInvert', defaultStatus)
      this.root.style.setProperty('--grayGradient', defaultStatus)
      this.root.style.setProperty('--colorSelect', defaultStatus)
      this.root.style.setProperty('--colorCaptionPreview', defaultStatus)
      this.root.style.setProperty('--colorPreviewBtn', defaultStatus)
    }
  }

  isSameItem(id): boolean {
    return this.currentId === id
  }

  clickMenu(id, idx) {
    if (
      typeof this.menuItems[idx].subMenu == 'undefined' ||
      +id == 5.3 ||
      +id == 8.3
    ) {
      this.menu.close()
      switch (+id) {
        case 1:
          this.navCtrl.navigateForward('portfolio')
          break
        case 2:
          this.navCtrl.navigateForward(
            'program-name/' + this.customerData.platform_id
          )
          break
        case 3.1:
          //this.navCtrl.navigateForward('group-task/0');
          this.navCtrl.navigateForward('tasks/0')
          break
        case 3.2:
          this.navCtrl.navigateForward('individual-task')
          break
        case 4.1:
          this.navCtrl.navigateForward('group-leaderboard')
          break
        case 4.2:
          this.navCtrl.navigateForward('individual-leaderboard')
          break
        case 5.1:
          this.navCtrl.navigateForward('team-news')
          break
        case 5.2:
          this.navCtrl.navigateForward('individual-news')
          break
        case 5.3:
          this.navCtrl.navigateForward('add-news')
          break
        case 6:
          this.navCtrl.navigateForward('calendar')
          break
        case 7:
          this.navCtrl.navigateForward('question')
          break
        case 8.1:
          this.navCtrl.navigateForward('health-index-results')
          break
        case 8.2:
          this.navCtrl.navigateForward('health-index')
          break
        case 8.3:
          this.navCtrl.navigateForward('health-index-report')
          break
        case 9:
          this.navCtrl.navigateForward('store')
          break
        case 10:
          //this.navCtrl.navigateForward('chat');
          this.navCtrl.navigateForward('support')
          break
        case 11:
          this.navCtrl.navigateForward('portfolio-2')
          break
        case 12:
          this.changeTheme()
          break
        case 13:
          this.doLogout()
          break
      }
    } else {
      this.currentId = id
      this.showSubMenu = !this.showSubMenu
      this.isSameItem(id)
    }
  }

  async doLogout() {
    let prompt = await this.alertCtrl.create({
      subHeader: 'Вы уверены, что хотите выйти из учетной записи?',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Выйти',
          handler: () => {
            this.customerServ.clearData()
            this.menu.close()
            this.navCtrl.navigateRoot('sign-in')
          }
        }
      ]
    })
    return await prompt.present()
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      // close popover
      try {
        const element = await this.popoverCtrl.getTop()
        if (typeof element != 'undefined') {
          element.dismiss()
          return
        }
      } catch (error) {
        console.log(error)
      }

      // close modal
      try {
        const element = await this.modalCtrl.getTop()
        if (typeof element != 'undefined') {
          element.dismiss()
          return
        }
      } catch (error) {
        console.log(error)
      }

      var show = true

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          show = false
          outlet.pop()
        } else if (this.router.url === '/portfolio' && show === true) {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            navigator['app'].exitApp() // work in ionic 4
          } else {
            this.alertServ.showToast('Нажмите ещё раз для выхода')
            this.lastTimeBackPress = new Date().getTime()
          }
        }
      })
    })
  }
}
