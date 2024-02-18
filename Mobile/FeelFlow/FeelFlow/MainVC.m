//
//  MainVC.m
//  OC_Demo
//
//  Created by Anthony Zhang on 2020/4/2.
//  Copyright © 2020 Anthony Zhang. All rights reserved.
//

#import "MainVC.h"
#import "LXFCameraController.h"

@interface MainVC ()

@end

@implementation MainVC

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self createUI];
}

- (void)createUI {
    
    UIButton *videoButton = [UIButton buttonWithType:UIButtonTypeCustom];
    videoButton.frame = CGRectMake(100, 100, 200, 50);
    [videoButton setTitle:@"录制视频" forState:UIControlStateNormal];
    [videoButton setBackgroundColor:[UIColor lightGrayColor]];
    [videoButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [videoButton addTarget:self action:@selector(buttonClick:) forControlEvents:UIControlEventTouchUpInside];
    
    [self.view addSubview:videoButton];
}

- (void)buttonClick:(UIButton *)button {
    
    LXFCameraController *cameraController = [LXFCameraController defaultCameraController];
    
    __weak LXFCameraController *weakCameraController = cameraController;
    
    cameraController.takePhotosCompletionBlock = ^(UIImage *image, NSError *error) {
        NSLog(@"takePhotosCompletionBlock");
        
        [weakCameraController dismissViewControllerAnimated:YES completion:nil];
    };
    
    cameraController.shootCompletionBlock = ^(NSURL *videoUrl, CGFloat videoTimeLength, UIImage *thumbnailImage, NSError *error) {
        NSLog(@"shootCompletionBlock");
        
        [weakCameraController dismissViewControllerAnimated:YES completion:nil];
    };
    
    cameraController.modalPresentationStyle = UIModalPresentationFullScreen;
    [self presentViewController:cameraController animated:YES completion:nil];
}

@end
