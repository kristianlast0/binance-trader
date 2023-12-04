export function hasTimestampExpired(timestampStr: string): boolean {
  // Convert the timestamp string to a number
  const timestamp: number = parseInt(timestampStr, 10);
  // Check if the conversion was successful (e.g., the input was a valid number)
  if (isNaN(timestamp)) throw new Error('Invalid timestamp provided.');
  // Get the current Unix timestamp in seconds
  const currentTimestamp: number = Math.floor(Date.now() / 1000);
  // Compare the timestamps and return true if the given timestamp is in the past
  return timestamp < currentTimestamp;
}