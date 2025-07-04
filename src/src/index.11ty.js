const pathPrefix = "/"; // 本番環境向けの prefix

module.exports = class {
  data() {
    return {
      pagination: {
        data: "collections.sketch", // sketch コレクションを対象
        size: 31,                    // 1ページあたり31件
        alias: "items"              // 変数名 items として渡す
      },
      permalink: ({ pagination }) =>
        pagination.pageNumber === 0 ? "/" : `/page/${pagination.pageNumber + 1}/`,
      layout: "base.njk",
      eleventyExcludeFromCollections: true,
      title: "Kawaii Sketchbook || HADAKANBONEZUMI"
    };
  }

  render({ items = [], pagination }) {
    // 安全にURLを取得し、pathPrefixを付加
    const getUrlFromItem = (item) => {
      if (item?.url) return pathPrefix + item.url.slice(1); // スラッシュ重複回避
      if (item?.data?.page?.url) return pathPrefix + item.data.page.url.slice(1);
      return "#";
    };

    // サムネイルの取得とHTML構築
    const listHtml = items.map(item => {
      if (!item) return "";

      const thumbMatch = item.templateContent?.match(/<img.*?src=["'](.*?)["']/);
      const thumbUrl = thumbMatch ? thumbMatch[1] : "";

      return `
        <div class="grid-item">
          <a href="${getUrlFromItem(item)}">
            ${thumbUrl ? `<img src="${thumbUrl}" alt="" class="thumbnail">` : ""}
          </a>
        </div>
      `;
    }).join("");

    // ページネーションHTML
    const currentPage = pagination.pageNumber;
    const totalPages = pagination.pages.length;
    let paginationHtml = "";

if (currentPage > 0) {
  const prevUrl = currentPage === 1 ? `${pathPrefix}` : `${pathPrefix}page/${currentPage}/`;
  paginationHtml += `
    <a class="pagination-button" href="${prevUrl}">
      <img src="${pathPrefix}images/icon-prev.png" alt="prev" class="pagination-icon">
    </a>
  `;
}

if (currentPage < totalPages - 1) {
  const nextUrl = `${pathPrefix}page/${currentPage + 2}/`;
  paginationHtml += `
    <a class="pagination-button" href="${nextUrl}">
      <img src="${pathPrefix}images/icon-next.png" alt="next" class="pagination-icon">
    </a>
  `;
}

    // 最終的な出力
    return `
      <section class="grid">
        ${listHtml}
      </section>
      <nav class="pagination">
        ${paginationHtml}
      </nav>
    `;
  }
};
