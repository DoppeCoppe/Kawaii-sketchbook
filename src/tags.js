module.exports = class {
  data() {
    return {
      pagination: {
        data: "collections",
        size: 1,
        alias: "tag",
        filter: function (key) {
          return key !== "all" && key !== "sketch";
        }
      },
      permalink: function (data) {
        return `/tags/${data.tag}/`;
      },
      layout: "tags.njk",
      tags: ["tagList"],
      eleventyComputed: {
        title: data => `#${data.tag}`
      }
    };
  }

  render({ tag, collections }) {
    return `<ul>
      ${collections[tag]
        .map(post => `<li><a href="${post.url}">${post.data.title}</a></li>`)
        .join("")}
    </ul>`;
  }
};
