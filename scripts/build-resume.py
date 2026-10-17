"""Builds a clean one page resume PDF using only the facts already published
on the portfolio site (no invented credentials). Pure stdlib, no dependencies."""

import os
import zlib

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "resume")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "zulfahmi-resume.pdf")

W, H = 595, 842  # A4 in points


def esc(text):
    return text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


class Page:
    def __init__(self):
        self.ops = []

    def text(self, x, y, s, size=10, font="F1", color=(0.09, 0.11, 0.08)):
        r, g, b = color
        self.ops.append(
            "BT /%s %.1f Tf %.3f %.3f %.3f rg 1 0 0 1 %.1f %.1f Tm (%s) Tj ET"
            % (font, size, r, g, b, x, y, esc(s))
        )

    def rule(self, x1, y, x2, color=(0.85, 0.88, 0.83), width=0.7):
        r, g, b = color
        self.ops.append(
            "%.2f w %.3f %.3f %.3f RG %.1f %.1f m %.1f %.1f l S" % (width, r, g, b, x1, y, x2, y)
        )

    def rect(self, x, y, w, h, color):
        r, g, b = color
        self.ops.append("%.3f %.3f %.3f rg %.1f %.1f %.1f %.1f re f" % (r, g, b, x, y, w, h))

    def stream(self):
        return "\n".join(self.ops).encode("latin-1")


p = Page()
M = 56  # left margin
CW = W - M * 2

# ---- Header band ----
p.rect(0, H - 118, W, 118, (0.063, 0.071, 0.059))
p.text(M, H - 62, "ZULFAHMI", 26, "F2", (0.945, 0.949, 0.914))
p.text(M, H - 84, "FULL STACK WEB  /  CROSS PLATFORM MOBILE  /  SMART INTERFACES", 8, "F1", (0.776, 0.933, 0.408))
p.text(M, H - 102, "Bandung, Jawa Barat, Indonesia", 9, "F1", (0.62, 0.66, 0.58))

y = H - 150

# ---- Contact line ----
p.text(M, y, "zulfahmi@zulfahmi.web.id", 9, "F1", (0.35, 0.38, 0.32))
p.text(M + 200, y, "zulfahmi.web.id", 9, "F1", (0.35, 0.38, 0.32))
p.text(M + 350, y, "github.com/f4hmii", 9, "F1", (0.35, 0.38, 0.32))
y -= 26
p.rule(M, y, W - M)
y -= 26

# ---- Profile ----
p.text(M, y, "PROFILE", 9, "F2", (0.35, 0.52, 0.12))
y -= 16
profile = [
    "I help businesses digitize their workflows and reach customers on any screen by connecting",
    "robust APIs with fast, intuitive web dashboards and mobile applications.",
    "Technology should not be complicated. No bloat, just working software.",
]
for line in profile:
    p.text(M, y, line, 9.5, "F1", (0.22, 0.25, 0.2))
    y -= 14
y -= 14

# ---- Core stack ----
p.text(M, y, "CORE STACK", 9, "F2", (0.35, 0.52, 0.12))
y -= 16
stacks = [
    ("Frontend", "React, Next.js, TypeScript, JavaScript, Tailwind CSS"),
    ("Backend", "Laravel, Node.js, Express.js, MySQL, Supabase"),
    ("Mobile", "Flutter, Dart"),
    ("Tools", "Git, GitHub, Postman, Laragon, Cloudflare Pages, Vercel"),
]
for label, val in stacks:
    p.text(M, y, label, 9, "F2", (0.22, 0.25, 0.2))
    p.text(M + 78, y, val, 9, "F1", (0.32, 0.35, 0.29))
    y -= 14
y -= 14

# ---- Workflow disciplines ----
p.text(M, y, "ENGINEERING DISCIPLINES", 9, "F2", (0.35, 0.52, 0.12))
y -= 18
disciplines = [
    ("Process and System Design", "BPMN 2.0 workflows, relational database schemas, wireframes"),
    ("Backend and API Architecture", "RESTful APIs, authentication layers, optimized SQL queries"),
    ("Web Dashboards and Portals", "Admin panels, custom CMS platforms, customer portals"),
    ("Multiplatform Mobile Apps", "Flutter and Dart builds with clean state management"),
    ("Automated Quality Testing", "Postman API validation, Katalon Studio black box suites"),
    ("Cloud and System Integration", "QRIS payment gateways, Cloudflare DNS and edge caching"),
]
for label, val in disciplines:
    p.text(M, y, label, 9, "F2", (0.22, 0.25, 0.2))
    y -= 12
    p.text(M + 12, y, val, 8.5, "F1", (0.36, 0.39, 0.33))
    y -= 15
y -= 12

# ---- Selected work ----
p.text(M, y, "SELECTED WORK", 9, "F2", (0.35, 0.52, 0.12))
y -= 18
work = [
    ("Sentra Kreasi Digital Hub", "Regional UKM community portal and local business directory"),
    ("Gesture Eats Touchless Kiosk", "MediaPipe hand tracking self service ordering kiosk"),
    ("Ngolab Member and Loyalty App", "Customer ordering portal and automated point rewards"),
    ("Maneki Strategy Platform", "Financial literacy portal with a custom content management system"),
    ("MOVr Sportswear Platform", "Mobile storefront, web admin, and automated QRIS payment"),
    ("Ngolab Express Living Lab", "F and B innovation showcase, article hub, partner onboarding"),
]
for label, val in work:
    p.text(M, y, label, 9, "F2", (0.22, 0.25, 0.2))
    y -= 12
    p.text(M + 12, y, val, 8.5, "F1", (0.36, 0.39, 0.33))
    y -= 15

# ---- Footer note ----
assert y > 90, "content overflows the page, final y = %s" % y
p.rule(M, 62, W - M)
p.text(M, 48, "Portfolio: zulfahmi.web.id", 8, "F1", (0.45, 0.48, 0.42))

content = p.stream()
compressed = zlib.compress(content, 9)

objects = []


def add(obj_bytes):
    objects.append(obj_bytes)
    return len(objects)


# 1 Catalog, 2 Pages, 3 Page, 4 Contents, 5 F1, 6 F2, 7 FontDescriptor x2
catalog_id = add(b"<< /Type /Catalog /Pages 2 0 R >>")
pages_id = add(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
page_id = add(
    (
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %d %d] "
        "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>" % (W, H)
    ).encode()
)
contents_id = add(
    b"<< /Length %d /Filter /FlateDecode >>\nstream\n" % len(compressed) + compressed + b"\nendstream"
)
add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

# Assemble
out = bytearray(b"%PDF-1.4\n")
offsets = [0]
for i, body in enumerate(objects, start=1):
    offsets.append(len(out))
    out += b"%d 0 obj\n" % i + body + b"\nendobj\n"

xref_pos = len(out)
out += b"xref\n0 %d\n" % (len(objects) + 1)
out += b"0000000000 65535 f \n"
for off in offsets[1:]:
    out += b"%010d 00000 n \n" % off
out += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objects) + 1, xref_pos)

with open(OUT, "wb") as fh:
    fh.write(bytes(out))

print("wrote", OUT, len(out), "bytes")
