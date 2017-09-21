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

## 【前置】Clang

clang（LLVM编译器）可将编译后的代码转换为我们可读的源代码。“-rewrite-objc”选项可将含有Block语法的源代码变为C++源代码。

```shell
clang -rewrite-objc file_name.m 
```

## （1）编译含有Block语法的代码文件

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





# 三、 Block如何截获局部变量、修改变量





# 结束语

# 【附1】参考书籍

1. 《Objective-C高级编程：iOS与OS X多线程和内存管理》 Kazuki Sakamoto Tomohiko Furumoto著 人民邮电出版社