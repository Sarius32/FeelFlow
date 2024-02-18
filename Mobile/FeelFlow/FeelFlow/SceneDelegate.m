//
//  SceneDelegate.m
//  FeelFlow
//
//  Created by pc-222 on 2024/2/18.
//

#import "SceneDelegate.h"
#import "AppDelegate.h"
#import "MainVC.h"
#import "MiddleVC.h"
#import "LastVC.h"

@interface SceneDelegate ()

@end

@implementation SceneDelegate


- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
    // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
    // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
    
    if (scene) {
        self.window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
        self.window.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
        
        self.window.rootViewController = [self createTabbarController];
        [self.window makeKeyAndVisible];
        }
}

- (UITabBarController *)createTabbarController {
    
    UITabBarController *tabBarVC = [UITabBarController new];
    MainVC *main = [MainVC new];
    main.title = @"录制";
    MiddleVC *middle = [MiddleVC new];
    middle.title = @"健康";
    LastVC *last = [LastVC new];
    last.title = @"个人";
    
    // 创建NavigationController 把你的VC设置为rootVC
    UINavigationController *mainNav = [[UINavigationController alloc] initWithRootViewController:main];
    mainNav.tabBarItem.title = @"录制";
    mainNav.tabBarItem.image = [UIImage imageNamed:@"default"];
    
    UINavigationController *middleNav = [[UINavigationController alloc] initWithRootViewController:middle];
    middleNav.tabBarItem.title = @"健康";
    middleNav.tabBarItem.image = [UIImage imageNamed:@"default"];
    
    UINavigationController *lastNav = [[UINavigationController alloc] initWithRootViewController:last];
    lastNav.tabBarItem.title = @"我的";
    lastNav.tabBarItem.image = [UIImage imageNamed:@"default"];
    
    // 将NavigationController加到TabBarController
    [tabBarVC addChildViewController:mainNav];
    [tabBarVC addChildViewController:middleNav];
    [tabBarVC addChildViewController:lastNav];
    
    return tabBarVC;
}


- (void)sceneDidDisconnect:(UIScene *)scene {
    // Called as the scene is being released by the system.
    // This occurs shortly after the scene enters the background, or when its session is discarded.
    // Release any resources associated with this scene that can be re-created the next time the scene connects.
    // The scene may re-connect later, as its session was not necessarily discarded (see `application:didDiscardSceneSessions` instead).
}


- (void)sceneDidBecomeActive:(UIScene *)scene {
    // Called when the scene has moved from an inactive state to an active state.
    // Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
}


- (void)sceneWillResignActive:(UIScene *)scene {
    // Called when the scene will move from an active state to an inactive state.
    // This may occur due to temporary interruptions (ex. an incoming phone call).
}


- (void)sceneWillEnterForeground:(UIScene *)scene {
    // Called as the scene transitions from the background to the foreground.
    // Use this method to undo the changes made on entering the background.
}


- (void)sceneDidEnterBackground:(UIScene *)scene {
    // Called as the scene transitions from the foreground to the background.
    // Use this method to save data, release shared resources, and store enough scene-specific state information
    // to restore the scene back to its current state.

    // Save changes in the application's managed object context when the application transitions to the background.
    [(AppDelegate *)UIApplication.sharedApplication.delegate saveContext];
}


@end
