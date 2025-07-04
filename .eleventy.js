const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");


module.exports = function(eleventyConfig) {

// 必須：Nunjucks を Frontmatter パーサーとして設定
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    engines: {
      njk: require("nunjucks"),
    },
  });

  // markdown-it に画像URLを pathPrefix付きに変換するプラグインを作成
  const imagePrefixPlugin = (md) => {
  const defaultRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    // 特に処理しない、つまりそのまま通す
    return defaultRender(tokens, idx, options, env, self);
  };
};


  // Markdown-itの設定（HTMLタグ許可、改行を<br>に変換）、プラグイン追加
  eleventyConfig.setLibrary("md", markdownIt({ 
    html: true,
    breaks: true
  }).use(imagePrefixPlugin));
  

  // 静的ファイルのパススルー設定
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
　eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // firstImage フィルター
  eleventyConfig.addFilter("firstImage", function(content) {
    if (!content || typeof content !== "string") return null;

    // HTML内画像の src をそのまま取得するだけ
    const htmlMatch = content.match(/<img.*?src=["'](.*?)["']/);
    if (htmlMatch) return htmlMatch[1];

    // Markdown画像のパターンは無視または別途処理
    return null;
  });

  // コレクション例: 絵日記のMarkdownファイルだけを抽出
 eleventyConfig.addCollection("sketch", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/sketch/*.md").reverse();
});


  // 日付表示フォーマット用フィルター（Luxon利用）
  eleventyConfig.addFilter("date", function(dateObj, format = "yyyy年M月d日") {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // URLエンコード用フィルター
  eleventyConfig.addFilter("url_encode", function(value) {
    return encodeURIComponent(value);
  });
  
  eleventyConfig.setTemplateFormats(["md", "njk", "11ty.js"]);

  // pathPrefixとディレクトリ構成を指定して返す
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "layouts",
    },
    markdownTemplateEngine: "njk"  // ← ここを追加！
  };
};
