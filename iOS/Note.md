<a id="top" name="top"></a>

# 一、 关于私有Pod库

1. 依赖第三方库的头文件，都要写全路径，如#import <SocketRocket/SRWebSocket.h>
2. 内部子Podspec依赖，一定要协全面，否则在提交podspec文件时，每个子spec都会拿出来单独编译，会报找不到依赖的文件
3. 当库中依赖了.a文件时，要写入ss.vendored_libraries = "xx/yy/*.a"
4. podspec文件合法性验证

```shell
pod spec lint VGCloudIM.podspec --use-libraries --verbose --sources='git@host:iOS/Pods/Specs.git','https://github.com/CocoaPods/Specs.git'
```

5. podspec文件提交

```shell
pod repo push KKSpecs VGCloudIM.podspec --use-libraries --verbose --allow-warnings
```

6. 一份较完整的podspec文件示例

```xml
Pod::Spec.new do |s|

  s.name         = "VGCloudIM"
  s.version      = "5"
  s.summary      = "VGCloudIM."

  s.description  = <<-DESC
                    this is VGCloudIM
                   DESC

  s.homepage     = "http://host/iOS/Pods/VGCloudIM"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author             = { "naibin" => "nbliu@aaa.com" }

  s.platform     = :ios, "7.0"
  s.source       = { :git => "http://nbliu@host/iOS/Pods/VGCloudIM.git", :tag => s.version.to_s }

  s.source_files  = "VGCloudIM/VGCloudIM/VGCloudIM.h"

  s.subspec 'UserInterface' do |ss|
    ss.dependency 'VGCloudIM/Tool'
    ss.dependency 'VGCloudIM/Config'

    ss.source_files = 'VGCloudIM/VGCloudIM/UserInterface//*.{h,m}'
    ss.public_header_files = 'VGCloudIM/VGCloudIM/UserInterface//*.h'

  end

  s.subspec 'Config' do |ss|
    ss.source_files = 'VGCloudIM/VGCloudIM/Config//*.{h,m}'
    ss.public_header_files = 'VGCloudIM/VGCloudIM/Config//*.h'
  end

  s.subspec 'Resource' do |ss|
    ss.resources = "VGCloudIM/VGCloudIM/Resource/Image/.png"
    ss.source_files = "VGCloudIM/VGCloudIM/Resource/Class/**/.{h,m}"
    ss.public_header_files = "VGCloudIM/VGCloudIM/Resource/Class/*/.h"
    ss.vendored_libraries = "VGCloudIM/VGCloudIM/Resource/StaticLibrary/*.a"
  end

  s.requires_arc = true

  s.dependency "AFNetworking"
  s.dependency "SocketRocket"
  s.dependency "SDWebImage"

end
```

