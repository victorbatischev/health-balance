//
//  PedometerPlugin.m
//  App
//
//  Created by Yakubov on 24/10/22.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PedometerPlugin, "PedometerPlugin",
           CAP_PLUGIN_METHOD(start, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(reset, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getSavedData, CAPPluginReturnPromise);
)
