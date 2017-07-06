# 一、iOS工程组件化

## 前言

1. cocoapods官方地址：[Cocoapods](https://guides.cocoapods.org/)

## 第一章 创建私有远程Pod库（以Github为例）

### 1. 创建github repository，用于托管私有Pod库。获取私有库地址（https://github.com/allheroes/iSpecs.git）

![ispecs](../resources/images/modulization/ispecs.png)

### 2. 将远程私有库关联至本地Pod

在终端中执行：pod repo add iOSSpecs https://github.com/allheroes/iOSSpecs.git

# 二、Target-Action解耦

