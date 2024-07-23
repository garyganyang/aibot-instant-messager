module.exports = {
  devServer: {
    port: 3003,
    proxy: {
      "/chatgpt-im-api": {
        target: "http://localhost:18801",
        ws: false,
        changeOrigin: true
      },
      "/llm-api/coze": {
        // target: "http://123.249.97.158",
        target: "https://api.coze.cn",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/llm-api/coze': ''
        },
        onProxyRes(proxyRes, req, res) {
          const realUrl = process.env.BASEURL + req.url || '';
          console.log(realUrl);
          proxyRes.headers['A-Real-Url'] = realUrl;
        }
      }
    }
  }
}
