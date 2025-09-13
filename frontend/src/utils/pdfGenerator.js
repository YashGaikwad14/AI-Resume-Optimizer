import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (content, title = 'Document') => {
  try {
    // Create a temporary div to hold the content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 800px;
      padding: 20px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      background: #fff;
    `;
    
    // Add some basic styling for better PDF formatting
    const style = document.createElement('style');
    style.textContent = `
      .pdf-content h1, .pdf-content h2, .pdf-content h3 {
        color: #333;
        margin: 10px 0 5px 0;
      }
      .pdf-content h1 { font-size: 18px; }
      .pdf-content h2 { font-size: 16px; }
      .pdf-content h3 { font-size: 14px; }
      .pdf-content p { margin: 5px 0; }
      .pdf-content ul, .pdf-content ol { margin: 5px 0; padding-left: 20px; }
      .pdf-content li { margin: 2px 0; }
      .pdf-content strong { font-weight: bold; }
      .pdf-content em { font-style: italic; }
    `;
    
    tempDiv.className = 'pdf-content';
    document.head.appendChild(style);
    document.body.appendChild(tempDiv);
    
    // Generate canvas from HTML
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Clean up
    document.body.removeChild(tempDiv);
    document.head.removeChild(style);
    
    // Save the PDF
    pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const downloadAsPDF = async (htmlContent, filename) => {
  const success = await generatePDF(htmlContent, filename);
  if (!success) {
    alert('Failed to generate PDF. Please try again.');
  }
};