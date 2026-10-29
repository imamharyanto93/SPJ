import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Unduh elemen dokumen HTML sebagai file PDF A4 berkualitas tinggi
 * Mendukung ekspor multi-halaman untuk bundel 4 dokumen secara rapi
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string,
  onProgress?: (status: string) => void
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const pages = container.querySelectorAll<HTMLElement>('.print-page');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  if (pages.length > 0) {
    // Multi-page bundel export: setiap dokumen diproses ke halaman PDF tersendiri
    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      onProgress?.(`Memproses dokumen ${i + 1} dari ${pages.length}...`);

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: pageEl.scrollWidth || 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  } else {
    // Single page fallback
    onProgress?.('Mengonversi dokumen...');
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: container.scrollWidth,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  onProgress?.('Menyimpan file PDF...');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * Cetak langsung melalui window.print() dengan isolasi halaman cetak resmi
 */
export function printDocument(): void {
  document.body.classList.add('is-printing-document');

  // Beri sedikit jeda agar DOM & CSS render stabil sebelum dialog cetak browser muncul
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove('is-printing-document');
    }, 400);
  }, 80);
}
