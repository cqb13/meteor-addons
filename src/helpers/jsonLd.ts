export function setJsonLd(id: string, obj: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

export function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}
