/**
 * Standar Antropometri Indeks Massa Tubuh menurut Umur (IMT/U) Anak Usia 0 - 60 Bulan
 * Berdasarkan Permenkes RI No. 2 Tahun 2020 & Standar Pertumbuhan Anak WHO (WHO Child Growth Standards).
 */

export interface WhoBmiPoint {
  ageMonths: number;
  sd3neg: number; // -3 SD (Batas Gizi Buruk)
  sd2neg: number; // -2 SD (Batas Gizi Kurang)
  sd1neg: number; // -1 SD
  median: number; // Median (0 SD)
  sd1pos: number; // +1 SD (Batas Berisiko Gizi Lebih)
  sd2pos: number; // +2 SD (Batas Gizi Lebih / Overweight)
  sd3pos: number; // +3 SD (Batas Obesitas)
}

// Data Standar WHO BMI-for-Age Laki-laki (0 - 60 Bulan)
export const whoBmiBoys: WhoBmiPoint[] = [
  { ageMonths: 0,  sd3neg: 11.1, sd2neg: 12.2, sd1neg: 13.4, median: 14.8, sd1pos: 16.3, sd2pos: 18.1, sd3pos: 20.2 },
  { ageMonths: 3,  sd3neg: 13.0, sd2neg: 14.3, sd1neg: 15.7, median: 17.2, sd1pos: 18.8, sd2pos: 20.6, sd3pos: 22.8 },
  { ageMonths: 6,  sd3neg: 13.3, sd2neg: 14.5, sd1neg: 15.9, median: 17.3, sd1pos: 18.9, sd2pos: 20.7, sd3pos: 22.8 },
  { ageMonths: 9,  sd3neg: 13.2, sd2neg: 14.4, sd1neg: 15.7, median: 17.1, sd1pos: 18.6, sd2pos: 20.4, sd3pos: 22.4 },
  { ageMonths: 12, sd3neg: 13.0, sd2neg: 14.1, sd1neg: 15.4, median: 16.8, sd1pos: 18.3, sd2pos: 20.0, sd3pos: 21.9 },
  { ageMonths: 18, sd3neg: 12.6, sd2neg: 13.7, sd1neg: 14.9, median: 16.2, sd1pos: 17.6, sd2pos: 19.2, sd3pos: 21.0 },
  { ageMonths: 24, sd3neg: 12.4, sd2neg: 13.4, sd1neg: 14.5, median: 15.7, sd1pos: 17.1, sd2pos: 18.7, sd3pos: 20.4 },
  { ageMonths: 36, sd3neg: 12.1, sd2neg: 13.1, sd1neg: 14.2, median: 15.4, sd1pos: 16.7, sd2pos: 18.2, sd3pos: 19.9 },
  { ageMonths: 48, sd3neg: 12.0, sd2neg: 12.9, sd1neg: 14.0, median: 15.3, sd1pos: 16.6, sd2pos: 18.1, sd3pos: 19.8 },
  { ageMonths: 60, sd3neg: 11.9, sd2neg: 12.8, sd1neg: 13.9, median: 15.3, sd1pos: 16.6, sd2pos: 18.2, sd3pos: 20.0 },
];

// Data Standar WHO BMI-for-Age Perempuan (0 - 60 Bulan)
export const whoBmiGirls: WhoBmiPoint[] = [
  { ageMonths: 0,  sd3neg: 10.9, sd2neg: 12.0, sd1neg: 13.2, median: 14.6, sd1pos: 16.2, sd2pos: 18.0, sd3pos: 20.1 },
  { ageMonths: 3,  sd3neg: 12.6, sd2neg: 13.8, sd1neg: 15.2, median: 16.8, sd1pos: 18.5, sd2pos: 20.4, sd3pos: 22.6 },
  { ageMonths: 6,  sd3neg: 12.9, sd2neg: 14.1, sd1neg: 15.5, median: 17.0, sd1pos: 18.7, sd2pos: 20.6, sd3pos: 22.7 },
  { ageMonths: 9,  sd3neg: 12.8, sd2neg: 14.0, sd1neg: 15.3, median: 16.8, sd1pos: 18.4, sd2pos: 20.2, sd3pos: 22.3 },
  { ageMonths: 12, sd3neg: 12.6, sd2neg: 13.7, sd1neg: 14.9, median: 16.4, sd1pos: 18.0, sd2pos: 19.8, sd3pos: 21.8 },
  { ageMonths: 18, sd3neg: 12.2, sd2neg: 13.2, sd1neg: 14.4, median: 15.8, sd1pos: 17.3, sd2pos: 19.0, sd3pos: 20.9 },
  { ageMonths: 24, sd3neg: 12.0, sd2neg: 13.0, sd1neg: 14.1, median: 15.4, sd1pos: 16.8, sd2pos: 18.5, sd3pos: 20.3 },
  { ageMonths: 36, sd3neg: 11.8, sd2neg: 12.7, sd1neg: 13.8, median: 15.1, sd1pos: 16.5, sd2pos: 18.1, sd3pos: 19.9 },
  { ageMonths: 48, sd3neg: 11.7, sd2neg: 12.6, sd1neg: 13.7, median: 15.1, sd1pos: 16.5, sd2pos: 18.2, sd3pos: 20.1 },
  { ageMonths: 60, sd3neg: 11.6, sd2neg: 12.5, sd1neg: 13.6, median: 15.2, sd1pos: 16.7, sd2pos: 18.5, sd3pos: 20.5 },
];

export type ImtCategoryType =
  | "Gizi Buruk"
  | "Gizi Kurang"
  | "Gizi Baik (Normal)"
  | "Berisiko Gizi Lebih"
  | "Gizi Lebih (Overweight)"
  | "Obesitas";

export interface ImtAssessment {
  imtValue: number;
  zScore: number;
  category: ImtCategoryType;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeColorClass: string;
  clinicalSummary: string;
  parentFriendlyAdvice: string;
}

/**
 * Menghitung Indeks Massa Tubuh (IMT / BMI)
 * Formula: Berat Badan (kg) / [Tinggi Badan (m)]^2
 */
export function calculateImt(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  const imt = weightKg / (heightM * heightM);
  return Number(imt.toFixed(2));
}

/**
 * Menilai Kategori Status Gizi IMT/U Balita berdasarkan umur dan jenis kelamin
 */
export function assessImt(
  imtValue: number,
  ageMonths: number,
  gender: "L" | "P" = "L"
): ImtAssessment {
  if (imtValue <= 0) {
    return {
      imtValue: 0,
      zScore: 0,
      category: "Gizi Baik (Normal)",
      color: "#15803d",
      badgeBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200",
      badgeText: "text-emerald-800",
      badgeColorClass: "bg-emerald-100 text-emerald-800",
      clinicalSummary: "Data tinggi atau berat badan belum lengkap.",
      parentFriendlyAdvice: "Pastikan penimbangan dan pengukuran panjang badan dilakukan secara akurat di Posyandu.",
    };
  }

  const standards = gender === "P" ? whoBmiGirls : whoBmiBoys;

  // Temukan referensi umur terdekat
  let ref = standards[0];
  for (let i = 0; i < standards.length; i++) {
    if (ageMonths >= standards[i].ageMonths) {
      ref = standards[i];
    } else {
      break;
    }
  }

  // Hitung aproksimasi Z-score
  let zScore = 0;
  if (imtValue >= ref.median) {
    const diff = ref.sd1pos - ref.median;
    zScore = diff > 0 ? (imtValue - ref.median) / diff : 0;
  } else {
    const diff = ref.median - ref.sd1neg;
    zScore = diff > 0 ? (imtValue - ref.median) / diff : 0;
  }
  zScore = Number(zScore.toFixed(2));

  // Klasifikasi Permenkes No. 2 / WHO:
  let category: ImtCategoryType = "Gizi Baik (Normal)";
  let color = "#15803d";
  let badgeBg = "bg-emerald-50";
  let badgeBorder = "border-emerald-200";
  let badgeText = "text-emerald-800";
  let badgeColorClass = "bg-emerald-100 text-emerald-800";
  let clinicalSummary = "Proporsi berat terhadap tinggi badan seimbang (eutrofia). Pertumbuhan ideal.";
  let parentFriendlyAdvice = "Hebat! Pertumbuhan si kecil sangat proporsional. Lanjutkan pola makan bergizi seimbang dan ASI/makanan pendamping ASI yang variatif.";

  if (zScore < -3.0) {
    category = "Gizi Buruk";
    color = "#dc2626";
    badgeBg = "bg-rose-50";
    badgeBorder = "border-rose-200";
    badgeText = "text-rose-800";
    badgeColorClass = "bg-rose-100 text-rose-800";
    clinicalSummary = "Severe wasting / gizi buruk. Wajib rujukan medis segera ke Puskesmas/Sp.A untuk tata laksana F-75/F-100.";
    parentFriendlyAdvice = "Perhatian Ayah & Ibu: Berat badan si kecil sangat kurang dibandingkan panjang tubuhnya. Segera konsultasikan ke Bidan Desa atau Puskesmas untuk evaluasi nutrisi.";
  } else if (zScore < -2.0) {
    category = "Gizi Kurang";
    color = "#ea580c";
    badgeBg = "bg-amber-50";
    badgeBorder = "border-amber-200";
    badgeText = "text-amber-800";
    badgeColorClass = "bg-amber-100 text-amber-800";
    clinicalSummary = "Wasting moderat. Berikan intervensi Pemberian Makanan Tambahan (PMT) Pemulihan tinggi protein hewani selama 90 hari.";
    parentFriendlyAdvice = "Si kecil membutuhkan tambahan nutrisi padat gizi (seperti telur, daging ayam, ikan) agar berat badannya naik seimbang dengan tinggi badannya.";
  } else if (zScore <= 1.0) {
    category = "Gizi Baik (Normal)";
    color = "#15803d";
    badgeBg = "bg-emerald-50";
    badgeBorder = "border-emerald-200";
    badgeText = "text-emerald-800";
    badgeColorClass = "bg-emerald-100 text-emerald-800";
    clinicalSummary = "Proporsi tubuh normal sesuai baku rujukan WHO. Lanjutkan pemantauan rutin bulanan di Posyandu.";
    parentFriendlyAdvice = "Pola makan dan tumbuh kembang si kecil saat ini sangat ideal. Tetap jaga asupan gizi seimbang dan aktivitas bermain yang aktif.";
  } else if (zScore <= 2.0) {
    category = "Berisiko Gizi Lebih";
    color = "#ca8a04";
    badgeBg = "bg-yellow-50";
    badgeBorder = "border-yellow-200";
    badgeText = "text-yellow-800";
    badgeColorClass = "bg-yellow-100 text-yellow-800";
    clinicalSummary = "Indikasi penumpukan massa tubuh berlebih. Lakukan evaluasi pola konsumsi cemilan manis atau susu formula berkalori tinggi.";
    parentFriendlyAdvice = "Perhatikan asupan gula, biskuit manis, atau minuman kemasan. Ajak si kecil lebih banyak bergerak dan aktif bermain fisik.";
  } else if (zScore <= 3.0) {
    category = "Gizi Lebih (Overweight)";
    color = "#ea580c";
    badgeBg = "bg-orange-50";
    badgeBorder = "border-orange-200";
    badgeText = "text-orange-800";
    badgeColorClass = "bg-orange-100 text-orange-800";
    clinicalSummary = "Overweight pada balita. Waspadai risiko sindrom metabolik awal atau kaitan stunting tersembunyi (stunted obesity). Konseling gizi keluarga.";
    parentFriendlyAdvice = "Berat badan si kecil di atas batas ideal. Jangan lakukan diet ketat sendiri, tetapi konsultasikan ke nutrisionis Posyandu/Puskesmas untuk takaran porsi yang sehat.";
  } else {
    category = "Obesitas";
    color = "#7c3aed";
    badgeBg = "bg-purple-50";
    badgeBorder = "border-purple-200";
    badgeText = "text-purple-800";
    badgeColorClass = "bg-purple-100 text-purple-800";
    clinicalSummary = "Obesitas anak tingkat lanjut (Z-Score > +3 SD). Konseling dokter spesialis anak untuk penapisan resistensi insulin & gangguan endokrin.";
    parentFriendlyAdvice = "Kondisi obesitas memerlukan pendampingan dokter dan petugas gizi untuk mengatur pola makan ramah anak tanpa mengganggu pertumbuhan tinggi badan.";
  }

  return {
    imtValue,
    zScore,
    category,
    color,
    badgeBg,
    badgeBorder,
    badgeText,
    badgeColorClass,
    clinicalSummary,
    parentFriendlyAdvice,
  };
}

/**
 * Menghasilkan titik riwayat IMT pertumbuhan balita
 */
export interface ImtHistoryPoint {
  ageMonths: number;
  date: string;
  weight: number;
  height: number;
  imt: number;
  zScore: number;
  category: ImtCategoryType;
}

export function generateImtHistory(
  currentAgeMonths: number,
  currentWeight: number,
  currentHeight: number,
  gender: "L" | "P" = "L"
): ImtHistoryPoint[] {
  const currentImt = calculateImt(currentWeight, currentHeight);
  const currentAssessment = assessImt(currentImt, currentAgeMonths, gender);

  const points: ImtHistoryPoint[] = [];

  // Usia milestones yang relevan
  const milestones = [0, 3, 6, 9, 12, 18, 24, 36, 48, 60].filter(
    (m) => m <= currentAgeMonths
  );

  if (!milestones.includes(currentAgeMonths)) {
    milestones.push(currentAgeMonths);
    milestones.sort((a, b) => a - b);
  }

  milestones.forEach((m, idx) => {
    if (m === currentAgeMonths) {
      points.push({
        ageMonths: m,
        date: "Pemeriksaan Terkini",
        weight: currentWeight,
        height: currentHeight,
        imt: currentImt,
        zScore: currentAssessment.zScore,
        category: currentAssessment.category,
      });
    } else {
      // Rekonstruksi data historis secara proporsional sesuai kurva anak
      const factor = m === 0 ? 0.32 : m / currentAgeMonths;
      const simWeight = Number(
        (3.2 + (currentWeight - 3.2) * Math.pow(factor, 0.78)).toFixed(1)
      );
      const simHeight = Number(
        (49 + (currentHeight - 49) * Math.pow(factor, 0.72)).toFixed(1)
      );
      const simImt = calculateImt(simWeight, simHeight);
      const assessment = assessImt(simImt, m, gender);

      points.push({
        ageMonths: m,
        date: `${m} Bulan`,
        weight: simWeight,
        height: simHeight,
        imt: simImt,
        zScore: assessment.zScore,
        category: assessment.category,
      });
    }
  });

  return points;
}
