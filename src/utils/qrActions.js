/*
 * QR download & share helpers.
 * Uses fetch + Blob to bypass CORS issues with Cloudinary.
 */

async function fetchImageAsBlob(url) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('Failed to fetch image');
  return res.blob();
}

/**
 * Download QR image as PNG file.
 */
export async function downloadQR(url, filename = 'xonline-qr.png') {
  try {
    const blob = await fetchImageAsBlob(url);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || 'Download failed' };
  }
}

/**
 * Share QR via native share sheet (mobile) or fallback to download.
 */
export async function shareQR(url, method = 'Xonline', accountNumber = '') {
  const filename = `xonline-${method.toLowerCase()}-qr.png`;

  try {
    const blob = await fetchImageAsBlob(url);
    const file = new File([blob], filename, { type: blob.type || 'image/png' });

    // Try to share file + text (works on most modern mobile)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${method} QR — Xonline Wallet`,
        text: accountNumber
          ? `My ${method} account: ${accountNumber}`
          : `My ${method} QR — Xonline Wallet`,
      });
      return { ok: true, method: 'file' };
    }

    // Fallback: share text only
    if (navigator.share) {
      await navigator.share({
        title: `${method} — Xonline Wallet`,
        text: accountNumber
          ? `My ${method} account: ${accountNumber}`
          : `My ${method} QR — Xonline Wallet`,
        url,
      });
      return { ok: true, method: 'url' };
    }

    // No share API → download instead
    await downloadQR(url, filename);
    return { ok: true, method: 'download-fallback' };
  } catch (e) {
    // User cancelled share — not really an error
    if (e?.name === 'AbortError') return { ok: true, method: 'cancelled' };
    return { ok: false, error: e?.message || 'Share failed' };
  }
}
