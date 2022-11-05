//
//  PedometerPluginImpl.swift
//  App
//
//  Created by Yakubov on 24/10/22.
//

import CoreMotion
import Capacitor

public protocol PedometerPluginDelegate: AnyObject {
    func didReceiveSteps(data: PluginResultData)
}

public enum PedometerState: Int {
    case STOPPED = 0
    case STARTING = 1
    case RUNNING = 2
    case ERROR_FAILED_TO_START = 3
    case ERROR_NO_SENSOR_FOUND = 4
}

public class PedometerPluginImpl {
    
    public static let shared = PedometerPluginImpl()
    public var delegate: PedometerPluginDelegate?
    
    private var state: PedometerState = .STOPPED
    private var startSteps = 0
    private var startTimestamp = 0
    
    private let activityManager = CMMotionActivityManager()
    private let pedometer = CMPedometer()
    
    private init() {
        
        let timezone = TimeZone.current
        let seconds = TimeInterval(timezone.secondsFromGMT(for: Date()))
        let date = Date(timeInterval: seconds, since: Date())
        let midnight = Date(timeInterval: seconds, since: Date().midnight)
        
        pedometer.queryPedometerData(from: midnight, to: date) { data, error in
            if let data = data {
                self.startTimestamp = Int(data.startDate.timeIntervalSince1970)
                self.startSteps = Int(truncating: data.numberOfSteps)
                
                print("start: \(data.startDate) \nend: \(data.endDate)")
                print("number of steps: \(data.numberOfSteps)")
            }
        }
    }
    
    public func start() {
        activityManager.startActivityUpdates(to: OperationQueue.main) { (activity: CMMotionActivity?) in
            guard let activity = activity else { return }
            DispatchQueue.main.async {
                if activity.stationary {
                    print("Stationary")
                } else if activity.walking {
                    print("Walking")
                } else if activity.running {
                    print("Running")
                } else if activity.automotive {
                    print("Automotive")
                }
            }
        }
        
        if CMPedometer.isStepCountingAvailable() {
            let startDate = Date()
            self.startTimestamp = Int(startDate.timeIntervalSince1970)
            pedometer.startUpdates(from: startDate) { pedometerData, error in
                guard let pedometerData = pedometerData, error == nil, self.state == .STOPPED else { return }
                
                let steps = pedometerData.numberOfSteps.intValue + self.startSteps
                let jsdata = self.createJsData(steps: steps)
                self.delegate?.didReceiveSteps(data: jsdata)
            }
        }
    }
    
    public func getLastStepsData() -> PluginResultData {
        let timezone = TimeZone.current
        let seconds = TimeInterval(timezone.secondsFromGMT(for: Date()))
        let date = Date(timeInterval: seconds, since: Date())
        let midnight = Date(timeInterval: seconds, since: Date().midnight)
        
        var resultData: PluginResultData = [:]
        
        pedometer.queryPedometerData(from: midnight, to: date) { data, error in
            if let data = data {
                resultData["endDate"] = data.endDate.timeIntervalSince1970
                resultData["startDate"] = data.startDate.timeIntervalSince1970
                resultData["numberOfSteps"] = data.numberOfSteps
                
                self.delegate?.didReceiveSteps(data: resultData)
                print("start: \(data.startDate) \nend: \(data.endDate)")
                print("number of steps: \(data.numberOfSteps)")
            }
        }
        
        
        return resultData
    }
    
    public func stop() {
        self.state = .STOPPED
        pedometer.stopUpdates()
    }
    
    public func reset() {
        stop()
        startTimestamp = 0
        startSteps = 0
    }

    private func createJsData(steps: Int) -> PluginResultData {
        var jsobject = PluginResultData()
        jsobject["numberOfSteps"] = steps
        jsobject["endDate"] = Date().timeIntervalSince1970
        jsobject["startDate"] = self.startTimestamp
        return jsobject
    }
}

extension Date {
    func localString(dateStyle: DateFormatter.Style = .medium,
      timeStyle: DateFormatter.Style = .medium) -> String {
        return DateFormatter.localizedString(
          from: self,
          dateStyle: dateStyle,
          timeStyle: timeStyle)
    }

    var midnight:Date{
        let cal = Calendar(identifier: .gregorian)
        return cal.startOfDay(for: self)
    }
}
