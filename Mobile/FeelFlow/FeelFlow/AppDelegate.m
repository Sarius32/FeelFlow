//
//  AppDelegate.m
//  FeelFlow
//
//  Created by pc-222 on 2024/2/18.
//

#import "AppDelegate.h"
#import <UserNotifications/UserNotifications.h>
#import "HealthManager.h"

@interface AppDelegate ()<UNUserNotificationCenterDelegate>

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    //设置本地通知
    UNUserNotificationCenter * center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center requestAuthorizationWithOptions:UNAuthorizationOptionAlert | UNAuthorizationOptionBadge | UNAuthorizationOptionSound completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            // 注册成功
            
            //发送心情通知
            [self scheduleFeelNotifications];
            
            //发送睡眠通知
            [self scheduleSleepyNotifications];
            
        }else{
            // 注册失败
        }
    }];
    
    return YES;
}

- (void)scheduleFeelNotifications {
    
    UNUserNotificationCenter * center = [UNUserNotificationCenter currentNotificationCenter];
           // 通知内容
           UNMutableNotificationContent * content = [[UNMutableNotificationContent alloc]init];
           content.title = @"心情";
           content.subtitle = @"好-坏";
           content.body = @"在 1-6 之间输入一个值";
           // 默认铃声
           content.sound = [UNNotificationSound defaultSound];
           // 自定义铃声
           content.sound = [UNNotificationSound soundNamed:@"Define_Sound"];
           // 角标
           content.badge = @1;
           
           // 设置多长时间之后发送
           NSTimeInterval time = [[NSDate dateWithTimeIntervalSinceNow:2*60*60] timeIntervalSinceNow];
           UNTimeIntervalNotificationTrigger * trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:time repeats:YES];
    
           // id：便于以后移除、更新 指定通知
           NSString * noticeId = @"111";
           // 通知请求
           UNNotificationRequest * request = [UNNotificationRequest requestWithIdentifier:noticeId content:content trigger:trigger];
           // 添加通知请求
           [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
               if (error == nil) {
                   NSLog(@"心情推送成功");
               }
           }];
}

- (void)scheduleSleepyNotifications {
    
    UNUserNotificationCenter * center = [UNUserNotificationCenter currentNotificationCenter];
           // 通知内容
           UNMutableNotificationContent * content = [[UNMutableNotificationContent alloc]init];
           content.title = @"睡眠";
           content.subtitle = @"时间";
           content.body = @"请输入睡眠时间";
           // 默认铃声
           content.sound = [UNNotificationSound defaultSound];
           // 自定义铃声
           content.sound = [UNNotificationSound soundNamed:@"Define_Sound"];
           // 角标
           content.badge = @1;
    
           NSDateComponents *components = [[NSDateComponents alloc] init];
            components.hour = 10;
           UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:components repeats:YES];
    
           
           // id：便于以后移除、更新 指定通知
           NSString * noticeId = @"222";
           // 通知请求
           UNNotificationRequest * request = [UNNotificationRequest requestWithIdentifier:noticeId content:content trigger:trigger];
           // 添加通知请求
           [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
               if (error == nil) {
                   NSLog(@"睡眠推送成功");
               }
           }];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    
    completionHandler(UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler {
    
    if([response.notification.request.identifier isEqualToString:@"111"]) {
        
        UIAlertController *alertVc = [UIAlertController alertControllerWithTitle:@"心情询问" message:nil preferredStyle:
        UIAlertControllerStyleAlert];
            // 添加输入框 (注意:在UIAlertControllerStyleActionSheet样式下是不能添加下面这行代码的)
            [alertVc addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
                textField.placeholder = @"请在1-6之间输入一个值";
            }];
            UIAlertAction *action1 = [UIAlertAction actionWithTitle:@"保存" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
        // 通过数组拿到textTF的值
                NSLog(@"ok, %@", [[alertVc textFields] objectAtIndex:0].text);
                
                [[HealthManager shareManager] writJson:@{@"feel":[[alertVc textFields] objectAtIndex:0].text,@"time":[[HealthManager shareManager]currentTimeString]}];
            }];
            UIAlertAction *action2 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
        // 添加行为
            [alertVc addAction:action2];
            [alertVc addAction:action1];
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alertVc animated:YES completion:nil];
        
        
    }else if ([response.notification.request.identifier isEqualToString:@"222"]) {
        
        UIAlertController *alertVc = [UIAlertController alertControllerWithTitle:@"睡眠时间" message:nil preferredStyle:
        UIAlertControllerStyleAlert];
            // 添加输入框 (注意:在UIAlertControllerStyleActionSheet样式下是不能添加下面这行代码的)
            [alertVc addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
                textField.placeholder = @"请输入睡眠时间例如12:00:00pm";
            }];
        [alertVc addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.placeholder = @"请输入睡眠质量：好，一般，不好三种";
        }];
            UIAlertAction *action1 = [UIAlertAction actionWithTitle:@"保存" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
        // 通过数组拿到textTF的值
                NSLog(@"ok, %@ %@", [[alertVc textFields] objectAtIndex:0].text,[[alertVc textFields] objectAtIndex:1].text);
                
                [[HealthManager shareManager] writJson:@{@"sleep":[[alertVc textFields] objectAtIndex:0].text,@"evaluate":[[alertVc textFields] objectAtIndex:1].text,@"time":[[HealthManager shareManager]currentTimeString]}];
                
            }];
            UIAlertAction *action2 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil];
        // 添加行为
            [alertVc addAction:action2];
            [alertVc addAction:action1];
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alertVc animated:YES completion:nil];
    }
    
    NSLog(@"identifier:%@",response.notification.request.identifier);
    
    completionHandler();
}



#pragma mark - UISceneSession lifecycle


- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    // Called when a new scene session is being created.
    // Use this method to select a configuration to create the new scene with.
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}


- (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
    // Called when the user discards a scene session.
    // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
    // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
}


#pragma mark - Core Data stack

@synthesize persistentContainer = _persistentContainer;

- (NSPersistentContainer *)persistentContainer {
    // The persistent container for the application. This implementation creates and returns a container, having loaded the store for the application to it.
    @synchronized (self) {
        if (_persistentContainer == nil) {
            _persistentContainer = [[NSPersistentContainer alloc] initWithName:@"FeelFlow"];
            [_persistentContainer loadPersistentStoresWithCompletionHandler:^(NSPersistentStoreDescription *storeDescription, NSError *error) {
                if (error != nil) {
                    // Replace this implementation with code to handle the error appropriately.
                    // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    
                    /*
                     Typical reasons for an error here include:
                     * The parent directory does not exist, cannot be created, or disallows writing.
                     * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                     * The device is out of space.
                     * The store could not be migrated to the current model version.
                     Check the error message to determine what the actual problem was.
                    */
                    NSLog(@"Unresolved error %@, %@", error, error.userInfo);
                    abort();
                }
            }];
        }
    }
    
    return _persistentContainer;
}

#pragma mark - Core Data Saving support

- (void)saveContext {
    NSManagedObjectContext *context = self.persistentContainer.viewContext;
    NSError *error = nil;
    if ([context hasChanges] && ![context save:&error]) {
        // Replace this implementation with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
        NSLog(@"Unresolved error %@, %@", error, error.userInfo);
        abort();
    }
}

@end
