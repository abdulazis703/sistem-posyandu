/**
 * Utilitas Perhitungan Umur Balita Otomatis
 * Menghitung umur presisi berdasarkan tanggal lahir dalam format:
 * Tahun, Bulan, dan Hari sesuai standar Posyandu & Buku KIA Kemenkes RI.
 */

export interface DetailedAge {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  textShort: string; // contoh: "1 Thn 6 Bln 12 Hr"
  textLong: string;  // contoh: "1 Tahun 6 Bulan 12 Hari"
  textBadge: string; // format ringkas untuk badge / tabel
}

export function calculateDetailedAge(
  birthDateStr: string | Date | undefined,
  targetDate: Date = new Date()
): DetailedAge {
  if (!birthDateStr) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalDays: 0,
      textShort: "0 Bln",
      textLong: "0 Bulan 0 Hari",
      textBadge: "0 Bln",
    };
  }

  const birthDate = typeof birthDateStr === "string" ? new Date(birthDateStr) : birthDateStr;

  if (isNaN(birthDate.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalDays: 0,
      textShort: "-",
      textLong: "Tanggal tidak valid",
      textBadge: "-",
    };
  }

  let y = targetDate.getFullYear() - birthDate.getFullYear();
  let m = targetDate.getMonth() - birthDate.getMonth();
  let d = targetDate.getDate() - birthDate.getDate();

  // Koreksi jika hari negatif
  if (d < 0) {
    m -= 1;
    // Ambil jumlah hari di bulan sebelumnya
    const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    d += prevMonthLastDay;
  }

  // Koreksi jika bulan negatif
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  // Jika tanggal lahir di masa depan
  if (y < 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalDays: 0,
      textShort: "0 Hari",
      textLong: "Baru lahir / 0 Hari",
      textBadge: "0 Hari",
    };
  }

  const totalMonths = y * 12 + m;
  const diffTime = Math.max(0, targetDate.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Buat string representasi
  const partsLong: string[] = [];
  const partsShort: string[] = [];

  if (y > 0) {
    partsLong.push(`${y} Tahun`);
    partsShort.push(`${y} Thn`);
  }
  if (m > 0 || (y > 0 && d > 0)) {
    partsLong.push(`${m} Bulan`);
    partsShort.push(`${m} Bln`);
  }
  if (d > 0 || (y === 0 && m === 0)) {
    partsLong.push(`${d} Hari`);
    partsShort.push(`${d} Hr`);
  }

  const textLong = partsLong.join(" ") || "0 Hari";
  const textShort = partsShort.join(" ") || "0 Hr";
  const textBadge = y > 0 ? `${y} Thn ${m} Bln ${d} Hr` : `${m} Bln ${d} Hr`;

  return {
    years: y,
    months: m,
    days: d,
    totalMonths,
    totalDays,
    textShort,
    textLong,
    textBadge,
  };
}
