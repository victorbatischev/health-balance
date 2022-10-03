import { Injectable } from '@angular/core'

// import { Pedometer } from 'cordova-plugin-pedometer'

@Injectable()
export class PedometerService {
  private pedometer: any

  constructor() {
    this.pedometer = null
  }

  startPedometerUpdates() {
    return new Promise((resolve, reject) => {
      this.pedometer.start(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }

  stopPedometerUpdates() {
    return new Promise((resolve, reject) => {
      this.pedometer.stop(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }

  getTodayStepCount() {
    return new Promise((resolve, reject) => {
      this.pedometer.getTodayStepCount(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }

  getStepCount() {
    return new Promise((resolve, reject) => {
      this.pedometer.getStepCount(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }

  isStepCountingAvailable() {
    return new Promise((resolve, reject) => {
      this.pedometer.deviceCanCountSteps(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }

  getHistory() {
    return new Promise((resolve, reject) => {
      this.pedometer.getHistory(
        (message) => {
          resolve(message)
        },
        () => {
          reject()
        }
      )
    })
  }
}
