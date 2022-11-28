interface Args {
  dateString: string;
  delimiter: '/' | '-';
}

export default function formatDateString({ dateString, delimiter }: Args) {
  return dateString.slice(0, 10).replace(/:/g, delimiter);
}
