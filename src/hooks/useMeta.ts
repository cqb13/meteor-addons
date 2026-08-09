import { useEffect } from "preact/hooks";

const SITE_URL = "https://meteoraddons.com/";

const DEFAULT_DESCRIPTION =
  "A list of Meteor Client Addons automatically scraped from GitHub. Designed to make discovering and downloading Meteor addons as seamless as possible.";

function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function truncate(text: string, max = 155) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export default function useMeta({
  title,
  description,
  url = SITE_URL,
  ogTitle = title,
  noindex = false,
}: {
  title: string;
  description?: string;
  url?: string;
  ogTitle?: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    document.title = title;
    const desc = description ? truncate(description) : DEFAULT_DESCRIPTION;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", ogTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:url", url);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setCanonical(url);
  }, [title, description, url, ogTitle, noindex]);
}
