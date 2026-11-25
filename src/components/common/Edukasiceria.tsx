"use client";

import React, { useState } from "react";

export default function Edukasiceria() {
  const [activeTab, setActiveTab] = useState<"piringku" | "milestone" | "kuis">("piringku");

  // Tab 1: State Piringku
  const [selectedQuadrant, setSelectedQuadrant] = useState<"karbo" | "protein" | "sayur" | "buah">("protein");
  const [selectedAgeStage, setSelectedAgeStage] = useState<"6-8" | "9-11" | "12-24" | "24-59">("12-24");

  // Tab 2: State Milestone
  const [activeMilestone, setActiveMilestone] = useState<number>(1);

  // Tab 3: State Kuis Mitos vs Fakta
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  const quadrantsData = {
    karbo: {
      title: "Makanan Pokok (Energi Aktif)",
      portion: "1/3 Isi Piringku",
      color: "bg-amber-100 text-amber-900 border-amber-300",
      accent: "#f59e0b",
      badgeColor: "bg-amber-500 text-white",
      icon: "🌾",
      examples: ["Nasi putih / merah", "Kentang tumbuk", "Ubi jalar kuning", "Jagung manis", "Oatmeal balita"],
      benefit: "Sumber karbohidrat kompleks sebagai bahan bakar energi utama otak dan aktivitas fisik harian si kecil yang sedang aktif mengeksplorasi dunia.",
      tips: "Variasikan jenis makanan pokok lokal agar balita terbiasa dengan beragam rasa alami sejak usia dini.",
    },
    protein: {
      title: "Lauk Protein Hewani (Kunci Cegah Stunting)",
      portion: "Prioritas Utama MP-ASI",
      color: "bg-rose-100 text-rose-900 border-rose-300",
      accent: "#f43f5e",
      badgeColor: "bg-rose-500 text-white",
      icon: "🥚",
      examples: ["1 Butir Telur Tiap Hari", "Ikan Kembung / Lele", "Hati Ayam (Kaya Zat Besi)", "Daging Sapi Cincang", "Ayam Suwir"],
      benefit: "Asam amino esensial hewani dan zat besi esensial langsung diserap optimal untuk pertumbuhan tinggi badan linier dan perkembangan neuron otak.",
      tips: "1 butir telur ayam rebus/ceplok sehari adalah intervensi paling terjangkau & terbukti klinis efektif menurunkan risiko stunting secara drastis.",
    },
    sayur: {
      title: "Sayuran Berwarna (Serat & Mikronutrien)",
      portion: "1/3 Isi Piringku",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      accent: "#10b981",
      badgeColor: "bg-emerald-600 text-white",
      icon: "🥦",
      examples: ["Bayam hijau/merah", "Wortel rebus manis", "Brokoli kukus", "Labu kuning", "Tomat ceri lumat"],
      benefit: "Kaya vitamin A, C, asam folat, dan serat alami untuk mendukung imunitas saluran pencernaan serta kesehatan mata balita.",
      tips: "Masak sayur dengan cara dikukus sebentar agar kandungan vitamin larut air tidak hilang dan warnanya tetap cerah menarik bagi anak.",
    },
    buah: {
      title: "Buah Segar Manis Alami (Vitamin & Cairan)",
      portion: "Pelengkap Sehat",
      color: "bg-orange-100 text-orange-900 border-orange-300",
      accent: "#fb923c",
      badgeColor: "bg-orange-500 text-white",
      icon: "🍌",
      examples: ["Pisang ambon matang", "Pepaya manis lembut", "Jeruk manis peras", "Alpukat mentega", "Mangga harum manis"],
      benefit: "Pemberi rasa manis alami tanpa gula tambahan, kaya kalium dan enzim pencernaan yang melancarkan BAB balita.",
      tips: "Sajikan buah potong jari (finger food) bertekstur empuk agar balita belajar melatih koordinasi tangan dan mulut secara mandiri.",
    },
  };

  const ageStageGuides = {
    "6-8": {
      stage: "Usia 6 - 8 Bulan",
      texture: "Bubur Saring / Puree Halus",
      frequency: "2 - 3 kali sehari + ASI semau anak",
      portion: "2 - 3 sendok makan penuh bertahap hingga 1/2 mangkuk (125 ml)",
      highlight: "Fokus pengenalan rasa dan tekstur lumat yang tidak terlalu encer.",
    },
    "9-11": {
      stage: "Usia 9 - 11 Bulan",
      texture: "Cincang Halus / Makanan Lembik Berserat",
      frequency: "3 - 4 kali sehari + 1-2 kali selingan sehat",
      portion: "1/2 sampai 3/4 mangkuk ukuran 250 ml",
      highlight: "Anak mulai belajar mengunyah makanan bertekstur kasar dan mencoba finger food.",
    },
    "12-24": {
      stage: "Usia 12 - 24 Bulan",
      texture: "Menu Makanan Keluarga Normal",
      frequency: "3 kali makanan utama + 2 kali camilan bergizi",
      portion: "3/4 sampai 1 mangkuk penuh ukuran 250 ml",
      highlight: "Anak makan bersama keluarga dengan menu seimbang, potong kecil jika diperlukan.",
    },
    "24-59": {
      stage: "Usia 2 - 5 Tahun",
      texture: "Menu Lengkap Mandiri",
      frequency: "3 kali makanan utama + 2 kali camilan buah/susu",
      portion: "Satu porsi piring makan anak seimbang",
      highlight: "Biasakan cuci tangan pakai sabun dan minum air putih cukup, hindari jajan manis berlebih.",
    },
  };

  const milestones = [
    {
      id: 0,
      range: "0 - 6 Bulan",
      title: "Fase ASI Eksklusif & Senyuman Pertama",
      badge: "Fondasi Emas",
      color: "border-sky-300 bg-sky-50 text-sky-900",
      avatarBg: "bg-sky-500",
      items: [
        { label: "Motorik Kasar", desc: "Mulai mengangkat kepala saat tengkurap dan menahan leher tegak." },
        { label: "Motorik Halus", desc: "Menggenggam jari orang tua erat dan memasukkan tangan ke mulut." },
        { label: "Bicara & Sosial", desc: "Tersenyum responsif pada wajah ibu, mulai bersuara 'ooh' dan 'aah'." },
      ],
      stimulasi: "Ajak bicara sambil menatap mata hangat, beri rangsangan bunyi krincingan lembut, dan lakukan tummy time 2-3 kali sehari.",
    },
    {
      id: 1,
      range: "6 - 12 Bulan",
      title: "Fase MP-ASI Pertama & Penjelajah Merangkak",
      badge: "Eksplorasi Aktif",
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      avatarBg: "bg-emerald-600",
      items: [
        { label: "Motorik Kasar", desc: "Duduk stabil tanpa dibantu, merangkak lincah, hingga belajar berdiri tegak." },
        { label: "Motorik Halus", desc: "Menjepit benda kecil dengan ibu jari dan telunjuk (pincer grasp)." },
        { label: "Bicara & Sosial", desc: "Menirukan suku kata 'mama', 'dada', dan melambaikan tangan 'da-dah'." },
      ],
      stimulasi: "Sediakan area lantai yang aman dan bersih untuk merangkak, ajak bermain cilukba, dan kenalkan finger food bergizi.",
    },
    {
      id: 2,
      range: "1 - 2 Tahun",
      title: "Fase Langkah Mandiri & Kosakata Bertumbuh",
      badge: "Langkah Pertama",
      color: "border-amber-300 bg-amber-50 text-amber-900",
      avatarBg: "bg-amber-500",
      items: [
        { label: "Motorik Kasar", desc: "Berjalan mandiri, mulai berlari kecil, dan menendang bola." },
        { label: "Motorik Halus", desc: "Menyusun balok 2-4 susun, memegang krayon dan mencoret kertas." },
        { label: "Bicara & Sosial", desc: "Mengucapkan 5-20 kata bermakna, menunjuk bagian tubuh jika ditanya." },
      ],
      stimulasi: "Bacakan buku cerita bergambar warna-warni tiap malam, ajak menyusun mainan balok, dan beri apresiasi saat anak mandiri.",
    },
    {
      id: 3,
      range: "2 - 5 Tahun",
      title: "Fase Imajinasi Cerdas & Sosialisasi Ceria",
      badge: "Kemandirian Cilik",
      color: "border-rose-300 bg-rose-50 text-rose-900",
      avatarBg: "bg-rose-500",
      items: [
        { label: "Motorik Kasar", desc: "Melompat dengan dua kaki, menaiki tangga bergantian, mengayuh sepeda roda tiga." },
        { label: "Motorik Halus", desc: "Menggunting kertas sederhana, memakai baju sendiri, menggambar lingkaran." },
        { label: "Bicara & Sosial", desc: "Berbicara kalimat 3-4 kata lancar, senang bermain peran bersama teman sebaya." },
      ],
      stimulasi: "Ajak bermain peran, libatkan dalam tugas ringan rumah tangga, dan latih interaksi sosial bersama kawan di Posyandu.",
    },
  ];

  const quizList = [
    {
      id: 1,
      question: "Apakah stunting hanya dipengaruhi faktor keturunan (genetik orang tua pendek)?",
      correct: false, // MITOS
      type: "MITOS",
      explanation: "FAKTANYA adalah MITOS! Faktor genetik hanya berpengaruh sekitar 15-20%. Faktor terbesar penyebab stunting adalah asupan nutrisi protein hewani, pola asuh, sanitasi lingkungan, serta pencegahan infeksi berulang pada 1000 Hari Pertama Kehidupan (HPK).",
    },
    {
      id: 2,
      question: "Memberikan 1 butir telur setiap hari terbukti klinis efektif membantu mencegah stunting pada balita?",
      correct: true, // FAKTA
      type: "FAKTA",
      explanation: "BENAR SEKALI! Penelitian ilmiah dan panduan Kemenkes RI membuktikan bahwa 1 butir telur mengandung asam amino lengkap dan kolin tinggi yang mudah diserap tubuh balita untuk memicu hormon pertumbuhan tinggi badan.",
    },
    {
      id: 3,
      question: "Balita yang tampak gemuk sudah pasti terbebas dari ancaman stunting dan kekurangan mikronutrien?",
      correct: false, // MITOS
      type: "MITOS",
      explanation: "FAKTANYA adalah MITOS! Balita bisa tampak gemuk akibat konsumsi gula/tepung berlebih, namun tinggi badannya terhambat dan mengalami 'hidden hunger' (kekurangan zat besi, seng, dan vitamin penting untuk otak).",
    },
  ];

  const handleAnswerQuiz = (qId: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
    setRevealedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#f0fdf4] via-[#f8faf9] to-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-200/80 shadow-md relative overflow-hidden">
      {/* Decorative Cheerful Background Circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Animated Cheerful Badges */}
      <div className="absolute top-4 right-6 hidden md:flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full border border-amber-200 shadow-xs animate-bounce-subtle">
        <span className="text-sm">☀️</span>
        <span className="text-xs font-bold text-amber-800">Ceria & Tumbuh Optimal</span>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs mb-3">
          <span className="animate-wiggle-gentle text-base">🎈</span>
          <span>Wahana Edukasi Interaktif TumbuhKu</span>
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14532d] font-heading tracking-tight">
          Belajar Ceria Tumbuh Kembang Buah Hati
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Eksplorasi panduan gizi seimbang, animasi tahapan tumbuh kembang balita, serta kuis seru mitos vs fakta stunting bersama keluarga.
        </p>

        {/* Tab Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-slate-100/90 rounded-2xl max-w-lg mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab("piringku")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "piringku"
                ? "bg-white text-emerald-800 shadow-sm scale-102"
                : "text-slate-600 hover:text-emerald-800"
            }`}
          >
            <span className="text-base">🍽️</span>
            <span>Isi Piringku</span>
          </button>
          <button
            onClick={() => setActiveTab("milestone")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "milestone"
                ? "bg-white text-emerald-800 shadow-sm scale-102"
                : "text-slate-600 hover:text-emerald-800"
            }`}
          >
            <span className="text-base">👣</span>
            <span>Milestone Usia</span>
          </button>
          <button
            onClick={() => setActiveTab("kuis")}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "kuis"
                ? "bg-white text-emerald-800 shadow-sm scale-102"
                : "text-slate-600 hover:text-emerald-800"
            }`}
          >
            <span className="text-base">💡</span>
            <span>Kuis Mitos & Fakta</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10">
        {/* TAB 1: ISI PIRINGKU */}
        {activeTab === "piringku" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Animated Plate */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-3 bg-white shadow-xl border-4 border-emerald-100 flex items-center justify-center group">
                {/* SVG Plate Segments with Interactive Click */}
                <svg className="w-full h-full transform -rotate-45" viewBox="0 0 100 100">
                  {/* Karbohidrat Top Left */}
                  <path
                    d="M 50,50 L 50,5 A 45,45 0 0,1 95,50 Z"
                    fill={selectedQuadrant === "karbo" ? "#f59e0b" : "#fde68a"}
                    className="cursor-pointer transition-all hover:opacity-90 hover:scale-102 transform origin-center"
                    onClick={() => setSelectedQuadrant("karbo")}
                  />
                  {/* Protein Top Right */}
                  <path
                    d="M 50,50 L 95,50 A 45,45 0 0,1 50,95 Z"
                    fill={selectedQuadrant === "protein" ? "#f43f5e" : "#fecdd3"}
                    className="cursor-pointer transition-all hover:opacity-90 hover:scale-102 transform origin-center"
                    onClick={() => setSelectedQuadrant("protein")}
                  />
                  {/* Sayur Bottom Right */}
                  <path
                    d="M 50,50 L 50,95 A 45,45 0 0,1 5,50 Z"
                    fill={selectedQuadrant === "sayur" ? "#10b981" : "#a7f3d0"}
                    className="cursor-pointer transition-all hover:opacity-90 hover:scale-102 transform origin-center"
                    onClick={() => setSelectedQuadrant("sayur")}
                  />
                  {/* Buah Bottom Left */}
                  <path
                    d="M 50,50 L 5,50 A 45,45 0 0,1 50,5 Z"
                    fill={selectedQuadrant === "buah" ? "#fb923c" : "#fed7aa"}
                    className="cursor-pointer transition-all hover:opacity-90 hover:scale-102 transform origin-center"
                    onClick={() => setSelectedQuadrant("buah")}
                  />
                </svg>

                {/* Center Badge of the Plate */}
                <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-4 border-emerald-500 shadow-md flex flex-col items-center justify-center p-2 text-center pointer-events-none animate-pulse-soft">
                  <span className="text-xl sm:text-2xl">{quadrantsData[selectedQuadrant].icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-950 leading-tight mt-0.5">
                    Isi Piringku
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Kemenkes RI</span>
                </div>
              </div>

              {/* Quadrant Selector Buttons below the plate */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {(["protein", "karbo", "sayur", "buah"] as const).map((key) => {
                  const q = quadrantsData[key];
                  const isSelected = selectedQuadrant === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedQuadrant(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? `${q.badgeColor} shadow-sm scale-105`
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>{q.icon}</span>
                      <span>{q.title.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                *Klik bagian piring untuk melihat fungsi gizi dan contoh menunya
              </p>
            </div>

            {/* Educational Detail Card */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Active Nutrition Card */}
              <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${quadrantsData[selectedQuadrant].color} bg-white shadow-sm`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-2xl mr-2">{quadrantsData[selectedQuadrant].icon}</span>
                    <h3 className="inline font-heading text-lg sm:text-xl font-bold text-slate-900">
                      {quadrantsData[selectedQuadrant].title}
                    </h3>
                    <div className="mt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-200">
                        Porsi Ideal: {quadrantsData[selectedQuadrant].portion}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  {quadrantsData[selectedQuadrant].benefit}
                </p>

                {/* Example Food Badges */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-800 block mb-2">Contoh Pangan Lokal Mudah & Bergizi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quadrantsData[selectedQuadrant].examples.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Kader & Mother Tip Box */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                  <span className="text-lg">💡</span>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    <strong className="font-bold">Tips Ceria Posyandu:</strong> {quadrantsData[selectedQuadrant].tips}
                  </p>
                </div>
              </div>

              {/* Age Stage Guideline Strip */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">restaurant_menu</span>
                    Panduan Tekstur Berdasarkan Usia Balita:
                  </span>
                </div>

                {/* Age selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                  {(["6-8", "9-11", "12-24", "24-59"] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setSelectedAgeStage(stage)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedAgeStage === stage
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {stage === "24-59" ? "2 - 5 Tahun" : `${stage} Bln`}
                    </button>
                  ))}
                </div>

                {/* Selected Stage Explanation */}
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>Tekstur: {ageStageGuides[selectedAgeStage].texture}</span>
                    <span className="text-emerald-700">{ageStageGuides[selectedAgeStage].frequency}</span>
                  </div>
                  <p className="text-slate-600">Porsi: {ageStageGuides[selectedAgeStage].portion}</p>
                  <p className="text-emerald-800 font-medium pt-1">
                    Catatan: {ageStageGuides[selectedAgeStage].highlight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MILESTONE TUMBUH KEMBANG */}
        {activeTab === "milestone" && (
          <div className="space-y-6">
            {/* Stage Selector Pills */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {milestones.map((m, idx) => {
                const isActive = activeMilestone === idx;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveMilestone(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-102"
                        : "bg-white/80 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 ${
                        isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {m.badge}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-slate-900">{m.range}</h4>
                    </div>
                    <span className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">{m.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Highlight Card with Animated Elements */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${milestones[activeMilestone].avatarBg} text-white flex items-center justify-center font-bold text-xl shadow-sm animate-bounce-subtle`}>
                    👶
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Periode Emas: {milestones[activeMilestone].range}
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                      {milestones[activeMilestone].title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Standar Buku KIA Kemenkes</span>
                </div>
              </div>

              {/* 3 Skill Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {milestones[activeMilestone].items.map((it, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 mb-2">
                      {it.label}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {it.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stimulation Advice */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">toys</span>
                  </div>
                  <div>
                    <h5 className="font-heading text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Ide Stimulasi Ceria Bersama Si Kecil:
                    </h5>
                    <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                      {milestones[activeMilestone].stimulasi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KUIS MITOS VS FAKTA */}
        {activeTab === "kuis" && (
          <div className="space-y-5 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Uji Pengetahuan Orang Tua & Kader 🏆
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Pilih jawaban Anda pada setiap pernyataan untuk membuka fakta ilmiah pencegahan stunting.
              </p>
            </div>

            {quizList.map((q) => {
              const isAnswered = revealedQuestions[q.id];
              const userAnswer = quizAnswers[q.id];
              const isCorrect = userAnswer === q.correct;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm transition-all hover:border-emerald-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {q.id}
                    </span>
                    <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      &ldquo;{q.question}&rdquo;
                    </h4>
                  </div>

                  {/* Buttons Mitos vs Fakta */}
                  {!isAnswered ? (
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => handleAnswerQuiz(q.id, false)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>❌</span>
                        <span>Mitos</span>
                      </button>
                      <button
                        onClick={() => handleAnswerQuiz(q.id, true)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>✅</span>
                        <span>Fakta</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-float-slow">
                      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                          : "bg-rose-50 text-rose-900 border-rose-300"
                      }`}>
                        <span className="flex items-center gap-1.5">
                          <span>{isCorrect ? "🎉 Jawaban Tepat!" : "🧐 Kurang Tepat"}</span>
                          <span>(Jawaban Benar: {q.type})</span>
                        </span>
                        <span className="text-xs">{isCorrect ? "+10 Poin Cerdas" : "Mari Belajar"}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
