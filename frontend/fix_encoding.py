import os

# پسوندهایی که باید بررسی بشن
EXTENSIONS = (".ts", ".tsx", ".css", ".json", ".md")
ROOT = "./src"  # مسیر ریشه پروژه (frontend) رو اینجا بذار

fixed_files = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    # پوشه‌های حجیم و بی‌ربط رو رد کن
    dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".next", ".git")]
    for filename in filenames:
        if not filename.endswith(EXTENSIONS):
            continue
        path = os.path.join(dirpath, filename)
        try:
            with open(path, "r", encoding="utf-8-sig") as f:
                content = f.read()
        except UnicodeDecodeError:
            continue

        try:
            fixed = content.encode("cp437").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            continue  # این فایل خراب نبوده، دست نمی‌زنیم

        if fixed != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(fixed)
            fixed_files.append(path)

print(f"تعداد فایل‌های اصلاح‌شده: {len(fixed_files)}")
for p in fixed_files:
    print(" -", p)