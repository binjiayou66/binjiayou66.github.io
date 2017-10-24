<a id="top" name="top"></a>

# 前言

在iOS编程中，Block给我们带来了很多便利，本文主要对Block进行稍微深入一些的探究。

# 一、Block概要

## 1. Block是什么

Block是C语言的扩展。带有局部变量的匿名函数。



## 2. Block语法

### 【前置】函数指针

```c
int addFunc(int a, int b) { 
	return a + b; 
}
int (*funcptr)(int, int) = &addFunc;
```

### （1）完整格式

【^】【返回值类型】【参数列表】【表达式】

举例如下：

```c
^int (int a, int b) { return a + b; }
```

### （2）省略返回值格式

【^】【参数列表】【表达式】

```c
^(int a, int b) { printf("add result: %d", a + b); }
```

### （3）省略返回值和参数格式

【^】【表达式】

```c
^{ printf("Hello, Block."); }
```



# 二、Block本质

说Block是Objective-C的一个类，Block实例是一个对象，也是对的。

## 【前置】Clang

clang（LLVM编译器）可将编译后的代码转换为我们可读的源代码。“-rewrite-objc”选项可将含有Block语法的源代码变为C++源代码。

```shell
clang -rewrite-objc file_name.m 
```

## 1. 编译含有Block语法的代码文件

```c
#include <stdio.h>

int main() {
    void (^block)() = ^{ printf("Hello Block."); };    
    block();

    return 0;
}
```

将上述文件经过clang编译之后可以得到以下可读的源代码（只列出了重点相关部分）：

```c++
struct __block_impl {
  void *isa;
  int Flags;
  int Reserved;
  void *FuncPtr;
};

struct __main_block_impl_0 {
  struct __block_impl impl;
  struct __main_block_desc_0* Desc;
  __main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, int flags=0) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
 printf("Hello Block."); 
}

static struct __main_block_desc_0 {
  size_t reserved;
  size_t Block_size;
} __main_block_desc_0_DATA = { 0, sizeof(struct __main_block_impl_0)};

int main() {
    void (*block)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA));
    ((void (*)(__block_impl *))((__block_impl *)block)->FuncPtr)((__block_impl *)block);

    return 0;
}
```

### （1）\_\_main_block_func_0函数

在编译后的文件中，我们最先能够看到的是与我们所写的Block有相同功能的C函数：

```c
static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
 printf("Hello Block."); 
}
```

所以，我们首先能得到的一个结论是Block经过编译之后，被处理为一个普通的C函数。此处，由于Block处在main函数中，所以经编译后的方法命中包含_main_字眼，其中参数___cself_表示指向Block值的变量。

### （2）main函数代码分析

既然最终Block执行，即为\_\_main_block_func_0函数被调用，那么程序是如何执行到该函数中的呢？

我们从main函数切入，main函数只有两句代码：

a. 第一句代码

```c
void (*block)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA));
```

这句代码，其实可以转化为：

```c
__main_block_impl_0 temp = __main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA);
void (*block)() = ((void (*)())&temp;
```

这里block被声明为一个函数指针，笔者猜测是因为编译之后反编译为C++的原因，其实写成下述代码会更好理解一些：

```c
__main_block_impl_0 temp = __main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA);
__main_block_impl_0 *block = &temp;
```

这句代码中，首先通过结构体的构造函数创建了一个\_\_main_block_impl_0结构体实例，之后取该实例的地址，并将地址赋值给block指针。

这里我们关注一下\_\_main_block_impl_0结构体的构造方法。

```c
__main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, int flags=0) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
}
```

在本例中，赋值参数可表示为：

```c
isa = &_NSConcreteStackBlock;
Flags = 0;
FuncPtr = __main_block_func_0;
Desc = __main_block_desc_0_DATA;
```

这里我们主要关注一下FuncPtr指针指向了\_\_main_block_func_0函数。



b. 第二句代码

```c
((void (*)(__block_impl *))((__block_impl *)block)->FuncPtr)((__block_impl *)block);
```

这句代码可以简写为以下格式：

```c
((__block_impl *)block->FuncPtr)(block);
```

由第一句代码的分析中我们得知FuncPtr指针指向了\_\_main_block_func_0函数，所以第二句代码最终的效果即为调用了该函数。



### （3）为什么可以称Block为Objective-C中的类

a. Objective-C类的本质

id指针类型溯源：

```c
typedef struct objc_object {
    Class isa;
} *id
  
typedef struct objc_class *Class;
  
struct objc_class {
    Class isa;
    Class super_class;
    const char * name;
    long version;
    long info;
    long instance_size;
    struct objc_ivar_list * ivars;
    struct objc_method_list * * methodLists;
    struct objc_cache * cache;
    struct objc_protocol_list * protocols;
}
```

NSObject类型溯源：

```c
@interface NSObject <NSObject> {
    Class isa;
}

typedef struct objc_class *Class;
  
struct objc_class {
    Class isa;
    Class super_class;
    const char * name;
    long version;
    long info;
    long instance_size;
    struct objc_ivar_list * ivars;
    struct objc_method_list * * methodLists;
    struct objc_cache * cache;
    struct objc_protocol_list * protocols;
}
```

所以，Objective-C重的类，最终都为objc_class结构体对象，结构体首元素为Class指针，指向该类的描述。

以下Objective-C中的类定义：

```objective-c
@interface Animal : NSObjcet
{
  int val0;
  int val1;
}
@end
```

本质上可以表述为：

```c
struct Animal {
  Class isa;
  int val0;
  int val1;
}
```



b. Block结构

```c
struct __block_impl {
  void *isa;
  int Flags;
  int Reserved;
  void *FuncPtr;
};
```

通过a步骤中的对比，结合Block的结构，我们不难发现，其实Block可以看做Objective-C中的一个类，当Block被看做一个类时，该类的信息就被放在\_\_NSConcreteStackBlock中，因为Block的isa = &\_\_NSConcreteStackBlock。



# 三、 Block如何截获局部变量、修改变量

## 1. Block捕获局部变量

我们写一段代码如下，并运行：

```C
#include <stdio.h>

int main() {
	int age = 10;
    void (^block)(char[]) = ^(char *name){ printf("Hello, %s, are you %d years old?", name, age); };
    
    age = 11;
    block("Jack");

    return 0;
}

```

运行结果：Hello, Jack, are you 10 years old?

我们通过代码可以看到，调用block之前，我们修改了age的值为11，运行结果显示，block中打印的age依然为修改之前的10



# 结束语

# 【附1】参考书籍

1. 《Objective-C高级编程：iOS与OS X多线程和内存管理》 Kazuki Sakamoto Tomohiko Furumoto著 人民邮电出版社