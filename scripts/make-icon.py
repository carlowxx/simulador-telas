# Gera build/icon.png (512x512) sem dependências: tela verde com moldura sobre fundo escuro.
import struct, zlib, os

N = 512
px = bytearray(N * N * 4)

def rr(x, y, x0, y0, x1, y1, r):
    """1.0 dentro do retângulo arredondado, com antialias simples."""
    cx = min(max(x, x0 + r), x1 - r); cy = min(max(y, y0 + r), y1 - r)
    d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
    if x0 + r <= x <= x1 - r or y0 + r <= y <= y1 - r:
        inside = x0 <= x <= x1 and y0 <= y <= y1
        if not inside: return 0.0
        e = min(x - x0, x1 - x, y - y0, y1 - y)
        return max(0.0, min(1.0, e + 0.5))
    return max(0.0, min(1.0, r - d + 0.5))

def put(x, y, col, a):
    if a <= 0: return
    k = (y * N + x) * 4
    for i in range(3):
        px[k + i] = int(px[k + i] * (1 - a) + col[i] * a)
    px[k + 3] = int(max(px[k + 3], a * 255))

for y in range(N):
    for x in range(N):
        X, Y = x + 0.5, y + 0.5
        put(x, y, (24, 27, 31), rr(X, Y, 16, 16, 496, 496, 96))          # fundo
        put(x, y, (8, 8, 8), rr(X, Y, 62, 150, 450, 330, 22))            # moldura
        put(x, y, (8, 160, 22), rr(X, Y, 76, 164, 352, 316, 4))          # área verde
        put(x, y, (40, 48, 55), rr(X, Y, 352, 164, 436, 316, 4))         # barra lateral
        put(x, y, (190, 196, 202), rr(X, Y, 236, 40, 276, 150, 6))       # canaleta inox
        put(x, y, (247, 147, 30), rr(X, Y, 96, 370, 416, 392, 11))       # destaque laranja
        put(x, y, (247, 147, 30), rr(X, Y, 96, 420, 300, 442, 11))

raw = b''.join(b'\x00' + bytes(px[y * N * 4:(y + 1) * N * 4]) for y in range(N))
def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', N, N, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
out = os.path.join(os.path.dirname(__file__), '..', 'build', 'icon.png')
open(out, 'wb').write(png)
print('ok', out)
