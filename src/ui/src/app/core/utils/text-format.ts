export const snakeCaseToReadable = (str: string): string => {
  return str.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
};

export const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${formattedSize} ${sizes[i]}`;
}