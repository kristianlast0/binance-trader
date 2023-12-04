export function darkenHex(color: string, percent: number): string {
  color = color.replace(/^\s*#|\s*$/g, '');
  if(color.length == 3) color = color.replace(/(.)/g, '$1$1');
  var r = parseInt(color.slice(0, 2), 16),
      g = parseInt(color.slice(2, 4), 16),
      b = parseInt(color.slice(4, 6), 16);
  r = Math.floor(r * (100 - percent) / 100);
  g = Math.floor(g * (100 - percent) / 100);
  b = Math.floor(b * (100 - percent) / 100);
  return "#" +
    (r < 16 ? "0" + r.toString(16) : r.toString(16)) +
    (g < 16 ? "0" + g.toString(16) : g.toString(16)) +
    (b < 16 ? "0" + b.toString(16) : b.toString(16));
}

export function hexToRGB(hex: string, alpha: number): string {
  if(!hex || hex == '') return "";
  var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  if (alpha) return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  else return "rgb(" + r + ", " + g + ", " + b + ")";
}