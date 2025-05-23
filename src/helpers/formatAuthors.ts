export default function formatAuthors(authors: string[]) {
  if (authors.length === 0) return "";
  else if (authors.length === 1) return `By ${authors[0]}`;
  else if (authors.length === 2) return `By ${authors[0]} and ${authors[1]}`;
  else
    return `By ${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`;
}
