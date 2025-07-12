module.exports = class {
  data() {
    return {
      pagination: {
        data: "collections.sketch",
        size: 31,
        alias: "items"
      },
      permalink: ({ pagination }) =>
        pagination.pageNumber === 0 ? "/" : `/page/${pagination.pageNumber + 1}/`,
      layout: "base.njk",
      eleventyExcludeFromCollections: true,
      title: "Kawaii Sketchbook :B"
    };
  }

  render({ items = [], pagination }) {
    const getUrlFromItem = (item) => {
      if (item?.url) return item.url;
      if (item?.data?.page?.url) return item.data.page.url;
      return "#";
    };

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

    const currentPage = pagination.pageNumber;
    const totalPages = pagination.pages.length;
    let paginationHtml = "";

    if (currentPage > 0) {
      const prevUrl = currentPage === 1 ? "/" : `/page/${currentPage}/`;
      paginationHtml += `
        <a class="pagination-button" href="${prevUrl}">
          <img src="/images/icon-prev.png" alt="prev" class="pagination-icon">
        </a>
      `;
    }

    if (currentPage < totalPages - 1) {
      const nextUrl = `/page/${currentPage + 2}/`;
      paginationHtml += `
        <a class="pagination-button" href="${nextUrl}">
          <img src="/images/icon-next.png" alt="next" class="pagination-icon">
        </a>
      `;
    }

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
