export interface Child {
  id: string;
  name: string;
  nik: string;
  gender: "L" | "P";
  birthDate: string;
  ageMonths: number;
  parentName: string;
  parentId: string;
  posyandu: string;
  posyanduId: string;
  lastExamDate: string;
  weight: number;
  height: number;
  headCircumference?: number;
  lila?: number;
  zScoreTbU: number;
  zScoreBbU: number;
  zScoreBbTb: number;
  stuntingStatus: "Normal" | "Pendek (Stunted)" | "Sangat Pendek" | "Tinggi";
  wastingStatus: "Gizi Baik (Normal)" | "Gizi Kurang" | "Gizi Buruk" | "Berisiko Gizi Lebih";
  riskFlag: "NORMAL" | "NOTICE" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL";
  isPrematur?: boolean;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  nik: string;
  address: string;
  posyandu: string;
  childrenCount: number;
  children: { id: string; name: string; age: string; status: string }[];
  joinDate: string;
}

export interface ExamRecord {
  id: string;
  childId: string;
  childName: string;
  examDate: string;
  ageMonths: number;
  weight: number;
  height: number;
  headCircumference?: number;
  lila?: number;
  method: "terlentang" | "berdiri";
  recordedBy: string;
  zScoreTbU: number;
  zScoreBbU: number;
  zScoreBbTb: number;
  stuntingStatus: string;
  wastingStatus: string;
  riskFlag: "NORMAL" | "NOTICE" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL";
  notes?: string;
  status: "validated" | "draft";
}

export interface Announcement {
  id: string;
  title: string;
  category: "Jadwal Posyandu" | "Imunisasi" | "Edukasi Gizi" | "Pemberitahuan";
  content: string;
  date: string;
  eventDate?: string;
  location?: string;
  publishedBy: string;
  isImportant?: boolean;
}

export const mockChildren: Child[] = [
  {
    id: "child-1",
    name: "Rayhan Al-Ghifari",
    nik: "320129482934021",
    gender: "L",
    birthDate: "2023-04-12",
    ageMonths: 18,
    parentName: "Sari Rahmawati",
    parentId: "parent-1",
    posyandu: "Posyandu Melati 04",
    posyanduId: "posyandu-4",
    lastExamDate: "2024-10-24",
    weight: 10.8,
    height: 82.5,
    headCircumference: 46.5,
    lila: 14.5,
    zScoreTbU: -0.8,
    zScoreBbU: 0.2,
    zScoreBbTb: 0.4,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
  },
  {
    id: "child-2",
    name: "Bina Putri",
    nik: "320129482934022",
    gender: "P",
    birthDate: "2022-11-15",
    ageMonths: 24,
    parentName: "Siti Aminah",
    parentId: "parent-2",
    posyandu: "Posyandu Melati 01",
    posyanduId: "posyandu-1",
    lastExamDate: "2024-10-24",
    weight: 9.1,
    height: 79.5,
    headCircumference: 45.0,
    lila: 12.8,
    zScoreTbU: -2.45,
    zScoreBbU: -2.1,
    zScoreBbTb: 0.05,
    stuntingStatus: "Pendek (Stunted)",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "MODERATE_RISK",
  },
  {
    id: "child-3",
    name: "Aditya Pratama",
    nik: "320129482934023",
    gender: "L",
    birthDate: "2023-10-10",
    ageMonths: 12,
    parentName: "Siti Aminah",
    parentId: "parent-2",
    posyandu: "Posyandu Melati 01",
    posyanduId: "posyandu-1",
    lastExamDate: "2024-10-22",
    weight: 9.3,
    height: 74.2,
    headCircumference: 45.2,
    lila: 14.0,
    zScoreTbU: -0.3,
    zScoreBbU: 0.1,
    zScoreBbTb: 0.2,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
  },
  {
    id: "child-4",
    name: "Aisyah Maryam",
    nik: "320129482934024",
    gender: "P",
    birthDate: "2020-08-15",
    ageMonths: 48,
    parentName: "Sari Rahmawati",
    parentId: "parent-1",
    posyandu: "Posyandu Melati 04",
    posyanduId: "posyandu-4",
    lastExamDate: "2024-09-18",
    weight: 15.2,
    height: 101.5,
    headCircumference: 49.0,
    lila: 15.5,
    zScoreTbU: 0.1,
    zScoreBbU: -0.2,
    zScoreBbTb: -0.1,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
  },
  {
    id: "child-5",
    name: "Muhammad Farhan",
    nik: "320129482934025",
    gender: "L",
    birthDate: "2024-04-05",
    ageMonths: 6,
    parentName: "Rina Lestari",
    parentId: "parent-3",
    posyandu: "Posyandu Melati 02",
    posyanduId: "posyandu-2",
    lastExamDate: "2024-10-20",
    weight: 6.8,
    height: 64.0,
    headCircumference: 42.1,
    lila: 13.2,
    zScoreTbU: -2.1,
    zScoreBbU: -1.8,
    zScoreBbTb: -0.9,
    stuntingStatus: "Pendek (Stunted)",
    wastingStatus: "Gizi Kurang",
    riskFlag: "HIGH_RISK",
  },
];

export const mockParents: Parent[] = [
  {
    id: "parent-1",
    name: "Sari Rahmawati",
    phone: "081234567890",
    email: "sari.rahmawati@gmail.com",
    nik: "3201294829340001",
    address: "Jl. Dahlia No. 14, RT 02 / RW 04, Kel. Sukamaju",
    posyandu: "Posyandu Melati 04",
    childrenCount: 2,
    children: [
      { id: "child-1", name: "Rayhan Al-Ghifari", age: "18 Bulan", status: "Normal" },
      { id: "child-4", name: "Aisyah Maryam", age: "4 Tahun", status: "Normal" },
    ],
    joinDate: "2023-01-15",
  },
  {
    id: "parent-2",
    name: "Siti Aminah",
    phone: "081234567891",
    email: "ibu.siti@example.com",
    nik: "3515012345670001",
    address: "Jl. Merdeka No. 12, RT 01 / RW 04, Kel. Sukamaju",
    posyandu: "Posyandu Melati 01",
    childrenCount: 2,
    children: [
      { id: "child-2", name: "Bina Putri", age: "24 Bulan", status: "Pendek (Stunted)" },
      { id: "child-3", name: "Aditya Pratama", age: "12 Bulan", status: "Normal" },
    ],
    joinDate: "2022-10-01",
  },
  {
    id: "parent-3",
    name: "Rina Lestari",
    phone: "081398765432",
    email: "rina.lestari@gmail.com",
    nik: "3201294829340003",
    address: "Jl. Anggrek No. 5, RT 03 / RW 04, Kel. Sukamaju",
    posyandu: "Posyandu Melati 02",
    childrenCount: 1,
    children: [
      { id: "child-5", name: "Muhammad Farhan", age: "6 Bulan", status: "Pendek (Stunted)" },
    ],
    joinDate: "2024-03-10",
  },
];

export const mockExamRecords: ExamRecord[] = [
  {
    id: "exam-1",
    childId: "child-1",
    childName: "Rayhan Al-Ghifari",
    examDate: "2024-10-24",
    ageMonths: 18,
    weight: 10.8,
    height: 82.5,
    headCircumference: 46.5,
    lila: 14.5,
    method: "terlentang",
    recordedBy: "Bidan Sri Wahyuni, A.Md.Keb",
    zScoreTbU: -0.8,
    zScoreBbU: 0.2,
    zScoreBbTb: 0.4,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
    notes: "Nafsu makan bagus, aktif bergerak.",
    status: "validated",
  },
  {
    id: "exam-2",
    childId: "child-1",
    childName: "Rayhan Al-Ghifari",
    examDate: "2024-09-20",
    ageMonths: 17,
    weight: 10.5,
    height: 81.3,
    headCircumference: 46.2,
    lila: 14.4,
    method: "terlentang",
    recordedBy: "Bidan Sri Wahyuni, A.Md.Keb",
    zScoreTbU: -0.9,
    zScoreBbU: 0.1,
    zScoreBbTb: 0.3,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
    notes: "Imunisasi DPT lanjutan telah diberikan.",
    status: "validated",
  },
  {
    id: "exam-3",
    childId: "child-1",
    childName: "Rayhan Al-Ghifari",
    examDate: "2024-08-15",
    ageMonths: 16,
    weight: 10.1,
    height: 80.0,
    headCircumference: 45.8,
    lila: 14.2,
    method: "terlentang",
    recordedBy: "Kader Siti",
    zScoreTbU: -1.0,
    zScoreBbU: 0.0,
    zScoreBbTb: 0.2,
    stuntingStatus: "Normal",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "NORMAL",
    notes: "Pemberian Vitamin A merah.",
    status: "validated",
  },
  {
    id: "exam-4",
    childId: "child-2",
    childName: "Bina Putri",
    examDate: "2024-10-24",
    ageMonths: 24,
    weight: 9.1,
    height: 79.5,
    headCircumference: 45.0,
    lila: 12.8,
    method: "berdiri",
    recordedBy: "Bidan Sri Wahyuni, A.Md.Keb",
    zScoreTbU: -2.45,
    zScoreBbU: -2.1,
    zScoreBbTb: 0.05,
    stuntingStatus: "Pendek (Stunted)",
    wastingStatus: "Gizi Baik (Normal)",
    riskFlag: "MODERATE_RISK",
    notes: "Diberikan konseling PMT dan rujukan evaluasi gizi Puskesmas.",
    status: "validated",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Jadwal Penimbangan Rutin & Pemberian Vitamin A Bulan November 2024",
    category: "Jadwal Posyandu",
    content:
      "Diberitahukan kepada seluruh warga RW 04, kegiatan posyandu balita akan dilaksanakan serentak pada Kamis, 14 November 2024 pukul 08.00 - 11.30 WIB di Balai RW 04.",
    date: "2024-10-25",
    eventDate: "2024-11-14",
    location: "Balai Warga RW 04 Melati",
    publishedBy: "Bidan Sri Wahyuni",
    isImportant: true,
  },
  {
    id: "ann-2",
    title: "Program Imunisasi Polio Tambahan (PIN Polio) Putaran 2",
    category: "Imunisasi",
    content:
      "Wajib bagi seluruh balita usia 0-59 bulan tanpa memandang status imunisasi sebelumnya. Mohon membawa buku KIA/KMS masing-masing.",
    date: "2024-10-18",
    eventDate: "2024-11-05",
    location: "Posyandu Melati 1 s/d 4",
    publishedBy: "Puskesmas Sukamaju",
    isImportant: true,
  },
  {
    id: "ann-3",
    title: "Panduan Gizi: Memaksimalkan Protein Hewani untuk Mencegah Stunting",
    category: "Edukasi Gizi",
    content:
      "Studi Kemenkes menunjukkan pemberian 1 butir telur per hari atau asupan ikan kembung lokal secara signifikan meningkatkan laju pertumbuhan linear anak.",
    date: "2024-10-10",
    publishedBy: "Tim Gizi Puskesmas",
  },
];

