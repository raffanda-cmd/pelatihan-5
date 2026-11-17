// 1. Data awal barang
const daftarBarang = [
  { kode: "INV-001", nama: "Laptop", stok: 10, harga: 7500000 },
  { kode: "INV-002", nama: "Mouse", stok: 3, harga: 150000 },
  { kode: "INV-003", nama: "Keyboard", stok: 0, harga: 300000 },
  { kode: "INV-004", nama: "Monitor", stok: 7, harga: 1800000 },
  {kode: "agrav-12", nama: "hape", stok: 8, harga: 11930139},
];

// 2. Fungsi menentukan status stok
function tentukanStatus(stok) {
  if (stok === 0) {
    return "habis";
  } else if (stok < 5) {
    return "menipis";
  } else {
    return "aman";
  }
}

// 3. Fungsi menghitung nilai satu barang
function hitungNilaiBarang(harga, stok) {
  return harga * stok;
}

// 4. Fungsi untuk merender/memperbarui tampilan tabel dan ringkasan (dengan parameter keyword pencarian)
function perbaruiTampilan(keyword = "") {
  const tbody = document.getElementById("tabelBarang");
  const elTotalJenis = document.getElementById("totalJenis");
  const elTotalStok = document.getElementById("totalStok");
  const elTotalNilai = document.getElementById("totalNilai");
  const infoHasil = document.getElementById("infoHasil");

  // Kosongkan isi tabel sebelum diisi ulang
  tbody.innerHTML = "";

  let totalStokKeseluruhan = 0;
  let totalNilaiKeseluruhan = 0;

  // Hitung total keseluruhan untuk kartu ringkasan di atas
  daftarBarang.forEach(barang => {
    totalStokKeseluruhan += barang.stok;
    totalNilaiKeseluruhan += hitungNilaiBarang(barang.harga, barang.stok);
  });

  // Filter data barang berdasarkan kode atau nama (mengabaikan huruf besar/kecil)
  const filteredBarang = daftarBarang.filter(barang => 
    barang.kode.toLowerCase().includes(keyword.toLowerCase()) ||
    barang.nama.toLowerCase().includes(keyword.toLowerCase())
  );

  // Jika hasil pencarian kosong
  if (filteredBarang.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row">Barang tidak ditemukan.</td></tr>`;
    elTotalJenis.textContent = daftarBarang.length;
    elTotalStok.textContent = totalStokKeseluruhan;
    elTotalNilai.textContent = `Rp${totalNilaiKeseluruhan.toLocaleString("id-ID")}`;
    infoHasil.textContent = `Menampilkan 0 dari ${daftarBarang.length} barang`;
    return;
  }

  // Tampilkan data yang sesuai dengan pencarian ke dalam tabel
  filteredBarang.forEach((barang, index) => {
    const status = tentukanStatus(barang.stok);
    const nilai = hitungNilaiBarang(barang.harga, barang.stok);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${barang.kode}</td>
      <td>${barang.nama}</td>
      <td>${barang.stok}</td>
      <td>Rp${barang.harga.toLocaleString("id-ID")}</td>
      <td>Rp${nilai.toLocaleString("id-ID")}</td>
      <td><span class="badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Perbarui kartu ringkasan
  elTotalJenis.textContent = daftarBarang.length;
  elTotalStok.textContent = totalStokKeseluruhan;
  elTotalNilai.textContent = `Rp${totalNilaiKeseluruhan.toLocaleString("id-ID")}`;
  infoHasil.textContent = `Menampilkan ${filteredBarang.length} dari ${daftarBarang.length} barang`;
}

// 5. Menangani Event Submit Form (Tambah Barang)
const formBarang = document.getElementById("formBarang");
const pesanForm = document.getElementById("pesanForm");

formBarang.addEventListener("submit", function (event) {
  event.preventDefault();

  const kode = document.getElementById("kode").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const stok = parseInt(document.getElementById("stok").value, 10);
  const harga = parseFloat(document.getElementById("harga").value);

  const isExist = daftarBarang.some(item => item.kode.toLowerCase() === kode.toLowerCase());
  if (isExist) {
    pesanForm.textContent = "Gagal: Kode barang sudah terdaftar!";
    pesanForm.className = "form-message error";
    return;
  }

  daftarBarang.push({
    kode: kode,
    nama: nama,
    stok: stok,
    harga: harga
  });

  // Reset input pencarian dan perbarui tampilan tabel
  document.getElementById("cariBarang").value = "";
  perbaruiTampilan();

  formBarang.reset();
  pesanForm.textContent = "Barang berhasil ditambahkan!";
  pesanForm.className = "form-message success";
});

// 6. Menangani Event Input untuk Fitur Pencarian
const inputCari = document.getElementById("cariBarang");
inputCari.addEventListener("input", function (event) {
  const keyword = event.target.value;
  perbaruiTampilan(keyword); // Render ulang tabel berdasarkan kata kunci pencarian
});

// Panggil fungsi pertama kali saat halaman dimuat
perbaruiTampilan();