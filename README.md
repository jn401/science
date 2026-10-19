# 附小科学实验室

玉溪师范学院附属小学科学实验室，科学家培养基地。

这是可持续增加实验资源的静态网站基础版本，适配桌面、手机横屏和竖屏。所有字体、图片和脚本都保存在仓库内，无第三方 CDN、数据库、登录或运行时付费接口。

**当前没有已开放的虚拟实验。** 显微镜标记为“待接入”，原有程序未迁移、未重写；风、放大镜为“规划中”。示意插画只是关键器材图片，不是实验运行画面。

## 已有功能

- 首页展示学校名称与“科学家培养基地”，红色“虚拟实验室原则”可展开。
- 实验目录支持名称、器材、年级搜索，以及领域、状态筛选；筛选条件写入网址，刷新或返回时可保留。
- 实验卡片、器材图片、模块详情、未知模块提示、加载失败重试、无结果重置。
- 为真实实验准备统一运行外壳、返回目录、全屏能力检测与单独打开入口。未开放模块不能进入该外壳。
- 本地维护、目录校验、静态打包和真实程序接入说明。

## 目录

```text
index.html                 首页
catalog.html               可搜索、筛选的实验目录
experiment.html            模块说明，通过 ?id=microscope 选择
launch.html                真实实验通用外壳（尚无已接入模块）
404.html / .nojekyll        静态托管文件
assets/css/                响应式样式
assets/js/                 页面行为与入口校验
assets/images/             本地 SVG 器材插画
data/experiments.json      唯一的实验目录数据源
experiments/               独立实验程序目录
guides/                    部署与接入说明、验收记录
scripts/                   预览、校验、打包工具
tests/                     目录契约和入口规则测试
dist/                      生成的纯静态发布包（不提交）
```

## 本地运行

维护工具要求 Node.js 20 或更新版本，无需安装任何 npm 依赖：

```sh
npm run dev
```

打开 `http://127.0.0.1:4173/`。页面通过读取 JSON 加载目录，应通过 HTTP 访问，不要直接双击 HTML。也可以使用 `python3 -m http.server 4173 --bind 127.0.0.1`。

```sh
npm run check
npm test
npm run build
```

`dist/` 为可以直接上传的发布内容，不需要 Node.js 在托管平台运行。`npm run dev` 同时支持 `http://127.0.0.1:4173/science/`，供检查 GitHub Pages 的项目子路径。

## 部署

**腾讯云：** 将 `dist/` 中的内容保持目录结构上传，首页设为 `index.html`，错误页设为 `404.html`。本项目不会自动连接或修改现有腾讯云环境。CloudBase 默认域名的使用范围与当前套餐以控制台为准，不承诺永久免费或默认域名可长期用于正式服务。

**GitHub Pages（无需自有域名）：** 在本仓库 Settings → Pages 中选择 **Deploy from a branch → main → / (root)**，点击 Save。无需填写 Custom domain。成功发布后的预期网址为 `https://jn401.github.io/science/`，以 Pages 设置中显示的实际发布状态为准。提交文件本身不代表网站已经发布。

GitHub 官方支持公开仓库使用 GitHub Free 的 Pages。部署步骤与腾讯云目录上传说明见 [部署指南](guides/DEPLOYMENT.md)，依据 [GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 和 [CloudBase 静态项目部署文档](https://docs.cloudbase.net/hosting/web-hosting-static)。

## 增加实验

每个实验使用独立目录，只需向 `data/experiments.json` 新增记录，即可出现在首页和目录中。详见 [实验接入指南](guides/ADDING_EXPERIMENTS.md)。正式开放前应检查原程序、素材路径、手机操作和科学内容，再把 `status` 改成 `ready`。

原有显微镜程序建议完整保存在 `experiments/microscope/original/` 中。保留原程序的版权及来源信息；本项目没有替它声明授权。

## 验证边界

浏览器检查与设备实测分别记录在 [验收记录](guides/VERIFICATION.md)。基础网站的移动布局通过浏览器模拟检查，不代表尚未接入的显微镜程序已完成手机触控或实验功能验证。仓库提交、托管平台启用和公网访问是三个独立状态。
