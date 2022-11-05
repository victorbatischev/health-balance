//
//  PedometerPlugin.swift
//  App
//
//  Created by Yakubov on 24/10/22.
//

import Capacitor
import CoreMotion

@objc(PedometerPlugin)
public class PedometerPlugin: CAPPlugin {
    
    private let implementation = PedometerPluginImpl.shared
    
    public override func load() {
        super.load()
        
        implementation.delegate = self
    }
    
    @objc func start(_ call: CAPPluginCall) {
        implementation.start()
        call.resolve()
    }
    
    @objc func stop(_ call: CAPPluginCall) {
        implementation.stop()
        call.resolve()
    }
    
    @objc func getSavedData(_ call: CAPPluginCall) {
        call.resolve(implementation.getLastStepsData())
    }
    
    @objc func reset(_ call: CAPPluginCall) {
        implementation.reset()
    }
    
}

extension PedometerPlugin: PedometerPluginDelegate {
    public func didReceiveSteps(data: PluginResultData) {
        let jsonData = try! JSONSerialization.data(withJSONObject: data, options: [])
        let decoded = String(data: jsonData, encoding: .utf8)!
        
        self.bridge?.triggerJSEvent(eventName: "stepEvent",
                                    target: "window", data: decoded)
    }
}
