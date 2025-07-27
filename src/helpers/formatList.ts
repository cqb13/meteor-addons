export default function formatList(itemList: string[]) {
  if (itemList.length === 0) return "";
  else if (itemList.length === 1) return `${itemList[0]}`;
  else if (itemList.length === 2) return `${itemList[0]} and ${itemList[1]}`;
  else
    return `${itemList.slice(0, -1).join(", ")} and ${itemList[itemList.length - 1]}`;
}
