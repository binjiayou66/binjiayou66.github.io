<a id="top" name="top"></a>

# 目录

## 一、Reveal

### 1. Reveal下载、试用、安装

### 2. Reveal无侵入调试

## 二、Jailbreak Reveal

### 1. 工具准备

### 2. 打通电脑手机文件拷贝

### 3. 调整RevealServer.framework版本



# 正文

## 一、Reveal

### 1. Reveal下载、试用

​    Reveal作为iOS界面调试的强大工具，它的介绍此处就不多作介绍。

​    Reveal可以通过官网[https://revealapp.com/](https://revealapp.com/)进行下载，当然它是一款付费软件，你可以通过点击Free Trial选择14天的试用或者点击Buy now进行购买。

​    点击试用按钮来到[https://revealapp.com/download/](https://revealapp.com/download/)下载页面，通过填写邮箱和个人信息，点击Send License & Download按钮，Reveal会向填写的邮箱中发送一个试用码。页面往下滚动，大家可以选择各种版本的Reveal进行下载，试用和土豪玩家建议下载最新版本。

​    选择好版本，点击下载完成后，我们得到一个Reveal.zip压缩包，解压即可得到可运行的Reveal.app。

​    点击运行Reveal，点击Enter Activation Number可填入之前收到的使用码进行试用，或者点击Buy License支持正版。

### 2. Reveal无侵入调试

1. 选择Xcode断点界面，添加一个Symbolic Breakpoint，Symbol中填入UIApplicationMain，点击Action栏的Add Action按钮

2. 选中刚添加的断点，右击编辑断点，在Action栏中选择Debugger Command，下面文本框内填入下面的命令代码（注：代码中的Reveal.app路径，请根据实际路径进行配置），并且勾选Options栏的Automatically continue after evaluating actions

   ```python
   expr (Class)NSClassFromString(@"IBARevealLoader") == nil ? (void)dlopen("/Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/libReveal.dylib", 0x2) : ((void)0)
   ```

3. 点击空白处确认2步骤中的操作，再右击这个断点，选择Move Breakpoint To -> User

4. 重启Reveal，运行Xcode当前工程，即可使用Reveal进行界面调试啦

## 二、Jailbreak Reveal

### 1. 工具准备

1. 准备一台已经越狱好的iOS设备（iPhone、iPad、iPod）
2. 一台装好Reveal App与Homebrew的Mac电脑

### 2. 打通电脑移动设备文件传输

1. 手机端通过Cydia下载安装OpenSSH（待会电脑可以通过SFTP的方式与移动设备进行文件传输），安装完成后，移动设备通过USB连接线连接Mac

2. Mac端安装libimobiledevice

   ```Shell
   brew install libimobiledevice
   ```

   _如果失败，执行brew link --overwrite libusb,后再执行brew install libimobiledevice_

3. 桌面新建一个plist，命名为_com.usbmux.iproxy.plist_,内容如下

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.usbmux.iproxy</string>
       <key>ProgramArguments</key>
       <array>
           <string>/usr/local/bin/iproxy</string>
           <string>2222</string>
           <string>22</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
       <key>KeepAlive</key>
       <true/>
   </dict>
   </plist>
   ```

4. 给这个plist执行权限

   ```shell
   cd ~/Desktop
   chmod +x com.usbmux.iproxy.plist
   ```

5. 通过finder应用，进入_~/Library/LaunchAgents_文件夹，把刚才新建的plist文件拖入这个文件夹内，在终端运行以下语句启动proxy

   ```shell
   launchctl load ~/Library/LaunchAgents/com.usbmux.iproxy.plist
   ```

6. 之后在终端运行以下语句与移动设备进行ssh连接

   ```shell
   ssh root@localhost -p 2222
   ```

7. 提示输入密码，默认密码为_**alpine**_，显示xxxxx-iPhone:~ root#,则表示ssh环境配置连接成功

【注】上述步骤已经能够保证Mac与移动设备间文件传输了，熟悉终端命令行的同学可以通过终端命令行进行文件传输，下述步骤为安装Cyberduck App，实现可视化文件传输操作

8. 官网下载Cyberduck，[https://cyberduck.io/](https://cyberduck.io/)，下载完成后解压缩、拖拽到应用目录

9. 双击运行Cyberduck，点击新建连接，选择SFTP（SSH），填入以下信息

   ```
   服务器：localhost
   端口：2222
   用户名：root
   密码：alpine
   ```

10. 点击连接，如果主窗口中显示出移动设备文件夹目录，表示连接成功，我们可以通过此处连接进行移动设备文件操作

### 3. 调整RevealServer.framework版本

1. 通过Cyberduck，回到移动设备文件目录根目录"/"，双击来到Library，双击来到Frameworks文件目录，**【注：移动设备文件删除一定要慎重，不要动系统的文件，确保目录正确】**，右击删除移动设备中原有的RevealServer.framework

2. 运行Mac端的Reveal App，菜单栏选择Help -> Show Reveal Library in Finder -> iOS Library，讲finder中的RevealServer.framework拷贝一份，将副本拖入移动设备/Library/Frameworks/目录下

3. 终端SSH到iOS设备，执行以下命令，重启SpringBoard即可

   ```shell
   killall SpringBoard
   ```

通过以上步骤，保证了Mac端与移动端RevealServer.framework的版本一致性。

### 4. Mac端与移动端联调

1. 手机端通过Cydia下载安装Reveal2Loader（RevealLoader版本太老，不要装错了）

   _如果安装失败，在软件源中点击编辑->删除BigBoss。接着点击Tabbar上的Cydia -> 更多软件源重新安装BigBoss(比较慢).再试着安装Reveal2Loader_

2. 成功安装Reveal2Loader后，来到移动设备的“设置”应用，往下滑，可以看到多出来的Reveal选项，点击，进入子目录Enabled Applications，通过开关按钮，可以设置允许Reveal的应用

3. Mac运行Reveal，移动端运行想要Reveal的App，会在Mac Reveal App中看到手机所运行的App，表示Reveal成功

【注】联调可以通过USB连接线的方式连接，也可以通过设置移动端网络代理的方式连接