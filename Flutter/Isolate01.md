<a id="top" name="top"></a>

一、Dart 使用 isolates 替代线程，所有的 Dart 代码均运行在一个 isolates 中。每一个 isolates 有自己的堆内存以确保其状态不被其它 isolates 访问。这样保证每个isolate只有一个线程，不存在锁定与同步问题。

![mult_isolate](../resources/images/flutter/mult_isolate.png)

二、Dart中常见卡线程耗时任务：1. IO操作；2. 大循环代码；

三、Demo

```dart
	//计算偶数的个数
  static int _countEven(int num) {
    int count = 0;
    while (num > 0) {
      if (num % 2 == 0) {
        count++;
      }
      num--;
    }
    return count;
  }

  static Future<int> _countEvenAsync(int num) async {
    int count = 0;
    while (num > 0) {
      if (num % 2 == 0) {
        count++;
      }
      num--;
    }
    return count;
  }

  static Future<int> _countEvenCompute(int num) async {
    // 要使用compute，必须注意的有两点:
    // 一是我们的compute中运行的函数，必须是顶级函数（不属于任何一个类的函数，如main函数）或者是static函数
    // 二是compute传参，只能传递一个参数，返回值也只有一个
    return (await compute(_countEven, num));
  }

  static Future<dynamic> _mainIsolate() async {
    final mainPort = ReceivePort();
    final newIsolate = await Isolate.spawn(_newIsolate, mainPort.sendPort);
    final newSendPort = (await mainPort.first) as SendPort;
    final nextPort = ReceivePort();
    newSendPort.send([nextPort.sendPort, 5000000000]);
    return nextPort.first;
  }

  static void _newIsolate(SendPort mainPortSendPort) async {
    final newPort = ReceivePort();
    mainPortSendPort.send(newPort.sendPort);
    newPort.listen((message) {
      final nextPortSendPort = message[0] as SendPort;
      final count = message[1] as int;
      final result = _countEven(count);
      nextPortSendPort.send(result);
      newPort.close();
    });
  }
```

