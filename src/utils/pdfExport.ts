import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Unduh elemen HTML sebagai file PDF A4 berkualitas tinggi
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string,
  onProgress?: (status: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  onProgress?.('Menyiapkan dokumen...');

  // Pastikan render dalam scale 2x agar teks dan logo tajam
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  onProgress?.('Mengonversi ke format PDF A4...');

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Rasio fit ke A4
  const imgWidth = pdfWidth;
  const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

  // Jika tinggi melebihi 1 halaman, buat multiple pages
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 2) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  onProgress?.('Menyimpan file PDF...');
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * Cetak langsung melalui window.print()
 */
export function printDocument(): void {
  window.print();
}
