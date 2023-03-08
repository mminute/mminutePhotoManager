export default function makeQuotedList(list: string[]) {
  return list.map((item) => `"${item}"`).join(', ');
}
