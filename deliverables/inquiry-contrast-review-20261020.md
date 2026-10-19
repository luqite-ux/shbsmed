# 询盘控件可辨识度修复

根因：普通输入框继承浅色input主题边线，验证码与刷新按钮另用slate-300，均不足以在白底清楚区分控件边界。实际浏览器回归首先失败，普通边线对比度约1.34:1。

修复只作用于inquiry-form：输入框、文本框、产品选择器及刷新按钮统一使用#64748b边线；键盘焦点使用独立蓝色轮廓。未改后台、提交API、验证码或字段。按钮统一为Send Inquiry。

真实浏览器重新加载构建后，桌面与390px八个启用控件边界均为约4.76:1，回归通过。截图inquiry-contrast-fixed-desktop.png和inquiry-contrast-fixed-mobile390.png。对应原始回读为inquiry-contrast-before.json与inquiry-contrast-after.json。只证明本次局部修复，不是Production验收。

验证：21项MJS测试通过；10项TS测试通过；Next生产构建和TypeScript通过。TS首次命令使用Windows绝对路径作为ESM加载器，导致五个文件未执行；改用file:/// URL后10项全部执行通过，未修改测试绕过失败。

受影响范围：联系页默认、验证码、产品选择器与焦点状态。其他产品图、制造布局、Banner和数据内容未改，不重跑其已通过的截图检查。
