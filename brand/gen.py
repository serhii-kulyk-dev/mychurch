"""Генератор знака «Моя Церква»: незамкнене коло з людей + одна фігура поза ним.

Геометрія рахується, а не малюється руками: кружечки кільця з'єднані точними
дугами-філе (tangent arcs), тому SVG складається з дуг, а не з тисячі точок.
Растр рахується окремо аналітично і звіряється з SVG — якщо контур зібрано
неправильно, diff це показує.
"""
import math
import numpy as np
from PIL import Image, ImageDraw

# ---------------------------------------------------------------- параметри
R = 1.0  # радіус кільця (центри кружечків)
N = 7  # кружечків у кільці
STEP = 45.0  # крок по колу, градуси -> розрив зверху = 90°
GAP_AT = 45.0  # куди дивиться розрив
r = 0.36  # радіус кружечка кільця
rf = 0.09  # радіус філе (перемички)
RD = 1.00  # розмір відірваної фігури відносно решти: така сама людина
DIST = 1.62  # на якій відстані від центра стоїть відірвана фігура

TAU = math.tau


def vec(a):
    return np.array(a, dtype=float)


def unit(v):
    return v / np.linalg.norm(v)


def ring_centers():
    # дуга кружечків центрована навпроти розриву
    start = GAP_AT + 180 - (N - 1) * STEP / 2
    return [vec((math.cos(math.radians(start + STEP * k)),
                 math.sin(math.radians(start + STEP * k)))) for k in range(N)]


def joint(ca, cb):
    """Два центри філе для пари кружечків: (зовнішній, внутрішній)."""
    d = np.linalg.norm(cb - ca)
    u = unit(cb - ca)
    n = vec((-u[1], u[0]))
    mid = (ca + cb) / 2
    h = math.sqrt((r + rf) ** 2 - (d / 2) ** 2)
    f1, f2 = mid + n * h, mid - n * h
    return (f1, f2) if np.linalg.norm(f1) > np.linalg.norm(f2) else (f2, f1)


def tangent(c, rad, f):
    return c + rad * unit(f - c)


def ang(c, p):
    return math.atan2(p[1] - c[1], p[0] - c[0])


def outline():
    """Замкнений контур ланцюжка: список дуг (центр, радіус, a0, a1, ccw)."""
    cs = ring_centers()
    js = [joint(cs[i], cs[i + 1]) for i in range(N - 1)]  # (out, in)
    arcs = []

    def circle_arc(c, rad, p0, p1, ccw=True):
        arcs.append((c, rad, ang(c, p0), ang(c, p1), ccw))

    # старт: кружечок 0, від внутрішньої дотичної навколо вільного кінця
    p = tangent(cs[0], r, js[0][1])
    start = p
    for i in range(N - 1):
        fo, fi = js[i]
        t_a, t_b = tangent(cs[i], r, fo), tangent(cs[i + 1], r, fo)
        circle_arc(cs[i], r, p, t_a, True)  # дуга кружечка
        arcs.append((fo, rf, ang(fo, t_a), ang(fo, t_b), False))  # філе (увігнуте)
        p = t_b
    # кінцевий кружечок: навколо вільного кінця на внутрішній бік
    fo, fi = js[-1]
    t_end = tangent(cs[-1], r, fi)
    circle_arc(cs[-1], r, p, t_end, True)
    p = t_end
    for i in range(N - 2, -1, -1):
        fo, fi = js[i]
        t_b, t_a = tangent(cs[i + 1], r, fi), tangent(cs[i], r, fi)
        if i < N - 2:  # дуга кружечка на зворотному, внутрішньому боці
            circle_arc(cs[i + 1], r, p, t_b, True)
            p = t_b
        arcs.append((fi, rf, ang(fi, p), ang(fi, t_a), False))
        p = t_a
    circle_arc(cs[0], r, p, start, True)
    return arcs


def flatten(arcs, seg=2.0):
    """Дуги -> полігон (для растру й для звірки)."""
    pts = []
    for c, rad, a0, a1, ccw in arcs:
        sweep = (a1 - a0) % TAU if ccw else -((a0 - a1) % TAU)
        n = max(3, int(abs(math.degrees(sweep)) / seg))
        for k in range(n + 1):
            a = a0 + sweep * k / n
            pts.append((c[0] + rad * math.cos(a), c[1] + rad * math.sin(a)))
    return pts


def detached():
    a = math.radians(GAP_AT)
    return vec((DIST * math.cos(a), DIST * math.sin(a))), r * RD


# ------------------------------------------------------- аналітичний растр
def mask(size, pad, ss=4):
    """Точна маска знака: об'єднання кружечків, перемичок і відірваної фігури."""
    cs = ring_centers()
    dc, dr = detached()
    xs = [c[0] for c in cs] + [dc[0]]
    ys = [c[1] for c in cs] + [dc[1]]
    rs = [r] * N + [dr]
    x0, x1 = min(x - rr for x, rr in zip(xs, rs)), max(x + rr for x, rr in zip(xs, rs))
    y0, y1 = min(y - rr for y, rr in zip(ys, rs)), max(y + rr for y, rr in zip(ys, rs))
    scale = (size - 2 * pad) / max(x1 - x0, y1 - y0)
    n = size * ss
    px = (np.arange(n) + 0.5) / ss
    X = (px - pad - (size - 2 * pad - (x1 - x0) * scale) / 2) / scale + x0
    Y = (px - pad - (size - 2 * pad - (y1 - y0) * scale) / 2) / scale + y0
    gx, gy = np.meshgrid(X, Y[::-1])  # y вниз

    m = np.zeros_like(gx, dtype=bool)
    for c, rr in list(zip(cs, [r] * N)) + [(dc, dr)]:
        m |= (gx - c[0]) ** 2 + (gy - c[1]) ** 2 <= rr ** 2
    for i in range(N - 1):
        ca, cb = cs[i], cs[i + 1]
        fo, fi = joint(ca, cb)
        d = np.linalg.norm(cb - ca)
        u = unit(cb - ca)
        t = (gx - ca[0]) * u[0] + (gy - ca[1]) * u[1]
        nrm = vec((-u[1], u[0]))
        q = (gx - ca[0]) * nrm[0] + (gy - ca[1]) * nrm[1]
        h = math.sqrt((r + rf) ** 2 - (d / 2) ** 2)
        band = (t >= 0) & (t <= d) & (np.abs(q) <= h)
        out_f = ((gx - fo[0]) ** 2 + (gy - fo[1]) ** 2 >= rf ** 2)
        out_g = ((gx - fi[0]) ** 2 + (gy - fi[1]) ** 2 >= rf ** 2)
        m |= band & out_f & out_g
    img = Image.fromarray((m * 255).astype(np.uint8), "L").resize((size, size), Image.LANCZOS)
    return img, scale, (x0, y0, x1, y1), pad


def bbox():
    cs = ring_centers()
    dc, dr = detached()
    items = list(zip(cs, [r] * N)) + [(dc, dr)]
    x0 = min(c[0] - rr for c, rr in items)
    x1 = max(c[0] + rr for c, rr in items)
    y0 = min(c[1] - rr for c, rr in items)
    y1 = max(c[1] + rr for c, rr in items)
    return x0, y0, x1, y1


def alpha(size, pad, ss=4):
    """Альфа-канал знака: той самий контур, що йде в SVG, з суперсемплінгом."""
    x0, y0, x1, y1 = bbox()
    n, p = size * ss, pad * ss
    s = (n - 2 * p) / max(x1 - x0, y1 - y0)
    ox = p + (n - 2 * p - (x1 - x0) * s) / 2
    oy = p + (n - 2 * p - (y1 - y0) * s) / 2
    to = lambda q: (ox + (q[0] - x0) * s, n - (oy + (q[1] - y0) * s))
    im = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(im)
    d.polygon([to(q) for q in flatten(outline(), 0.4)], fill=255)
    dc, drad = detached()
    cx, cy = to(dc)
    rr = drad * s
    d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)
    return im.resize((size, size), Image.LANCZOS)


def to_png(size, colour=(0, 105, 224), pad_frac=0.055, bg=None, path=None):
    a = alpha(size, size * pad_frac)
    img = Image.new("RGBA", (size, size), bg if bg else (0, 0, 0, 0))
    fg = Image.new("RGBA", (size, size), colour + (255,))
    img.paste(fg, (0, 0), a)
    if path:
        img.save(path)
    return img


def path_d(pad=6.0, box=100.0):
    """Один контур знака у вигляді SVG-дуг."""
    arcs = outline()
    cs = ring_centers()
    dc, dr = detached()
    xs = [c[0] for c in cs] + [dc[0]]
    ys = [c[1] for c in cs] + [dc[1]]
    rs = [r] * N + [dr]
    x0, x1 = min(x - rr for x, rr in zip(xs, rs)), max(x + rr for x, rr in zip(xs, rs))
    y0, y1 = min(y - rr for y, rr in zip(ys, rs)), max(y + rr for y, rr in zip(ys, rs))
    s = (box - 2 * pad) / max(x1 - x0, y1 - y0)
    ox = pad + (box - 2 * pad - (x1 - x0) * s) / 2
    oy = pad + (box - 2 * pad - (y1 - y0) * s) / 2

    def P(p):
        return (ox + (p[0] - x0) * s, box - (oy + (p[1] - y0) * s))

    def pt(c, rad, a):
        return P((c[0] + rad * math.cos(a), c[1] + rad * math.sin(a)))

    d = []
    first = pt(*arcs[0][:2], arcs[0][2])
    d.append(f"M{first[0]:.2f} {first[1]:.2f}")
    for c, rad, a0, a1, ccw in arcs:
        sweep = (a1 - a0) % TAU if ccw else -((a0 - a1) % TAU)
        end = pt(c, rad, a1)
        large = 1 if abs(sweep) > math.pi else 0
        # y перевернуто: проти годинникової в математиці = від'ємний напрям у SVG
        flag = 0 if ccw else 1
        d.append(f"A{rad*s:.2f} {rad*s:.2f} 0 {large} {flag} {end[0]:.2f} {end[1]:.2f}")
    d.append("Z")
    c0, c1 = P((dc[0] - dr, dc[1])), P((dc[0] + dr, dc[1]))
    rr = dr * s
    d.append(f"M{c0[0]:.2f} {c0[1]:.2f}A{rr:.2f} {rr:.2f} 0 1 0 {c1[0]:.2f} {c1[1]:.2f}"
             f"A{rr:.2f} {rr:.2f} 0 1 0 {c0[0]:.2f} {c0[1]:.2f}Z")
    return "".join(d)


def svg(colour="#0069e0", pad=6.0, box=100.0):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box:g} {box:g}" '
            f'fill="none"><path d="{path_d(pad, box)}" fill="{colour}"/></svg>')


def check():
    """Звірка: контур із дуг має збігтися з аналітичною маскою."""
    size, pad = 512, int(512 * 0.055)
    a, scale, (x0, y0, x1, y1), _ = mask(size, pad)
    ox = pad + (size - 2 * pad - (x1 - x0) * scale) / 2
    oy = pad + (size - 2 * pad - (y1 - y0) * scale) / 2
    pts = flatten(outline(), 0.5)
    poly = [(ox + (p[0] - x0) * scale, size - (oy + (p[1] - y0) * scale)) for p in pts]
    im = Image.new("L", (size, size), 0)
    dr_ = ImageDraw.Draw(im)
    dr_.polygon(poly, fill=255)
    dc, drad = detached()
    cx, cy = ox + (dc[0] - x0) * scale, size - (oy + (dc[1] - y0) * scale)
    rr = drad * scale
    dr_.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)
    diff = np.abs(np.asarray(im, float) - np.asarray(a, float)) > 128
    return diff.sum(), size * size


if __name__ == "__main__":
    bad, total = check()
    print(f"контур vs маска: {bad} px розбіжності з {total} ({100*bad/total:.3f}%)")
    print(svg()[:200])
