<a id="top" name="top"></a>

## 一、自动释放池

### 1. 自动释放池本质上做了什么

（1）@autorelease

官方格式

```objective-c
@autorelease { 
  // code 
}  
```

等价于

```objective-c
{ 
	void * autoreleasepoolobj = objc_autoreleasePoolPush();  
	
	// code  

	objc_autoreleasePoolPop(autoreleasepoolobj);

}
```

（2）两个函数

```c
void * objc_autoreleasePoolPush(void) {			
	return AutoreleasePoolPage::Push();
}

void objc_autoreleasePoolPop(void * ctxt) {			
	AutoreleasePoolPage::Pop(ctxt);
}
```



### 2. Autorelease相关关键类，AutoreleasePoolPage

（1）AutoreleasePoolPage是一个C++类

```c++
class AutoreleasePoolPage {			
	magic_t const magic;
	id * next;
	pthread_t const thread;
	AutoreleasePoolPage * const parent;
	AutoreleasePoolPage * child;
	uint32_t const depth;
	uint32_t hiwat;
}
```

（2）每一个AutoreleasePoolPage对象大小为4096字节

（3）每一个AutoreleasePoolPage对象为一个双向链表节点

（4）一个AutoreleasePool由一个或者多个AutoreleasePoolPage对象进行管理自动释放的对象



### 3. AutoreleasePoolPage::Push()做了什么

（1）如果存在hotPage（当前活跃AutoreleasePoolPage对象），并且hotPage对象没有存储满，则将一个哨兵对象（本质为nil）压入hotPage栈顶

（2）如果存在hotPage，但是hotPage已满，则创建新的AutoreleasePoolPage对象，设置为新的hotPage，双向链表进行相关关联后，将一个哨兵对象压入当前hotPage栈顶

（3）如果不存在hotPage，则创建新的AutoreleasePoolPage对象，设置为hotPage，将一个哨兵对象压入当前hotPage栈顶。初始的AutoreleasePoolPage对象的parent节点为空，hotPage的child节点为空。



### 4. 对象发送autorelease消息

对象发送autorelease消息后，当前自动释放池所对应的AutoreleasePoolPage hotPage对象将该对象进行压栈操作（page->add(id obj)）

```c
id * add(id obj) {
	
	id * ret = next;
	*next = obj;
	next++;
	
  	return ret;
}
```

![addobj](../resources/images/autorelease/addobj.png)



### 5. AutoreleasePoolPage::Pop()做了什么

（1）将晚于该自动释放池的哨兵对象压入栈的所以对象进行出栈操作、release操作

![pop](../resources/images/autorelease/pagepop.png)

（2）如果存在多余AutoreleasePoolPage，kill掉



## 二、Runloop

### 参考链接[http://www.cocoachina.com/ios/20150601/11970.html](http://www.cocoachina.com/ios/20150601/11970.html)

RunLoop 是 iOS 和 OS X 开发中非常基础的一个概念，这篇文章将从 CFRunLoop 的源码入手，介绍 RunLoop 的概念以及底层实现原理。之后会介绍一下在 iOS 中，苹果是如何利用 RunLoop 实现自动释放池、延迟回调、触摸事件、屏幕刷新等功能的。

内容包括：RunLoop 的概念，RunLoop 与线程的关系，RunLoop 对外的接口，RunLoop 的 Mode，RunLoop 的内部逻辑，RunLoop 的底层实现，苹果用 RunLoop 实现的功能（AutoreleasePool、事件响应、手势识别、界面更新、定时器、PerformSelecter、关于GCD、关于网络请求），RunLoop 的实际应用举例，AFNetworking，AsyncDisplayKit



### 1. RunLoop概念

RunLoop 实际上就是一个对象，这个对象管理了其需要处理的事件和消息，并提供了一个入口函数来执行Event Loop（下述函数）的逻辑。线程执行了这个函数后，就会一直处于这个函数内部 "接受消息->等待->处理" 的循环中，直到这个循环结束（比如传入 quit 的消息），函数返回。

```javascript
function loop() {	
	initialize();
	do {		
		var message = get_next_message();
		process_message(message);
	} while(message != quit);
}
```

OSX/iOS系统中，提供了两个这样的类，NSRunLoop 和 CFRunLoopRef：

CFRunLoopRef 是在 CoreFoundation 框架内的，它提供了纯 C 函数的 API，所有这些 API 都是线程安全的。

NSRunLoop 是基于 CFRunLoopRef 的封装，提供了面向对象的 API，但是这些 API 不是线程安全的。

关键点：

​	a. 如何管理事件/消息。

​	b. 如何让线程在没有处理消息时休眠以避免资源占用、在有消息到来时立刻被唤醒。



### 2. RunLoop对外接口

（1）CFRunLoopRef

（2）CFRunLoopModeRef（CFRunLoopModeRef 类并没有对外暴露，只是通过 CFRunLoopRef 的接口进行了封装。）

（3）CFRunLoopSourceRef

（4）CFRunLoopTimerRef

（5）CFRunLoopObserverRef

![construction](../resources/images/runloop/runloopconstruction.png)

一个 RunLoop 包含若干个 Mode，每个 Mode 又包含若干个 Source/Timer/Observer。每次调用 RunLoop 的主函数时，只能指定其中一个 Mode，这个Mode被称作 CurrentMode。如果需要切换 Mode，只能退出 Loop，再重新指定一个 Mode 进入。这样做主要是为了分隔开不同组的 Source/Timer/Observer，让其互不影响。



### 3. 内部逻辑

![construction](../resources/images/runloop/runloopflow.png)

### 4. RunLoop 的底层实现

```c
/// 用DefaultMode启动
void CFRunLoopRun(void) {
    CFRunLoopRunSpecific(CFRunLoopGetCurrent(), kCFRunLoopDefaultMode, 1.0e10, false);
}
  
/// 用指定的Mode启动，允许设置RunLoop超时时间
int CFRunLoopRunInMode(CFStringRef modeName, CFTimeInterval seconds, Boolean stopAfterHandle) {
    return CFRunLoopRunSpecific(CFRunLoopGetCurrent(), modeName, seconds, returnAfterSourceHandled);
}
  
/// RunLoop的实现
int CFRunLoopRunSpecific(runloop, modeName, seconds, stopAfterHandle) {
     
    /// 首先根据modeName找到对应mode
    CFRunLoopModeRef currentMode = __CFRunLoopFindMode(runloop, modeName, false);
    /// 如果mode里没有source/timer/observer, 直接返回。
    if (__CFRunLoopModeIsEmpty(currentMode)) return;
     
    /// 1. 通知 Observers: RunLoop 即将进入 loop。
    __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopEntry);
     
    /// 内部函数，进入loop
    __CFRunLoopRun(runloop, currentMode, seconds, returnAfterSourceHandled) {
         
        Boolean sourceHandledThisLoop = NO;
        int retVal = 0;
        do {
  
            /// 2. 通知 Observers: RunLoop 即将触发 Timer 回调。
            __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeTimers);
            /// 3. 通知 Observers: RunLoop 即将触发 Source0 (非port) 回调。
            __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeSources);
            /// 执行被加入的block
            __CFRunLoopDoBlocks(runloop, currentMode);
             
            /// 4. RunLoop 触发 Source0 (非port) 回调。
            sourceHandledThisLoop = __CFRunLoopDoSources0(runloop, currentMode, stopAfterHandle);
            /// 执行被加入的block
            __CFRunLoopDoBlocks(runloop, currentMode);
  
            /// 5. 如果有 Source1 (基于port) 处于 ready 状态，直接处理这个 Source1 然后跳转去处理消息。
            if (__Source0DidDispatchPortLastTime) {
                Boolean hasMsg = __CFRunLoopServiceMachPort(dispatchPort, &msg)
                if (hasMsg) goto handle_msg;
            }
             
            /// 通知 Observers: RunLoop 的线程即将进入休眠(sleep)。
            if (!sourceHandledThisLoop) {
                __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeWaiting);
            }
             
            /// 7. 调用 mach_msg 等待接受 mach_port 的消息。线程将进入休眠, 直到被下面某一个事件唤醒。
            /// (1) 一个基于 port 的Source 的事件。
            /// (2) 一个 Timer 到时间了
            /// (3) RunLoop 自身的超时时间到了
            /// (4) 被其他什么调用者手动唤醒
            __CFRunLoopServiceMachPort(waitSet, &msg, sizeof(msg_buffer), &livePort) {
                mach_msg(msg, MACH_RCV_MSG, port); // thread wait for receive msg
            }
  
            /// 8. 通知 Observers: RunLoop 的线程刚刚被唤醒了。
            __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopAfterWaiting);
             
            /// 收到消息，处理消息。
            handle_msg:
  
            /// 9.1 如果一个 Timer 到时间了，触发这个Timer的回调。
            if (msg_is_timer) {
                __CFRunLoopDoTimers(runloop, currentMode, mach_absolute_time())
            } 
  
            /// 9.2 如果有dispatch到main_queue的block，执行block。
            else if (msg_is_dispatch) {
                __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__(msg);
            } 
  
            /// 9.3 如果一个 Source1 (基于port) 发出事件了，处理这个事件
            else {
                CFRunLoopSourceRef source1 = __CFRunLoopModeFindSourceForMachPort(runloop, currentMode, livePort);
                sourceHandledThisLoop = __CFRunLoopDoSource1(runloop, currentMode, source1, msg);
                if (sourceHandledThisLoop) {
                    mach_msg(reply, MACH_SEND_MSG, reply);
                }
            }
             
            /// 执行加入到Loop的block
            __CFRunLoopDoBlocks(runloop, currentMode);
             
  
            if (sourceHandledThisLoop && stopAfterHandle) {
                /// 进入loop时参数说处理完事件就返回。
                retVal = kCFRunLoopRunHandledSource;
            } else if (timeout) {
                /// 超出传入参数标记的超时时间了
                retVal = kCFRunLoopRunTimedOut;
            } else if (__CFRunLoopIsStopped(runloop)) {
                /// 被外部调用者强制停止了
                retVal = kCFRunLoopRunStopped;
            } else if (__CFRunLoopModeIsEmpty(runloop, currentMode)) {
                /// source/timer/observer一个都没有了
                retVal = kCFRunLoopRunFinished;
            }
             
            /// 如果没超时，mode里没空，loop也没被停止，那继续loop。
        } while (retVal == 0);
    }
     
    /// 10. 通知 Observers: RunLoop 即将退出。
    __CFRunLoopDoObservers(rl, currentMode, kCFRunLoopExit);
}
```

【注】第七步mach_msg(msg, MACH_RCV_MSG, port);涉及到内核编程，详细内容可参考《OS X与iOS内核编程》



### 5. RunLoop应用场景

（1）开启常驻线程

AFNetworking中RunLoop的创建：

```objective-c
+ (NSThread *)networkRequestThread {
    static NSThread *_networkRequestThread = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _networkRequestThread =
        [[NSThread alloc] initWithTarget:self
                                selector:@selector(networkRequestThreadEntryPoint:)
                                  object:nil];
        [_networkRequestThread start];
    });
    return _networkRequestThread;
}

+ (void)networkRequestThreadEntryPoint:(id)__unused object {
    @autoreleasepool {
        [[NSThread currentThread] setName:@"AFNetworking"];

        NSRunLoop *runLoop = [NSRunLoop currentRunLoop];
         // 这里主要是监听某个 port，目的是让这个 Thread 不会回收
        [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode]; 
        [runLoop run];
    }
}
```

（2）通过RunLoop的NSDefaultRunLoopMode状态，可以捕获ScrollView、TableView处于非滑动状态，在此Mode中进行一些UI操作（如填充图片、渲染文字等），可以避免在滑动时，主线程处理太多UI事件造成卡顿。

（3）在一定时间内监听某种事件，或执行某种任务的线程

这种场景一般会出现在，如我需要在应用启动之后，在一定时间内持续更新某项数据。如下代码，在30分钟内，每隔30s执行onTimerFired:

```objective-c
@autoreleasepool {
    NSRunLoop * runLoop = [NSRunLoop currentRunLoop];
    NSTimer * udpateTimer = [NSTimer timerWithTimeInterval:30
                                                    target:self
                                                  selector:@selector(onTimerFired:)
                                                  userInfo:nil
                                                   repeats:YES];
    [runLoop addTimer:udpateTimer forMode:NSRunLoopCommonModes];
    [runLoop runUntilDate:[NSDate dateWithTimeIntervalSinceNow:60*30]];
}
```



## 三、Runtime

### 1. Method Swizzling

### 参考链接http://tech.glowing.com/cn/method-swizzling-aop/

#### 【示例】通过Method Swizzling实现Log日志

（1）首先定义一个类别，添加将要 Swizzled 的方法：

```objective-c
@implementation UIViewController (Logging)

- (void)swizzled_viewDidAppear:(BOOL)animated
{

	// call original implementation
	[self swizzled_viewDidAppear:animated];

  	// Logging
	[Logging logWithEventName:NSStringFromClass([self class])];
}
```

（2）接下来实现 swizzle 的方法 ：

```objective-c
@implementation UIViewController (Logging)

void swizzleMethod(Class class, SEL originalSelector, SEL swizzledSelector)  
{

	// the method might not exist in the class, but in its superclass
	Method originalMethod = class_getInstanceMethod(class, originalSelector);
	Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

	// class_addMethod will fail if original method already exists
	BOOL didAddMethod = class_addMethod(class, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));

	// the method doesn’t exist and we just added one
	if (didAddMethod) {
		class_replaceMethod(class, swizzledSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
	}else {
		method_exchangeImplementations(originalMethod, swizzledMethod);
	}
}
```

（3）最后，我们只需要确保在程序启动的时候调用 swizzleMethod 方法。比如，我们可以在类别里添加 +load: 方法，然后在 +load: 里把 viewDidAppear 给替换掉：

```objective-c
@implementation UIViewController (Logging)

+ (void)load
{
  	swizzleMethod([self class], @selector(viewDidAppear:), @selector(swizzled_viewDidAppear:));
}
```

【注】一般情况下，类别里的方法会重写掉主类里相同命名的方法。如果有两个类别实现了相同命名的方法，只有一个方法会被调用。但 +load: 是个特例，当一个类被读到内存的时候， runtime 会给这个类及它的每一个类别都发送一个 +load: 消息。

（4）其实，这里还可以更简化点：直接用新的 IMP 取代原 IMP ，而不是替换。只需要有全局的函数指针指向原 IMP 就可以。

```objective-c
void (gOriginalViewDidAppear)(id, SEL, BOOL);

void newViewDidAppear(UIViewController *self, SEL _cmd, BOOL animated)  
{
	// call original implementation
	gOriginalViewDidAppear(self, _cmd, animated);

	// Logging
	[Logging logWithEventName:NSStringFromClass([self class])];
}

+ (void)load
{
	Method originalMethod = class_getInstanceMethod(self, @selector(viewDidAppear:));
	gOriginalViewDidAppear = (void *)method_getImplementation(originalMethod);
	if(!class_addMethod(self, @selector(viewDidAppear:), (IMP) newViewDidAppear, method_getTypeEncoding(originalMethod))) {
		method_setImplementation(originalMethod, (IMP) newViewDidAppear);
	}
}
```



## 四、消息机制

### 参考链接[http://draveness.me/message.html](http://draveness.me/message.html)

### 1. Objective-C 中给一个对象发送消息会经过以下几个步骤：

（1）在对象类的 dispatch table 中尝试找到该消息。如果找到了，跳到相应的函数IMP去执行实现代码；

（2）如果没有找到，Runtime 会发送 +resolveInstanceMethod: 或者 +resolveClassMethod: 尝试去 resolve 这个消息；

（3）如果 resolve 方法返回 NO，Runtime 就发送 -forwardingTargetForSelector: 允许你把这个消息转发给另一个对象；

（4）如果没有新的目标对象返回， Runtime 就会发送 -methodSignatureForSelector: 和 -forwardInvocation: 消息。你可以发送 -invokeWithTarget: 消息来手动转发消息或者发送 -doesNotRecognizeSelector: 抛出异常。

利用 Objective-C 的 runtime 特性，我们可以自己来对语言进行扩展，解决项目开发中的一些设计和技术问题。



## 五、算法