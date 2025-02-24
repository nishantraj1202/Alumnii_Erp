import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsPDF } from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VerificationData {
  fullName: string;
  rollNumber: string;
  batchYear: string;
  email: string;
  placementStatus: string;
  certificateId: string;
}

export const generateVerificationForm = (data: VerificationData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoURL = "WhatsApp Image 2025-02-12 at 23.28.05_0a364ca2.jpg"; // Replace with the path to the institute's logo image
  const logoWidth = 25;  // Reduced width for better fit
const logoHeight = 25; // Reduced height
const logoX = 10; // Keeps it aligned
const logoY = 12; // Increased top margin for better spacing
doc.addImage(logoURL, "PNG", logoX, logoY, logoWidth, logoHeight);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("DR B R AMBEDKAR NATIONAL INSTITUTE OF TECHNOLOGY", 105, 25, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text("Jalandhar - 144011, Punjab (India)", pageWidth / 2, 30, { align: "center" });

  // Add Form Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ALUMNI VERIFICATION REQUEST FORM", pageWidth / 2, 45, { align: "center" });

  // Add Reference Number and Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const refNo = `Ref No: NIT/ALUMNI/${data.rollNumber}/23/2025`;
  const currentDate = new Date().toLocaleDateString('en-GB');
  doc.text(`${refNo}`, 20, 60);
  doc.text(`Date: ${currentDate}`, pageWidth - 60, 60);

  // Add Photo Box
  doc.rect(pageWidth - 50, 80, 40, 50);
  doc.setFontSize(8);
  doc.text("Affix Recent", pageWidth - 40, 95, { align: "center" });
  doc.text("Passport Size", pageWidth - 40, 100, { align: "center" });
  doc.text("Photograph", pageWidth - 40, 105, { align: "center" });

  // Add Personal Details Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1. PERSONAL DETAILS", 20, 80);

  // Add Form Fields
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const fields = [
    { label: "Full Name:", value: data.fullName },
    { label: "Roll Number:", value: data.rollNumber },
    { label: "Batch Year:", value: data.batchYear },
    { label: "Email:", value: data.email },
    { label: "Placement Status:", value: data.placementStatus },
    { label: "Certificate ID:", value: data.certificateId }
  ];

  fields.forEach((field, index) => {
    doc.text(field.label, 20, 100 + (index * 15));
    doc.text(field.value, 80, 100 + (index * 15));
  });

  // Add Declaration Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. DECLARATION", 20, 200);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const declaration = "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false or misleading information may result in the cancellation of my verification request.";
  const splitDeclaration = doc.splitTextToSize(declaration, pageWidth - 40);
  doc.text(splitDeclaration, 20, 215);

  // Add Signature Lines
  doc.line(20, 250, 80, 250);
  doc.text("Signature of Applicant", 30, 260);

  doc.line(pageWidth - 90, 250, pageWidth - 30, 250);
  doc.text("Signature of HOD", pageWidth - 75, 260);

  // Add Office Use Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. FOR OFFICE USE ONLY", 20, 280);

  // Add Verification Box
  doc.rect(20, 290, pageWidth - 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Verification Status:", 25, 300);
  doc.text("Remarks:", 25, 315);

  // Save the PDF
  const fileName = `NITJ_Verification_${data.rollNumber}.pdf`;
  doc.save(fileName);
};