<a id="top" name="top"></a>

# 一、启动后App界面没有填充满

准备一张尺寸:1125 * 2436的启动图片, 移动到LaunchImage的Finder目录中, 并在LaunchImage中的Contents.json文件中增加 (注意Json格式)：

```json
{
    "extent" : "full-screen",
    "idiom" : "iphone",
    "subtype" : "2436h",
    "filename" : "图片名字.png",
    "minimum-system-version" : "11.0",
    "orientation" : "portrait",
    "scale" : "3x"
}
```



# 二、TabBar被虚拟键遮挡

TabBar位置太靠下，被虚拟键遮挡。

之前TabBar高度固定为49，iPhone X之后TabBar高度不再固定。



# 三、UIScrollView实例下移20/64像素



