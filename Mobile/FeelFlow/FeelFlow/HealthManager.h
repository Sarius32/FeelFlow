//
//  HealthManager.h
//  FeelFlow
//
//  Created by pc-222 on 2024/2/18.
//

#import <Foundation/Foundation.h>
#import <HealthKit/HealthKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface HealthManager : NSObject {
    
    HKHealthStore *healthStore;
}

+ (instancetype)shareManager;

//获取步数
//- (void)getHealthStepData;

/**
 * 检查是否支持获取健康数据
 */
- (void)authorizeHealthKit:(void(^)(BOOL success, NSError *error))compltion;

/**
 * 获取步数
 */
- (void)getStepCount:(void(^)(NSString *stepValue, NSError *error))completion;

/**
 * 获取睡眠
 */
- (void)getSleepCount:(void(^)(NSString *sleepValue, NSError *error))completion;

//获取当前时间
- (NSString *)currentTimeString;

//- (NSDictionary *)readLocalFileWithName;

- (void)writJson:(NSDictionary*)dictionary;

@end

NS_ASSUME_NONNULL_END
