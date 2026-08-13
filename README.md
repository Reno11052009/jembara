# SkillBridge

SkillBridge adalah platform digital yang mempertemukan pelajar yang memiliki keterampilan dengan UMKM yang membutuhkan bantuan untuk mengerjakan project.

Platform ini membantu pelajar mendapatkan pengalaman melalui project nyata, sekaligus membantu UMKM menemukan kandidat yang sesuai dengan kebutuhan mereka.

## Masalah

Banyak pelajar memiliki keterampilan seperti:

* Web development
* UI/UX design
* Graphic design
* Video editing
* Photography
* Digital marketing

Namun, mereka sering kesulitan mendapatkan pengalaman dan project nyata.

Di sisi lain, UMKM sering membutuhkan bantuan untuk pekerjaan digital, tetapi tidak selalu tahu harus mencari orang yang sesuai di mana.

SkillBridge mempertemukan kedua pihak tersebut melalui sistem matching.

## Solusi

SkillBridge menggunakan sistem matching untuk mencari pelajar yang paling sesuai dengan kebutuhan UMKM.

Matching tidak hanya berdasarkan skill, tetapi juga mempertimbangkan:

* Skill
* Portfolio
* Rating
* Budget
* Availability
* Lokasi
* Deadline

Contoh:

```text
Project:
Website sederhana untuk toko

87% Match
Andi
HTML/CSS/JS: ★★★★★
UI Design: ★★★★☆
Portfolio: 3 project
Rating: 4.8/5

81% Match
Budi
HTML/CSS/JS: ★★★★☆
UI Design: ★★★☆☆
Portfolio: 5 project
Rating: 4.6/5
```

## Alur Platform

```text
UMKM
  ↓
Membuat Project
  ↓
Sistem Matching
  ↓
Rekomendasi Pelajar
  ↓
Pelajar Mengirim Proposal
  ↓
UMKM Memilih Kandidat
  ↓
Collaboration
  ↓
Project Selesai
  ↓
Rating & Review
```

## Fitur

### Untuk Pelajar

* Membuat profil
* Menambahkan skill
* Mengunggah portfolio
* Menentukan availability
* Melihat project yang sesuai
* Mengirim proposal
* Mengelola project
* Mendapatkan rating
* Membuat Skill Passport

### Untuk UMKM

* Membuat profil bisnis
* Membuat project
* Menentukan kebutuhan
* Menentukan budget
* Menentukan deadline
* Melihat rekomendasi kandidat
* Membandingkan kandidat
* Memilih pelajar
* Mengelola project
* Memberikan rating dan review

### Sistem Matching

Sistem menghitung tingkat kecocokan antara project dan pelajar berdasarkan beberapa faktor.

Contoh bobot:

```text
Skill        40%
Portfolio    20%
Rating       15%
Budget       10%
Availability 10%
Location      5%
```

Hasil matching kemudian digunakan untuk mengurutkan kandidat berdasarkan tingkat kecocokan.

## Skill Passport

Setiap pelajar memiliki Skill Passport yang menampilkan perkembangan dan reputasi mereka.

Contoh:

```text
Skill Passport
────────────────────────

Andi

Web Development     90%
UI Design           80%
Video Editing       60%

Completed Projects  12
Collaboration        8
Rating              4.8/5

Verified Skills
✓ HTML
✓ CSS
✓ JavaScript
✓ Figma
```

Skill Passport membantu pelajar membangun portfolio dan reputasi berdasarkan project yang benar-benar mereka selesaikan.

## Project Lifecycle

Setiap project memiliki beberapa status:

```text
OPEN
  ↓
PROPOSAL
  ↓
IN PROGRESS
  ↓
REVIEW
  ↓
COMPLETED
```

Status membantu UMKM dan pelajar mengetahui perkembangan project.

## SDG 8

SkillBridge mendukung Sustainable Development Goal 8 atau Decent Work and Economic Growth.

Platform ini berfokus pada:

* Meningkatkan akses pelajar terhadap pengalaman kerja
* Membantu pelajar membangun portfolio
* Menghubungkan skill dengan kebutuhan nyata
* Membantu UMKM mendapatkan tenaga dengan skill yang sesuai
* Mendorong aktivitas ekonomi digital
* Membangun reputasi profesional sejak dini

## Target Pengguna

### Pelajar

Pelajar yang memiliki skill dan ingin mendapatkan pengalaman melalui project nyata.

### UMKM

UMKM yang membutuhkan bantuan untuk menyelesaikan kebutuhan digital dengan budget yang sesuai.

## Contoh Penggunaan

Sebuah UMKM membutuhkan website sederhana.

UMKM membuat project:

```text
Project: Website Toko
Budget: Rp500.000
Deadline: 14 hari

Skill:
- HTML
- CSS
- JavaScript
- UI Design
```

SkillBridge kemudian mencari kandidat yang sesuai.

```text
92% Match
Andi

88% Match
Citra

81% Match
Budi
```

UMKM memilih Andi dan mengirimkan project.

Setelah project selesai, UMKM memberikan rating.

```text
★★★★★

Rating: 5.0

"Project selesai tepat waktu dan komunikasinya baik."
```

Rating tersebut kemudian masuk ke profil Andi.

## Dampak yang Diukur

Platform dapat menggunakan beberapa indikator untuk mengukur dampak:

```text
Pelajar Terdaftar
Project Selesai
UMKM Terbantu
Total Collaboration
Skill yang Digunakan
Project Selesai Tepat Waktu
Average Rating
```

Contoh dashboard:

```text
1,250  Pelajar
428    Project Selesai
312    UMKM Terbantu
2,840  Skill Digunakan
87%    Project Tepat Waktu
```

Data tersebut merupakan contoh untuk prototype dan dapat diganti dengan data aktual.

## Teknologi

Teknologi yang digunakan dapat disesuaikan dengan implementasi aplikasi.

Contoh stack:

```text
Frontend
- Next.js
- React
- TypeScript
- CSS

Backend
- Node.js
- REST API

Database
- PostgreSQL
- Prisma ORM

Authentication
- JWT / Session Authentication
```

## Struktur Konsep

```text
SkillBridge
│
├── Authentication
│   ├── Student
│   └── UMKM
│
├── Student
│   ├── Profile
│   ├── Skills
│   ├── Portfolio
│   ├── Availability
│   └── Skill Passport
│
├── UMKM
│   ├── Business Profile
│   └── Projects
│
├── Matching
│   ├── Skill
│   ├── Portfolio
│   ├── Rating
│   ├── Budget
│   ├── Availability
│   └── Location
│
├── Collaboration
│   ├── Proposal
│   ├── Project
│   ├── Progress
│   └── Completion
│
└── Rating
    ├── Rating
    └── Review
```

## Roadmap

### Phase 1

* Authentication
* Student profile
* UMKM profile
* Skill management
* Portfolio
* Project creation

### Phase 2

* Matching system
* Proposal
* Project management
* Rating & review

### Phase 3

* Skill Passport
* Verified Skills
* Recommendation system
* Analytics dashboard

### Phase 4

* AI-powered matching
* Skill gap analysis
* Smart project recommendation
* Automated portfolio analysis

## Tujuan

SkillBridge bertujuan menciptakan ekosistem yang menghubungkan keterampilan pelajar dengan kebutuhan nyata UMKM.

```text
Skill Pelajar
      ↓
Project Nyata
      ↓
Pengalaman
      ↓
Portfolio
      ↓
Reputasi
      ↓
Peluang Kerja
```

---

## License

This project is developed for educational and competition purposes.
