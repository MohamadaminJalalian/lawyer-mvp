import { createWorker } from "tesseract.js";

/**
 * از روی یه تصویر متن می‌خونه (فارسی + انگلیسی).
 * ورودی: آدرس تصویر (می‌تونه لینک باشه یا یه فایل محلی که کاربر آپلود کرده)
 * خروجی: متنی که از روی تصویر خونده شده
 */
export async function extractTextFromImage(
  imageSource: string | File
): Promise<string> {
  const worker = await createWorker(["fas", "eng"]);

  try {
    const {
      data: { text },
    } = await worker.recognize(imageSource);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}