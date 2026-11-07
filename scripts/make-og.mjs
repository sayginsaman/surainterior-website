// Builds public/og.jpg (1200×630): a real project photograph + the brand lockup.
//   node scripts/make-og.mjs
import sharp from "sharp";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1200, H = 630;
const photo = await sharp(path.join(ROOT, "public/work/pembroke-pines-residence/01.jpg"))
  .resize(W, H, { fit: "cover", position: "attention" })
  .toBuffer();

const rings = `
  <g transform="translate(70 80) scale(0.24) translate(-576 -156)" fill="none" stroke-linecap="round">
    <ellipse cx="815" cy="338" rx="146" ry="152" stroke="#C9B9A7" stroke-width="9"/>
    <ellipse cx="792" cy="333" rx="120" ry="111" stroke="#C9B9A7" stroke-width="9" transform="rotate(4 792 333)"/>
    <ellipse cx="748" cy="330" rx="162" ry="164" stroke="#F9F5EF" stroke-width="7"/>
    <ellipse cx="762" cy="333" rx="172" ry="128" stroke="#F9F5EF" stroke-width="7" transform="rotate(-6 762 333)"/>
    <ellipse cx="770" cy="346" rx="140" ry="121" stroke="#F9F5EF" stroke-width="7" transform="rotate(8 770 346)"/>
    <ellipse cx="757" cy="336" rx="106" ry="96" stroke="#F9F5EF" stroke-width="7"/>
  </g>`;
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#141210" stop-opacity="0.86"/>
      <stop offset="0.55" stop-color="#141210" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#141210" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${rings}
  <text x="70" y="410" fill="#F9F5EF" font-family="Helvetica Neue, Helvetica, Arial" font-weight="300" font-size="58" letter-spacing="5">SURA INTERIOR</text>
  <text x="72" y="460" fill="#C9B9A7" font-family="Helvetica Neue, Helvetica, Arial" font-weight="300" font-size="17" letter-spacing="7">BEYOND DESIGN. INTO DETAIL.</text>
  <text x="72" y="560" fill="#F9F5EF" fill-opacity="0.8" font-family="Helvetica Neue, Helvetica, Arial" font-weight="400" font-size="17" letter-spacing="2">Interior design studio · Boca Raton, Florida</text>
</svg>`);

await sharp(photo).composite([{ input: overlay }]).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(ROOT, "public/og.jpg"));
console.log("public/og.jpg written");
