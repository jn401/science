# 静态部署指南

本项目使用 HTML、CSS、JavaScript、JSON 与本地图像。没有服务器接口，没有外部字体或图片依赖，无需购买独立域名才能使用 GitHub Pages。

## 腾讯云静态托管

本次只提供文件，不会调用腾讯云 API，不会变更现有部署、域名或其他项目。

1. 在本地运行 `npm run build`，得到 `dist/`；也可直接使用交付的静态发布 ZIP，先解压。
2. 在**你指定的测试环境或新目录**中上传 `dist/` 内的内容，保留 `assets/`、`data/`、`experiments/` 的层级；不要只上传首页，也不要把整个 `dist` 文件夹多套一层。
3. 首页文档为 `index.html`。若支持错误文档，设置为 `404.html`。本项目使用真实 HTML 文件和查询参数，不需要 SPA 路由回退，不要把所有错误路径都改成返回首页。
4. 用平台提供的地址检查首页、目录、详情页和图片。腾讯云账号的访问范围、费用和默认域名限制，以你当前服务及控制台为准。CloudBase 默认域名可能仅用于开发测试，正式服务的域名要求应按当前规则核实。

若要在现有站点的独立子目录测试，可上传到例如 `/science/` 并访问 `/science/index.html`，避免覆盖现有首页。网站主体使用相对路径；错误文档默认针对腾讯云根路径及 GitHub `/science/`，若绑定其他子目录，需将 `404.html` 中的 `base` 改成实际路径。不要改动原有部署来测试本版本。

无需运行构建工具时，发布文件为：5 个 HTML 文件、`.nojekyll`、`assets/`、`data/`、`experiments/`。维护脚本、测试和指南不属于腾讯云必需内容。

参考：[CloudBase 纯静态项目部署](https://docs.cloudbase.net/hosting/web-hosting-static)、[腾讯云静态托管说明](https://cloud.tencent.com/document/product/876/123943)。

## GitHub Pages

本仓库采用最少配置的分支发布方式，不需要 GitHub Actions 自定义工作流或部署密钥。

1. 确认本项目文件已提交到 `jn401/science` 的 `main` 分支。
2. 打开 [仓库 Pages 设置](https://github.com/jn401/science/settings/pages)。
3. 在 Build and deployment 中选择 Source: **Deploy from a branch**，Branch: **main**，Folder: **/ (root)**，点击 Save。
4. 等待 GitHub 内置发布流程完成；以设置页显示的 URL 为准。预期为 `https://jn401.github.io/science/`。
5. 不填写 Custom domain，不需要 `CNAME` 文件。本仓库已有 `.nojekyll`，静态资源会按原目录提供。

如发布后为 404，先查看 Pages 设置和 Actions 的内置发布结果，再确认入口在根目录，发布分支为 `main`。提交成功不等于已启用 Pages。公开仓库的 Pages 在 GitHub Free 下可用；实际网络可达性需在学校与家庭网络分别测试。

参考：[GitHub 发布来源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[GitHub 创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 每次更新

改目录数据或新增实验 → 本地预览 → 检查和测试 → 静态打包 → 上传腾讯云指定位置，或提交 main 由已启用的 Pages 发布。两种托管互相独立，不会自动同步；发布时只操作你已选定的目标。

不要从来源不明的网页复制实验脚本直接上线。同源实验与网站在同一个信任范围内，应在接入前核对原文件。原实验涉及麦克风、摄像头或其他权限时，需要另行做功能验证；基础网站本身不申请这些权限。
