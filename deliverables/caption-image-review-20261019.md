# 产品图注清理复核

范围仅限负责人授权的产品外中文图注与空白边缘。针尖、针柄、结构、颜色及比例不得改变。

四张处理图分别对应 Brain Irrigation Needle、Epidural Treatment Needle、Ultrasound-guided Puncture Needle、PTC Needle。处理脚本只采用生成图中的背景补片，产品继续使用原始像素；`caption-background-patch-proof.json` 记录保护区变化像素为零。原图保留。

R2 文件已完成字节校验，数据库采用后的回读见 `caption-clean-after.json`。不是整张 AI 重绘图替换产品。

## 实际页面复核

使用 Codex in-app Browser，在本地 Production 构建检查 390px 与 1440px。四款详情配图与名称一致，主体完整，图注已去除；Brain Irrigation Needle 放大与关闭也已操作。截图位于 `local-visual-20261019/`，文件名为 `brain/epidural/ultrasound/ptc-clean-detail-mobile390.png` 与对应 `desktop1440.png`。

ODM 列表原双端截图为 `odm-clean-mobile390.png`、`odm-clean-desktop1440.png`。五款均保留。Huber Needle 后续改用同一原图的竖幅裁边版本，保留全部产品像素及原背景，无重绘、无补造。裁切与线上字节回读分别见 `odm-portrait-lossless-crops.json`、`odm-portrait-upload-result.json`，数据库精确采用见 `huber-portrait-after.json`。

更新后的列表截图为 `odm-portrait-grid-desktop1440.png`、`odm-portrait-grid-mobile390.png`；详情双端为 `huber-portrait-detail-mobile390.png`、`huber-portrait-detail-desktop1440.png`。已目视确认两种输液港针均完整，画幅与其它 ODM 产品协调。首次截图时图片未加载完，后续确认 complete=true 并重新取证；没有为加载过程误改容器代码。

首页受影响的三款 ODM 配图已复查，截图为 `home-odm-clean-mobile390.png`、`home-odm-clean-desktop1440.png`。主体完整、名称对应、背景连续，没有中文图注。此次使用 IAB 标签 17，已恢复视口并关闭该任务标签；未关闭用户标签。本记录不代表整站视觉 PASS。

此记录只证明本批图片处理与本地展示的核对，不替代正式线上、完整内容视觉、后台权限及终审。
