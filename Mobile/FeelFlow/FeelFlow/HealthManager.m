//
//  HealthManager.m
//  FeelFlow
//
//  Created by pc-222 on 2024/2/18.
//

#import "HealthManager.h"


@implementation HealthManager

+ (instancetype)shareManager {
    
    static HealthManager *singleton = nil;
    static dispatch_once_t  onceToken;
    dispatch_once(&onceToken, ^{
        singleton = [[HealthManager alloc] init];
    });
    return singleton;
}

- (void)getHealthStepData {
    
    healthStore = [[HKHealthStore alloc]init];
        
        //设置需要获取的权限 这里仅设置了步数
        HKObjectType *stepType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
        NSSet *healthSet = [NSSet setWithObjects:stepType, nil];
        
        //从健康应用中获取权限
        [healthStore requestAuthorizationToShareTypes:nil readTypes:healthSet completion:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                //获取步数后我们调用获取步数的方法
                [self readStepCount];
            }
            else
            {
                NSLog(@"获取步数权限失败");
            }
        }];
}

- (void)readStepCount {
    
    HKSampleType *sampleType = [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
    
    NSSortDescriptor *start = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:NO];
    NSSortDescriptor *end = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierEndDate ascending:NO];
    
    NSDate *now = [NSDate date];
        NSCalendar *calender = [NSCalendar currentCalendar];
        NSUInteger unitFlags = NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
        NSDateComponents *dateComponent = [calender components:unitFlags fromDate:now];
        int hour = (int)[dateComponent hour];
        int minute = (int)[dateComponent minute];
        int second = (int)[dateComponent second];
        NSDate *nowDay = [NSDate dateWithTimeIntervalSinceNow:  - (hour*3600 + minute * 60 + second) ];
        //时间结果与想象中不同是因为它显示的是0区
        NSLog(@"今天%@",nowDay);
        NSDate *nextDay = [NSDate dateWithTimeIntervalSinceNow:  - (hour*3600 + minute * 60 + second)  + 86400];
        NSLog(@"明天%@",nextDay);
        NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:nowDay endDate:nextDay options:(HKQueryOptionNone)];
    
    HKSampleQuery *sampleQuery = [[HKSampleQuery alloc]initWithSampleType:sampleType predicate:predicate limit:0 sortDescriptors:@[start,end] resultsHandler:^(HKSampleQuery * _Nonnull query, NSArray<__kindof HKSample *> * _Nullable results, NSError * _Nullable error) {
            //设置一个int型变量来作为步数统计
            int allStepCount = 0;
            for (int i = 0; i < results.count; i ++) {
                //把结果转换为字符串类型
                HKQuantitySample *result = results[i];
                HKQuantity *quantity = result.quantity;
                NSMutableString *stepCount = (NSMutableString *)quantity;
                NSString *stepStr =[ NSString stringWithFormat:@"%@",stepCount];
                //获取51 count此类字符串前面的数字
                NSString *str = [stepStr componentsSeparatedByString:@" "][0];
                int stepNum = [str intValue];
                NSLog(@"%d",stepNum);
                //把一天中所有时间段中的步数加到一起
                allStepCount = allStepCount + stepNum;
            }
            NSLog(@"今天的总步数＝＝＝＝%d",allStepCount);
        }];
    
    [healthStore executeQuery:sampleQuery];
}

- (void)getHealthSleepyData {
    
    
}

#pragma mark - 检查是否支持获取健康数据
- (void)authorizeHealthKit:(void(^)(BOOL success, NSError *error))compltion {
    if (![HKHealthStore isHealthDataAvailable]) {
        NSError *error = [NSError errorWithDomain: @"不支持健康数据" code: 2 userInfo: [NSDictionary dictionaryWithObject:@"HealthKit is not available in th is Device"                                                                      forKey:NSLocalizedDescriptionKey]];
        if (compltion != nil) {
            compltion(NO, error);
        }
        return;
    }else{
        if(healthStore == nil){
            healthStore = [[HKHealthStore alloc] init];
        }
        //组装需要读写的数据类型
        NSSet *writeDataTypes = [self dataTypesToWrite];
        NSSet *readDataTypes = [self dataTypesRead];
        //注册需要读写的数据类型，也可以在“健康”APP中重新修改
        [healthStore requestAuthorizationToShareTypes:writeDataTypes readTypes:readDataTypes completion:^(BOOL success, NSError *error) {
            
            if (compltion != nil) {
                NSLog(@"error->%@", error.localizedDescription);
                compltion (YES, error);
            }
        }];
    }
}

#pragma mark - 写权限
- (NSSet *)dataTypesToWrite{
    //步数
    HKQuantityType *stepCountType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
    //身高
    HKQuantityType *heightType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeight];
    //体重
    HKQuantityType *weightType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMass];
    //活动能量
    HKQuantityType *activeEnergyType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierActiveEnergyBurned];
    //体温
    HKQuantityType *temperatureType = [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyTemperature];
    //睡眠分析
    HKCategoryType *sleepAnalysisType = [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];
    return [NSSet setWithObjects:stepCountType,heightType, temperatureType, weightType,activeEnergyType,sleepAnalysisType,nil];
}

#pragma mark - 读权限
- (NSSet *)dataTypesRead{
    //身高
    HKQuantityType *heightType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeight];
    //体重
    HKQuantityType *weightType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMass];
    //体温
    HKQuantityType *temperatureType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyTemperature];
    //出生日期
    HKCharacteristicType *birthdayType = [HKObjectType characteristicTypeForIdentifier:HKCharacteristicTypeIdentifierDateOfBirth];
    //性别
    HKCharacteristicType *sexType = [HKObjectType characteristicTypeForIdentifier:HKCharacteristicTypeIdentifierBiologicalSex];
    //步数
    HKQuantityType *stepCountType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
    //步数+跑步距离
    HKQuantityType *distance = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierDistanceWalkingRunning];
    //活动能量
    HKQuantityType *activeEnergyType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierActiveEnergyBurned];
    //睡眠分析
    HKCategoryType *sleepAnalysisType = [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];
    
    return [NSSet setWithObjects:heightType, temperatureType,birthdayType,sexType,weightType,stepCountType, distance, activeEnergyType,sleepAnalysisType,nil];
}

#pragma mark - 获取步数
- (void)getStepCount:(void(^)(NSString *stepValue, NSError *error))completion{
    
    //要检索的数据类型。
    HKQuantityType *stepType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];
    
    //NSSortDescriptors用来告诉healthStore怎么样将结果排序。
    NSSortDescriptor *start = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:NO];
    NSSortDescriptor *end = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierEndDate ascending:NO];
    
    /*
     @param         sampleType      要检索的数据类型。
     @param         predicate       数据应该匹配的基准。
     @param         limit           返回的最大数据条数
     @param         sortDescriptors 数据的排序描述
     @param         resultsHandler  结束后返回结果
     */
    HKSampleQuery*query = [[HKSampleQuery alloc] initWithSampleType:stepType predicate:[HealthManager getStepPredicateForSample] limit:HKObjectQueryNoLimit sortDescriptors:@[start,end] resultsHandler:^(HKSampleQuery * _Nonnull query, NSArray<__kindof HKSample *> * _Nullable results, NSError * _Nullable error) {
        if(error){
            completion(0,error);
        }else{
            NSLog(@"resultCount = %ld result = %@",results.count,results);
            //把结果装换成字符串类型
            double totleSteps = 0;
            for(HKQuantitySample *quantitySample in results){
                HKQuantity *quantity = quantitySample.quantity;
                HKUnit *heightUnit = [HKUnit countUnit];
                double usersHeight = [quantity doubleValueForUnit:heightUnit];
                totleSteps += usersHeight;
            }
            NSLog(@"最新步数：%ld",(long)totleSteps);
            completion([NSString stringWithFormat:@"%ld",(long)totleSteps],error);
        }
    }];
    [healthStore executeQuery:query];
}

#pragma mark - 获取睡眠(昨天12点到今天12点)
- (void)getSleepCount:(void(^)(NSString *sleepValue, NSError *error))completion{
    
    //要检索的数据类型。
    HKSampleType *sleepType = [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];
    
    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierEndDate ascending:false];
    
    
    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType:sleepType predicate:[HealthManager getSleepPredicateForSample] limit:HKObjectQueryNoLimit sortDescriptors:@[sortDescriptor] resultsHandler:^(HKSampleQuery * _Nonnull query, NSArray<__kindof HKSample *> * _Nullable results, NSError * _Nullable error) {
        if (error) {
            NSLog(@"=======%@", error.domain);
        }else{
            NSLog(@"resultCount = %ld result = %@",results.count,results);
            NSInteger totleSleep = 0;
            for (HKCategorySample *sample in results) {//0：卧床时间 1：睡眠时间  2：清醒状态
                NSLog(@"=======%@=======%ld",sample, sample.value);
                if (sample.value == 1) {
                    NSTimeInterval i = [sample.endDate timeIntervalSinceDate:sample.startDate];
                    totleSleep += i;
                }
            }
            NSLog(@"睡眠分析：%.2f",totleSleep/3600.0);
            completion([NSString stringWithFormat:@"%.2f",totleSleep/3600.0],error);
        }
    }];
    
    [healthStore executeQuery:query];
}


#pragma mark - 当天时间段
+ (NSPredicate *)getStepPredicateForSample {
    NSDate *now = [NSDate date];
    NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyyMMdd"];
    NSString *startFormatValue = [NSString stringWithFormat:@"%@000000",[formatter stringFromDate:now]];
    NSString *endFormatValue = [NSString stringWithFormat:@"%@235959",[formatter stringFromDate:now]];
    [formatter setDateFormat:@"yyyyMMddHHmmss"];
    NSDate * startDate = [formatter dateFromString:startFormatValue];
    NSDate * endDate = [formatter dateFromString:endFormatValue];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:startDate endDate:endDate options:HKQueryOptionNone];
    return predicate;
}

#pragma mark - 昨天12点到今天12点
+ (NSPredicate *)getSleepPredicateForSample {
    NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyyMMdd"];
    //今天12点
    NSDate *now = [NSDate date];
    NSString *endFormatValue = [NSString stringWithFormat:@"%@120000",[formatter stringFromDate:now]];
    
    //昨天12点
    NSDate *lastDay = [NSDate dateWithTimeInterval:-24*60*60 sinceDate:now];//前一天
    NSString *startFormatValue = [NSString stringWithFormat:@"%@120000",[formatter stringFromDate:lastDay]];
    
    [formatter setDateFormat:@"yyyyMMddHHmmss"];
    NSDate * startDate = [formatter dateFromString:startFormatValue];
    NSDate * endDate = [formatter dateFromString:endFormatValue];
    NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:startDate endDate:endDate options:HKQueryOptionNone];
    return predicate;
}

- (NSString *)currentTimeString {
    
    NSDateFormatter *dateFormatter = [NSDateFormatter new];
    
    dateFormatter.dateFormat = @"yyyyMMddHHmmss";
    
    return [dateFormatter stringFromDate:[NSDate date]];
}

//// 读取本地JSON文件
//- (NSDictionary *)readLocalFileWithName {
//    
//    NSArray *paths=NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//        NSString *path=[paths objectAtIndex:0];
//        NSString *Json_path= [path stringByAppendingPathComponent:@"myHealth.json"];
//        //==Json数据
//        NSData *data=[NSData dataWithContentsOfFile:Json_path];
//        //==JsonObject
//    NSError *error;
//    NSDictionary *jsonObject=[NSJSONSerialization JSONObjectWithData:data
//                                                       options:NSJSONReadingAllowFragments
//                                                        error:&error];
//    return jsonObject;
//}

// 写入本地JSON文件
- (void)writJson:(NSDictionary*)dictionary {
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *path = [paths objectAtIndex:0];
        NSString *Json_path = [path stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.json",[self currentTimeString]]];
        //==写入文件
        NSLog(@"%@",[dictionary writeToFile:Json_path atomically:YES] ? @"Succeed":@"Failed");
    
}

@end
