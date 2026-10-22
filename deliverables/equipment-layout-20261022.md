# 明石设备与视频布局调整 · 2026-10-22

范围：首页及关于我们共用的生产设备、检测仪器、生产视频三块。只发布 preview.shbsmed.com，保留正式域名、www、资料和代码。

## 案例库 MCP

项目：shbsmed-equipment-20261022（company / customer）。实际查询：medical manufacturing、医疗、gallery grid reveal、gallery、淡入、staggered、reveal。

行业资料参考：Sartorius（sartorius-biopharma-lab，https://www.sartorius.com/en）。只参考库中“研究与生产场景并重”的分析，不宣称已目视审查该官网，不复用其图片、文案或源码。

已检查候选包：vengeance:staggered-grid，版本 1.0.0+d25f57c459119831e941c809000e7ffcdc6e14b28d8560806211c31b20f3e248；包内主要源码 SHA256 6b68832cb6f1e50f840790191b3ce9d07e484e7a9c6da558cf6b144f3e446e06。该包会扩展成 21 个格子、缩放和遮罩，不符合保留素材与设备完整展示的要求，未挂载、未导出。Team Reveal Grid 同样未采用。没有把搜索记录冒充组件采用。

采用方向：比例协调的横竖双图、标题与图注的分组间距、轻量错峰入场。实现为现有 PhotoGroup / Reveal 的局部适配，不复制第三方代码，不增加依赖。

## 改动

- 两组照片按真实比例分配列宽：890/461、1279/1706、1706/1280、1279/1706。保持 contain，整张图可见。
- 放大入口移回图片右下角，保留原有弹窗和键盘关闭。
- 两段原视频按 720×1280 比例排列。桌面双列、手机单列；保留原生播放控件和现有自动播放/减弱动态逻辑。
- 视频各自进入视口时轻量错峰入场。设备图片继续使用现有 Reveal；悬停只动控件，不放大或裁切图片。
- 不更改图片 URL、视频 URL、文字、模块顺序、产品和 Banner。

## 核查

- node --test tests/*.test.mjs：62 通过，0 失败（含重复导入的既有测试）。
- pnpm build：通过。
- 双端真实浏览器截图位于 .codex-delivery/equipment-*-desktop.png、equipment-*-mobile.png、inspection-*.png、videos-*.png；图像完整，390px 无横向溢出。
- 放大弹窗打开、Escape 关闭及焦点返回已验证；两段视频桌面 readyState=4，720×1280，实际播放。
- 机械检测发现既有 medical-copy-panel 左边框、Banner 圆点 width 动画两项警告，均不在本次三块内，未扩大修改。新增布局无该类问题。
- 发布前后必须回读 apex/www 仍指向 dpl_FLXESjGJhTWD9b9WVEUEHkvTgA5j；独立发布证据保存到 .codex-delivery/equipment-preview-release.json。
