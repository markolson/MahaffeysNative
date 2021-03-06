/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppHub.h"
#import "AppDelegate.h"

#import "RCTBridge.h"
#import "RCTJavaScriptLoader.h"
#import "RCTRootView.h"

@interface AppDelegate() <RCTBridgeDelegate, UIAlertViewDelegate>

@end

@implementation AppDelegate {
  RCTBridge *_bridge;
}

- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AppHub setApplicationID:@"TMBdd9PK8YQ7JUjR6I01"];
  BOOL debugIsEnabled = [[NSUserDefaults standardUserDefaults] boolForKey:@"APPHUB_DEBUG"];
  NSLog(@"Debug enabled: %d", debugIsEnabled);
  [[AppHub buildManager] setDebugBuildsEnabled:debugIsEnabled];
  
  _bridge = [[RCTBridge alloc] initWithDelegate:self
                                  launchOptions:launchOptions];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:_bridge
                                                   moduleName:@"MahaffeysReactNative"
                                            initialProperties:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Register a callback for when a new build becomes available.
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(newBuildDidBecomeAvailable:)
                                               name:AHBuildManagerDidMakeBuildAvailableNotification
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(defaultsChanged:)
                                               name:NSUserDefaultsDidChangeNotification
                                             object:nil];
  
  return YES;
  
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
{
  NSURL *sourceURL;
  
  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ react-native start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */
  
  //sourceURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  
  /**
   * OPTION 2 - AppHub
   *
   * Load cached code and images from AppHub. Use this when deploying to test
   * users and the App Store.
   *
   * Make sure to re-generate the static bundle by navigating to your Xcode project
   * folder and running
   *
   * $ react-native bundle --entry-file index.ios.js --platform ios --dev true --bundle-output iOS/main.jsbundle
   *
     */
  AHBuild *build = [[AppHub buildManager] currentBuild];
  sourceURL = [build.bundle URLForResource:@"main"
                             withExtension:@"jsbundle"];
   

  
  return sourceURL;
}

- (void)loadSourceForBridge:(RCTBridge *)bridge
                  withBlock:(RCTSourceLoadBlock)loadCallback
{
  [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge]
                            onComplete:loadCallback];
}

#pragma mark - NSNotificationCenter

-(void) newBuildDidBecomeAvailable:(NSNotification *)notification {
  // Show an alert view when a new build becomes available. The user can choose to "Update" the app, or "Cancel".
  // If the user presses "Cancel", their app will update when they close the app.
  
  AHBuild *build = notification.userInfo[AHBuildManagerBuildKey];
  NSString *alertMessage = [NSString stringWithFormat:@"%@", build.buildDescription];
  
  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Update! 🎉"
                                                  message:alertMessage
                                                 delegate:self
                                        cancelButtonTitle:@"Cancel"
                                        otherButtonTitles:@"Update", nil];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    // Show the alert on the main thread.
    [alert show];
  });
}

- (void)defaultsChanged:(NSNotification *)notification {
  // Get the user defaults
  NSUserDefaults *defaults = (NSUserDefaults *)[notification object];
  [[AppHub buildManager] setDebugBuildsEnabled:(BOOL)[defaults objectForKey:@"APPHUB_DEBUG"]];
  
  NSLog(@"Whoa I saw a change %@", [defaults objectForKey:@"APPHUB_DEBUG"]);
}

#pragma mark - UIAlertViewDelegate

-(void) alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (buttonIndex == 1) {
    // The user pressed "update".
    [_bridge reload];
  }
}

@end
