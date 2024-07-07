export default function robots() {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
      sitemap: "https://dimalevkin.ru/sitemap.xml",
    };
  }