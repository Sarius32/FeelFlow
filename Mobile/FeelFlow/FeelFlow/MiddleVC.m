//
//  MiddleVC.m
//  OC_Demo
//
//  Created by Anthony Zhang on 2020/4/2.
//  Copyright © 2020 Anthony Zhang. All rights reserved.
//

#import "MiddleVC.h"
#import "HealthManager.h"

@interface MiddleVC ()

@end

@implementation MiddleVC

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self createUI];
}

- (void)createUI {
    
    UIButton *healthStepButton = [UIButton buttonWithType:UIButtonTypeCustom];
    healthStepButton.frame = CGRectMake(100, 100, 200, 50);
    [healthStepButton setTitle:@"获取健康数据-步数" forState:UIControlStateNormal];
    [healthStepButton setBackgroundColor:[UIColor lightGrayColor]];
    [healthStepButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [healthStepButton addTarget:self action:@selector(buttonClick:) forControlEvents:UIControlEventTouchUpInside];
    healthStepButton.tag = 101;
    [self.view addSubview:healthStepButton];
    
    UIButton *healthSleepyButton = [UIButton buttonWithType:UIButtonTypeCustom];
    healthSleepyButton.frame = CGRectMake(100, 300, 200, 50);
    [healthSleepyButton setTitle:@"获取健康数据-睡眠时间" forState:UIControlStateNormal];
    [healthSleepyButton setBackgroundColor:[UIColor lightGrayColor]];
    [healthSleepyButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [healthSleepyButton addTarget:self action:@selector(buttonClick:) forControlEvents:UIControlEventTouchUpInside];
    healthSleepyButton.tag = 102;
    [self.view addSubview:healthSleepyButton];
}

- (void)buttonClick:(UIButton *)button {
    
    if(button.tag == 101) {
        
        [[HealthManager shareManager] authorizeHealthKit:^(BOOL success, NSError * _Nonnull error) {
            
            if(success) {
                
                [[HealthManager shareManager] getStepCount:^(NSString * _Nonnull stepValue, NSError * _Nonnull error) {
                    
                    [[HealthManager shareManager] writJson:@{@"step":stepValue,@"time":[[HealthManager shareManager]currentTimeString]}];
                    
                }];
            }
            
        }];
        
        
        
    }else if (button.tag == 102) {
        
        [[HealthManager shareManager] authorizeHealthKit:^(BOOL success, NSError * _Nonnull error) {
            
            if(success) {
                
                [[HealthManager shareManager] getSleepCount:^(NSString * _Nonnull sleepValue, NSError * _Nonnull error) {
                     
                    [[HealthManager shareManager] writJson:@{@"sleep":sleepValue,@"time":[[HealthManager shareManager]currentTimeString]}];
                }];
            }
            
        }];
    }
    
}

@end
