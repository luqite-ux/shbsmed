# shbsmed.com 客户首页轮播修改复审

- 工作台任务：`230d8a6f-c78c-403f-9fa9-8d05d51b70db`（`scope=global`）
- 资料：客户《 关于公司独立站初建的反馈.docx 》及《 上海明石 banner图.rar 》中的 `1.jpg`、`2.jpg`、`3.jpg`。
- 负责人确认：网站维持英文展示；产品英文名采用站内标准拼写 `Cannula`，修正 Word 中的 `Cunnla`。
- 修改范围：首页三屏 Banner 的图片、广告文案和必要的桌面／390px 构图。附件文案是客户事实与需求来源，执行授权来自本次负责人请求。

| 编号 | 客户要求与位置 | 实现 | 正式域名桌面 | 正式域名 390px |
| --- | --- | --- | --- | --- |
| REQ-01 | 第 1 屏移除注射针／注射器背景，换射频电极和套管；绿色产品名改为 Single-use RF Electrode and RF Cannula；广告语传达微创精准热凝镇痛、安全高效、慢性疼痛精细化治疗 | 附件 `1.jpg` → `customer-rf-electrode-cannula-202610.jpg`；英文文案位于左侧安全区 | PASS：正式域名轮播第 1 屏截图、图片加载及无溢出检查 | PASS：390px 同入口截图、主体完整及无溢出检查 |
| REQ-02 | 第 2 屏虚拟机器背景改用客户素材；不得宣称产品自动化组装；广告语传达自主研发、迭代升级、严苛生产标准与微创介入器械制造能力 | 附件 `2.jpg` → `customer-cleanroom-202610.jpg`；删除 Automated Assembly 及组装线文案 | PASS：正式域名轮播第 2 屏截图、图片加载及无溢出检查 | PASS：390px 同入口截图、实拍可见及无溢出检查 |
| REQ-03 | 第 3 屏改用弯尖型射频套管图；广告语传达一站式 OEM/ODM、设计研发到量产及支持全球合作伙伴 | 附件 `3.jpg` → `customer-curved-tip-cannula-202610.jpg`；英文文案位于左侧安全区 | PASS：正式域名轮播第 3 屏截图、图片加载及无溢出检查 | PASS：390px 同入口截图、主体完整及无溢出检查 |

三张站内文件与附件原图 SHA-256 一一相同：

| 屏 | SHA-256 |
| --- | --- |
| 1 | `9ca7900fb5b9c2767d20fbe76785a1c77319958611dbffbd74f936d9836afa08` |
| 2 | `72195aba1543e82324a37c93ad2a191137450f0e49affb5defe88786cf2bee6d` |
| 3 | `4e0f4ed283c136a4c8bd3a0c6f1178582c4b87e5d5792b9ebee00cd82482e27d` |

正式域名复审会话：Codex 右侧 in-app Browser，`https://shbsmed.com/`；桌面视口 `1440×900`，手机视口 `390×844`，在本次任务的浏览器工具输出中保留六张逐屏截图。每张图片的浏览器实际 URL 均带 `?dpl=dpl_5MUNVHrhzN5cku3SzXmyMyN1pukk`，三图 `naturalSize=3840×1600`、加载成功、正式域名文件响应 `200` 且 SHA-256 与附件一致。轮播每屏 `document.documentElement.scrollWidth <= innerWidth`。独立二次复核确认三条客户原话均有对应图片、文案与双端证据，且站点没有“自动化组装”类表述。

本次代码提交 `2e6e0ce54823f0258d438dd02fa7e83aaff67076`，GitHub `main` 回读相同 SHA，Vercel Production 部署 `dpl_5MUNVHrhzN5cku3SzXmyMyN1pukk` 为 `READY`。测试 `5/5`、TypeScript 检查、Production 构建通过；ESLint `0 errors, 5 pre-existing warnings`。
