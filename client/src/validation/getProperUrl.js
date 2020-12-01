const getProperUrl = (url) => {
  if (typeof url === "string" && url.trim().length > 0) {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    else return "https://" + url;
  }
};

export default getProperUrl;
