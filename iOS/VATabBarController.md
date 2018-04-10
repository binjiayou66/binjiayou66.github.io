<a id="top" name="top"></a>

##一、前言

1. 由于UITabBarController的TabBar低可控性（不能通过发消息的方式较完美的实现隐藏与显示控制），所以自封装的TabBarController不可继承自UITabBarController，不可沿用UITabBar，也不太适合使用UITabBarItem。
2. 由于上述原因，自封装TabBarController几乎是完全自定制，但是希望给使用者最大化的原生体验，所以在封装过程中，基本上是参考了系统TabBarController的思路，大部分属性及方法名都与系统命名相同，除了一些不能同名实现的情况，如协议方法名、分类属性名等。
3. 在参考系统TabBarController的基础上，当然也有一些常用的功能扩展，如VATabBarItem既支持系统的数字角标badgeValue，也支持点标提示dotBadge；VATabBarItem可以通过调节badgeValue的字体大小的方式调节角标的大小等。

##二、VATabBarItem

```objective-c
//
//  VATabBarItem.h
//  VATabBarController
//
//  Created by Andy on 2017/12/24.
//  Copyright © 2017年 naibin.liu. All rights reserved.
//
//  Source file link https://github.com/binjiayou66/ADTabBarController.git
//  Reference link https://github.com/robbdimitrov/RDVTabBarController
//

#import <UIKit/UIKit.h>

@interface VATabBarItem : UIControl

/// 高度
@property CGFloat itemHeight;

/// 标题
@property (nonatomic, copy) NSString *title;

/// 标题偏移量
@property (nonatomic) UIOffset titlePositionAdjustment;

/**
 * 文本属性详情可参考以下链接
 * https://developer.apple.com/library/ios/documentation/uikit/reference/NSString_UIKit_Additions/Reference/Reference.html
 */

/// 未选中状态标题文本属性
@property (copy) NSDictionary *unselectedTitleAttributes;

/// 选中标题文本属性
@property (copy) NSDictionary *selectedTitleAttributes;

/// 图片偏移量
@property (nonatomic) UIOffset imagePositionAdjustment;

/// 选中状态图片
@property (nonatomic, strong) UIImage * selectedImage;

/// 未选中状态图片
@property (nonatomic, strong) UIImage * unselectedImage;

/// 选中状态背景图片
@property (nonatomic, strong) UIImage * selectedBackgroundImage;

/// 未选中状态背景图片
@property (nonatomic, strong) UIImage * unselectedBackgroundImage;

/// 角标值
@property (nonatomic, copy) NSString *badgeValue;

/// 角标文字颜色
@property (strong) UIColor *badgeTextColor;

/// 角标字体大小
@property (nonatomic) UIFont *badgeTextFont;

/// 角标背景颜色
@property (strong) UIColor *badgeBackgroundColor;

/// 角标背景图片
@property (strong) UIImage *badgeBackgroundImage;

/// 角标偏移量
@property (nonatomic) UIOffset badgePositionAdjustment;

/// 是否显示点标
@property (nonatomic, assign, getter=isShowDotBadge) BOOL showDotBadge;

/// 点标大小
@property (nonatomic, assign) CGSize dotBadgeSize;

/// 点标颜色
@property (nonatomic, strong) UIColor *dotBadgeColor;

/// 点标偏移量
@property (nonatomic) UIOffset dotBadgePositionAdjustment;

@end
```

1. UITabBarItem继承链为：UITabBarItem -> UIBarItem -> NSObject，而VATabBarItem的继承链为：VATabBarItem -> UIControl -> UIView -> UIResponder -> NSObject。这一改变为我们带来了一些便利，比如我们可以用我们更熟悉的方式为VATabBarItem添加事件addTarget:action:forControlEvents:，更容易控制Item的一些视图属性frame、backgroundColor等。
2. itemHeight属性，支持单独设置Item的高度，由此可以实现病人端中间按钮凸出的TabBar样式。
3. title、titlePositionAdjustment、unselectedTitleAttributes、selectedTitleAttributes属性，支持设置Item标题、标题偏移量、选中及未选中状态下的标题属性。
4. imagePositionAdjustment、selectedImage、unselectedImage、selectedBackgroundImage、unselectedBackgroundImage属性，支持设置Item图标偏移量、选中及未选中状态下的前景图片与背景图片。
5. badgeValue、badgeTextColor、badgeTextFont、badgeBackgroundColor、badgeBackgroundImage、badgePositionAdjustment属性，支持设置Item角标值、角标文本颜色、角标字体（字体大小会影响角标范围大小）、角标背景颜色、角标背景图片。
6. showDotBadge、dotBadgeSize、dotBadgeColor、dotBadgePositionAdjustment属性，支持设置是否显示点标、点标大小（点标形状为点标大小形成矩形的内切椭圆形状）、点标颜色、点标位置偏移量。
7. Item是通过重写drawRect:方法的形式显示的。
8. 设置角标值、显示点标时，在对应的set方法中会调用setNeedsDisplay方法，重新触发drawRect:方法，使该Item被重新绘制。

##三、VATabBar

```objective-c
//
//  VATabBar.h
//  VATabBarController
//
//  Created by Andy on 2017/12/24.
//  Copyright © 2017年 naibin.liu. All rights reserved.
//
//  Source file link https://github.com/binjiayou66/ADTabBarController.git
//  Reference link https://github.com/robbdimitrov/RDVTabBarController
//

#import <UIKit/UIKit.h>

@class VATabBar, VATabBarItem;

@protocol VATabBarDelegate <NSObject>

/// 是否可选中参数下标项
- (BOOL)va_tabBar:(VATabBar *)tabBar shouldSelectItemAtIndex:(NSInteger)index;

/// 已经选中参数下标项
- (void)va_tabBar:(VATabBar *)tabBar didSelectItemAtIndex:(NSInteger)index;

@end

@interface VATabBar : UIView

/// VATabBarDelegate代理对象
@property (nonatomic, weak) id <VATabBarDelegate> delegate;

/// TabBarItems数组
@property (nonatomic, copy) NSArray<VATabBarItem *> *items;

/// 当前选中的TabBarItem
@property (nonatomic, weak) VATabBarItem *selectedItem;

/// 背景视图
@property (nonatomic, strong) UIView *backgroundView;

/// 内边距
@property UIEdgeInsets contentEdgeInsets;

/// TabBar高度
- (void)setHeight:(CGFloat)height;

/// 设置TabBar是否可以半透明
@property (nonatomic, getter=isTranslucent) BOOL translucent;

/// TabBar背景颜色
@property (nonatomic, strong) UIColor *tabBarBackgroundColor;

@end
```

1. VATabBar的实现，比UITabBar更为简洁一些，删除了一些较少用到的功能，删除的属性有tintColor、barTintColor、unselectedItemTintColor、selectedImageTintColor、backgroundImage、selectionIndicatorImage、shadowImage、itemPositioning、itemWidth、itemSpacing、barStyle，另外还删除了所有和Item顺序调整相关的内容。
2. 保存的属性有delegate（TabBar代理），items（TabBar上的按钮元素数组），selectedItem（当前选中的按钮元素），backgroundView（官方backgroundImage的替代品），translucent属性。
3. 新增了contentEdgeInsets属性，设置TabBar内边距；tabBarBackgroundColor属性，设置TabBar背景颜色。
4. 关于translucent属性，官方translucent属性设置为YES的时候，除了TabBar半透明效果之外，当前显示的ViewController的view视图范围包含TabBar底部区域，设置为NO的时候，并不包含TabBar底部区域。VATabBar的translucent属性，只会影响TabBar是否有半透明效果，并不会影响当前视图控制器视图的大小，视图大小均包含TabBar底部区域。
5. 不要实现tabBar的代理方法，代理对象为VATabBarController对象

##四、VATabBarController

```objective-c
@interface UIViewController (VATabBarControllerItem)

/// 视图控制器TabBarItem
@property(nonatomic, setter = va_setTabBarItem:) VATabBarItem *va_tabBarItem;

/// 视图控制器获取TabBarController对象
@property(nonatomic, readonly) VATabBarController *va_tabBarController;

@end
```

1. 【重】由于UITabBarController的一个分类已经给UIViewController加上了tabBarItem和tabBarController属性，不可添加同名属性，在这里我们给UIViewController加上了va_tabBarItem和va_tabBarController属性，使得每个UIViewController对象可以通过该属性获得自己的va_tabBarItem和所属的va_tabBarController。此时再通过官方的tabBarItem和tabBarController属性获取到的对象为nil。

```objective-c
@protocol VATabBarControllerDelegate <NSObject>
@optional

/// 是否可选中参数视图控制器
- (BOOL)va_tabBarController:(VATabBarController *)tabBarController shouldSelectViewController:(UIViewController *)viewController;

/// 已经选中参数视图控制器
- (void)va_tabBarController:(VATabBarController *)tabBarController didSelectViewController:(UIViewController *)viewController;

@end
```

2. 相比UITabBarControllerDelegate，VATabBarControllerDelegate只保留了常用的两个协议方法，删除的方法有三大类：（1）调整子视图控制器相关协议方法（2）屏幕旋转相关协议方法（3）过场动画相关协议方法。其中屏幕旋转相关方法重写为返回子视图控制器的屏幕旋转支持属性。

```objective-c
//
//  VATabBarController.h
//  VATabBarController
//
//  Created by Andy on 2017/12/24.
//  Copyright © 2017年 naibin.liu. All rights reserved.
//
//  Source file link https://github.com/binjiayou66/ADTabBarController.git
//  Reference link https://github.com/robbdimitrov/RDVTabBarController
//

#import <UIKit/UIKit.h>
#import "VATabBar.h"
#import "VATabBarItem.h"

@protocol VATabBarControllerDelegate;

@interface VATabBarController : UIViewController

/// VATabBarControllerDelegate代理对象
@property (nonatomic, weak) id<VATabBarControllerDelegate> delegate;

/// 子视图控制器数组
@property (nonatomic, copy) NSArray<__kindof UIViewController *> *viewControllers;

/// VATabBar对象
@property (nonatomic, readonly) VATabBar *tabBar;

/// 当前选中的视图控制器
@property (nonatomic, weak) UIViewController *selectedViewController;

/// 当前选中的视图控制器下标
@property (nonatomic, assign) NSUInteger selectedIndex;

/// 隐藏TabBar
@property (nonatomic, getter=isTabBarHidden) BOOL tabBarHidden;

/// 隐藏TabBar，可选动画
- (void)setTabBarHidden:(BOOL)hidden animated:(BOOL)animated;

@end
```

3. 关于VATabBarController的实现，基本上与UITabBarController保持了一致。
4. va_tabBarController.tabBarHidden = YES; 等效于 [va_tabBarController setTabBarHidden:YES animated:NO];

## 五、iPhone X适配

1. VATabBarController的实现文件中设置了defaultBarHeight属性，该属性并没有向外暴露，即VATabBar的高度与UITabBar的高度一致，一般为49，iPhone X下为83。
2. VATabBar的实现文件中设置了userInteractionHeight，即TabBar能够响应用户操作的高度，该属性并没有向外暴露，即VATabBar的可响应用户操作的区域高度与UITabBar的一致，所有机型均为49高度，iPhone X中TabBar49高度以下部分，不会响应用户点击操作，该部分为系统软按钮操作区。

