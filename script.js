// ==============================
// 0. LOGIKA TIMER (Taruh paling atas)
// ==============================
let waktu = 15 * 60; // 15 menit
const timerElement = document.getElementById("timerDisplay");

const hitungMundur = setInterval(() => {
    let menit = Math.floor(waktu / 60);
    let detik = waktu % 60;
    detik = detik < 10 ? '0' + detik : detik;
    
    if (timerElement) {
        timerElement.innerHTML = `Waktu: ${menit}:${detik}`;
    }

    if (waktu <= 0) {
        clearInterval(hitungMundur);
        alert("Waktu habis! Jawaban Anda akan dikirim otomatis.");
        document.getElementById("formSoal").dispatchEvent(new Event('submit'));
    }
    waktu--;
}, 1000);


document.getElementById("formSoal").addEventListener("submit", function (e) {
    e.preventDefault();

    // BERHENTIKAN TIMER SAAT SUBMIT
    clearInterval(hitungMundur);

    // ==============================
    // 1. KUNCI JAWABAN
    // ==============================
    const kunciJawaban = {
        q1: "B",
        q2: "B",
        q3: "E",
        q4: "AB" // Jawaban benar adalah kombinasi A dan B
    };

    // ==============================
    // 2. INDIKATOR & MISKONSEPSI
    // ==============================
    const indikator = {
        q1: "Konsep percepatan dan kecepatan",
        q2: "Satuan percepatan",
        q3: "Analisis Hukum Newton dan Gaya Gesek melalui grafik",
        q4: "Hukum I Newton (Inersia)"
    };

    const miskonsepsi = {
        q1: { A: "Menganggap percepatan selalu berubah", C: "Mengira massa dipengaruhi gerak", D: "Menganggap gaya selalu berubah" },
        q2: { A: "Keliru membedakan kecepatan dan percepatan", C: "Salah memahami besaran turunan", D: "Keliru antara gaya dan percepatan" },
        q3: { A: "Gagal membaca gradien grafik kecepatan", B: "Salah dalam menghitung gaya normal", C: "Lupa menyertakan gaya luar (40N) dalam persamaan", D: "Kesalahan perhitungan aritmatika pada gaya gesek" },
        q4: {
            "A": "Hanya memahami benda diam, bukan benda bergerak GLB",
            "B": "Hanya memahami benda bergerak, bukan benda diam",
            "C": "Miskonsepsi Aristotelian: menganggap gerak butuh gaya terus-menerus",
            "ABC": "Terlalu generalisir semua pilihan",
            "": "Belum memahami konsep kelembaman sama sekali"
        }
    };

    // ==============================
    // 3. PROSES JAWABAN (BAGIAN YANG KAMU TANYAKAN)
    // ==============================
    let hasil = [];
    let benar = 0;

    for (let soal in kunciJawaban) {
        let jawaban;
        
        // Cek apakah ini soal Pilihan Ganda Kompleks (q4)
        if (soal === "q4") {
            let terpilih = document.querySelectorAll(`input[name="${soal}"]:checked`);
            // Jika tidak ada yang dicentang
            if (terpilih.length === 0) {
                alert("Soal nomor 4 belum dijawab!");
                return;
            }
            // Gabungkan pilihan siswa menjadi string (misal: "AB")
            jawaban = Array.from(terpilih).map(cb => cb.value).sort().join("");
        } else {
            // Soal Pilihan Ganda Biasa
            let pilihan = document.querySelector(`input[name="${soal}"]:checked`);
            if (!pilihan) { 
                alert("Masih ada soal yang belum dijawab!"); 
                return; 
            }
            jawaban = pilihan.value;
        }

        let status = jawaban === kunciJawaban[soal];
        if (status) benar++;

        // Ambil catatan: jika salah dan ada di list miskonsepsi, tampilkan. Jika tidak, beri pesan umum.
        let catatanSiswa = status ? "Pemahaman baik" : (miskonsepsi[soal][jawaban] || "Pemahaman konsep belum tepat");

        hasil.push({
            soal,
            indikator: indikator[soal],
            jawaban,
            status,
            catatan: catatanSiswa
        });
    }

    // ==============================
    // 4. TAMPILKAN KE HALAMAN
    // ==============================
    let hasilBox = document.getElementById("hasilAsesmen");
    let detail = document.getElementById("detailHasil");

    hasilBox.style.display = "block";
    let detailContent = "";

    hasil.forEach((item, index) => {
        detailContent += `
            <div class="card mb-3 border-${item.status ? 'success' : 'danger'}">
                <div class="card-body">
                    <p><strong>Soal ${index + 1}</strong></p>
                    <p><small>Indikator: ${item.indikator}</small></p>
                    <p>Jawaban Anda: <strong>${item.jawaban}</strong> 
                       <span class="badge ${item.status ? 'bg-success' : 'bg-danger'}">
                        ${item.status ? 'Benar' : 'Salah'}
                       </span>
                    </p>
                    <p><strong>Analisis:</strong> ${item.catatan}</p>
                </div>
            </div>
        `;
    });

    const skor = (benar / hasil.length) * 100;
    detail.innerHTML = `
        <div class="alert alert-info text-center">
            <h4>Skor: ${skor.toFixed(0)} / 100</h4>
        </div>
    ` + detailContent;

    hasilBox.scrollIntoView({ behavior: 'smooth' });

    // ==============================
    // 5. SIMPAN KE LOCALSTORAGE
    // ==============================
    localStorage.setItem("hasilAsesmen", JSON.stringify(hasil));
});