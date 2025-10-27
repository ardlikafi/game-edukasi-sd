document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const introStartButton = document.getElementById('intro-start-button');
    const startScreen = document.getElementById('start-screen');
    const gamePlay = document.getElementById('game-play');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const playerNameInput = document.getElementById('playerName');
    const charButtons = document.querySelectorAll('.char-btn');
    const playerAvatar = document.getElementById('player-avatar');
    const mapBackgroundImg = document.getElementById('map-background-img'); // Elemen img untuk map background
    const dialogueText = document.getElementById('dialogue-text');
    const questionBox = document.getElementById('question-box');
    const questionText = document.getElementById('question-text');
    const signImage = document.getElementById('sign-image');
    const trafficLightContainer = document.getElementById('traffic-light-container');
    const trafficLights = document.querySelectorAll('#traffic-light-container .light');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const scoreDisplay = document.getElementById('score');
    const progressDisplay = document.getElementById('progress');
    const finalMessageDisplay = document.getElementById('final-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const confettiContainer = document.querySelector('.confetti-container');

    // Elemen audio untuk musik latar dan efek suara
    const backgroundMusic = document.getElementById('background-music');
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const winSound = document.getElementById('win-sound');
    const buttonClickSound = document.getElementById('button-click-sound'); // Efek suara klik tombol

    let currentScore = 0;
    let currentStage = 0;
    let playerName = '';
    let playerGender = null; // 'boy' atau 'girl'

    // Path relatif ke folder assets untuk gambar karakter PNG
    let characterImages = {
        boy: './assets/char_boy_school.png', // Menggunakan nama file yang Anda unduh
        girl: './assets/char_girl_school.png' // Menggunakan nama file yang Anda unduh
    };

    // --- Definisi Map Backgrounds ---
    // Pastikan nama file sesuai dengan yang ada di folder 'assets' Anda
    const mapBackgrounds = {
        city_intersection: './assets/map_city_intersection.png',
        park_road: './assets/map_park_road.png',
        city_street_scooter: './assets/map_city_street_scooter.png',
        urban_houses: './assets/map_urban_houses.png',
        street_buildings_right: './assets/map_street_buildings_right.png',
        street_buildings_left: './assets/map_street_buildings_left.png',
        traffic_light_bus: './assets/map_traffic_light_bus.png',
        bus_stop: './assets/map_bus_stop.png',
        grandmas_house: './assets/map_grandmas_house.png'
    };

    // --- Data Permainan (15+ Stage) ---
    // Path relatif ke folder assets untuk gambar rambu PNG
    const gameStages = [{
            type: 'dialogue',
            text: "Halo! Namaku [playerName]. Aku mau pergi ke rumah nenek di seberang kota. Yuk, bantu aku sampai tujuan!",
            map: 'city_intersection', // Map awal
            avatarX: '10%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 1: Rambu Peringatan Umum (!) ---
        {
            type: 'question',
            question: "[playerName] mulai berjalan. Di depan ada rambu ini. Apa artinya?",
            sign: './assets/sign_general_warning.png',
            map: 'city_intersection',
            options: [
                { text: "Berhenti!", correct: false },
                { text: "Hati-hati, ada bahaya!", correct: true },
                { text: "Belok Kiri", correct: false },
                { text: "Tempat parkir", correct: false }
            ],
            feedbackCorrect: "Benar! Rambu peringatan umum ini berarti kamu harus berhati-hati di jalan.",
            feedbackIncorrect: "Salah. Rambu ini adalah rambu peringatan umum, [playerName] harus selalu waspada.",
            points: 10,
            avatarX: '15%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 2: Rambu Dilarang Parkir (P dicoret) ---
        {
            type: 'question',
            question: "[playerName] melihat penjual jajan dan ada rambu ini di dekatnya. Apa artinya?",
            sign: './assets/sign_no_parking.png',
            map: 'city_street_scooter', // Map spesifik untuk area jalan/pedagang
            options: [
                { text: "Boleh parkir sebentar", correct: false },
                { text: "Dilarang parkir di area ini", correct: true },
                { text: "Boleh berhenti sebentar", correct: false },
                { text: "Area khusus untuk penjual jajan", correct: false }
            ],
            feedbackCorrect: "Tepat! Dilarang parkir di sini agar tidak menghalangi jalan.",
            feedbackIncorrect: "Kurang tepat. Rambu ini melarang kendaraan untuk parkir di area tersebut.",
            points: 15,
            avatarX: '20%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 3: Lampu Lalu Lintas Merah ---
        {
            type: 'question',
            question: "[playerName] sampai di perempatan jalan. Lampu lalu lintas menyala merah! Apa yang harus [playerName] lakukan?",
            trafficLight: 'red',
            map: 'street_buildings_right', // Map spesifik dengan lampu lalu lintas
            options: [
                { text: "Segera menyeberang", correct: false },
                { text: "Berhenti dan tunggu lampu hijau", correct: true },
                { text: "Berjalan perlahan", correct: false },
                { text: "Melihat kanan kiri lalu jalan", correct: false }
            ],
            feedbackCorrect: "Bagus! Lampu merah artinya semua kendaraan dan pejalan kaki harus berhenti.",
            feedbackIncorrect: "Salah. Lampu merah berarti kamu harus berhenti total.",
            points: 20,
            avatarX: '25%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 4: Rambu Perlintasan Pejalan Kaki di Depan ---
        {
            type: 'question',
            question: "Lampu hijau menyala, [playerName] melanjutkan perjalanan. [playerName] melihat rambu ini (Perlintasan pejalan kaki). Apa artinya?",
            sign: './assets/sign_pedestrian_crossing_ahead.png',
            map: 'street_buildings_left', // Map spesifik dengan zebra cross
            options: [
                { text: "Jalan biasa", correct: false },
                { text: "Perlintasan pejalan kaki", correct: true },
                { text: "Tempat bermain anak", correct: false },
                { text: "Jalur sepeda", correct: false }
            ],
            feedbackCorrect: "Benar! Rambu ini menandakan area perlintasan pejalan kaki (zebra cross) untuk menyeberang jalan.",
            feedbackIncorrect: "Kurang tepat. Rambu ini menunjukkan adanya perlintasan pejalan kaki.",
            points: 10,
            avatarX: '30%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 5: Situasional Zebra Cross ---
        {
            type: 'question',
            question: "[playerName] ingin menyeberang di zebra cross, tapi ada mobil melaju kencang. Apa yang harus [playerName] lakukan?",
            map: 'street_buildings_left',
            options: [
                { text: "Langsung menyeberang saja", correct: false },
                { text: "Tunggu mobil lewat dan pastikan aman", correct: true },
                { text: "Melambaikan tangan agar mobil berhenti", correct: false },
                { text: "Berlari secepat mungkin", correct: false }
            ],
            feedbackCorrect: "Pintar! Selalu pastikan jalan aman sebelum menyeberang.",
            feedbackIncorrect: "Tidak aman! [playerName] harus selalu menunggu sampai benar-benar aman untuk menyeberang.",
            points: 15,
            avatarX: '35%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 6: Rambu Jalan Licin ---
        {
            type: 'question',
            question: "Jalanan terlihat basah. [playerName] melihat rambu ini. Apa arti rambu ini?",
            sign: './assets/sign_slippery_road.png',
            map: 'park_road', // Map jalan di taman
            options: [
                { text: "Boleh ngebut", correct: false },
                { text: "Hati-hati, jalan licin!", correct: true },
                { text: "Ada genangan air", correct: false },
                { text: "Tidak ada rambu bahaya", correct: false }
            ],
            feedbackCorrect: "Betul! Jalan licin bisa membuat tergelincir, jadi harus pelan-pelan.",
            feedbackIncorrect: "Salah. Rambu ini memperingatkan akan jalan yang licin.",
            points: 10,
            avatarX: '40%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 7: Situasional Jalan Licin ---
        {
            type: 'question',
            question: "[playerName] melihat rambu jalan licin. Apa yang harus dilakukan [playerName] untuk tetap aman?",
            map: 'park_road',
            options: [
                { text: "Berlari agar cepat sampai", correct: false },
                { text: "Melangkah perlahan dan hati-hati", correct: true },
                { text: "Menggunakan sepatu roda", correct: false },
                { text: "Tidak peduli dan jalan seperti biasa", correct: false }
            ],
            feedbackCorrect: "Benar! Melangkah perlahan akan menjaga [playerName] tidak terpeleset.",
            feedbackIncorrect: "Perhatikan rambu! [playerName] harus melangkah perlahan dan hati-hati di jalan licin.",
            points: 15,
            avatarX: '45%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 8: Rambu Berhenti ---
        {
            type: 'question',
            question: "[playerName] mendekati persimpangan tanpa lampu lalu lintas. Ada rambu ini. Apa artinya?",
            sign: './assets/sign_stop.png',
            map: 'city_intersection',
            options: [
                { text: "Boleh langsung lewat", correct: false },
                { text: "Berhenti total dan lihat sekitar", correct: true },
                { text: "Pelan-pelan saja", correct: false },
                { text: "Hanya untuk mobil", correct: false }
            ],
            feedbackCorrect: "Tepat sekali! Rambu STOP berarti kamu harus berhenti dan memastikan aman sebelum melanjutkan.",
            feedbackIncorrect: "Salah. Rambu STOP berarti berhenti penuh, bukan hanya pelan-pelan.",
            points: 10,
            avatarX: '50%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 9: Rambu Batas Kecepatan ---
        {
            type: 'question',
            question: "Di jalan ini ada rambu angka 50. Apa arti rambu ini?",
            sign: './assets/sign_speed_limit_50.png',
            map: 'urban_houses', // Map area perumahan
            options: [
                { text: "Boleh ngebut sampai 60 km/jam", correct: false },
                { text: "Kecepatan maksimum 50 km/jam", correct: true },
                { text: "Jarak ke kota berikutnya 50 km", correct: false },
                { text: "Jalan ini untuk 50 kendaraan", correct: false }
            ],
            feedbackCorrect: "Benar! Rambu ini menunjukkan batas kecepatan yang diizinkan.",
            feedbackIncorrect: "Kurang tepat. Angka pada rambu ini adalah batas kecepatan maksimal.",
            points: 15,
            avatarX: '55%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 10: Rambu Wajib Belok Kanan ---
        {
            type: 'question',
            question: "[playerName] sampai di sebuah belokan. Ada rambu ini. Apa artinya?",
            sign: './assets/sign_mandatory_right_turn.png',
            map: 'traffic_light_bus', // Map persimpangan kompleks
            options: [
                { text: "Dilarang belok kanan", correct: false },
                { text: "Wajib belok kanan", correct: true },
                { text: "Hanya boleh lurus", correct: false },
                { text: "Belok kiri", correct: false }
            ],
            feedbackCorrect: "Ya, ini adalah rambu petunjuk untuk belok kanan.",
            feedbackIncorrect: "Salah. Rambu ini menginstruksikan untuk belok kanan.",
            points: 10,
            avatarX: '60%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 11: Rambu Wajib Jalur Sepeda ---
        {
            type: 'question',
            question: "Di samping jalan ada jalur khusus. Rambu ini menandakan apa?",
            sign: './assets/sign_mandatory_bicycle_lane.png',
            map: 'bus_stop', // Map dekat halte bus
            options: [
                { text: "Dilarang naik sepeda", correct: false },
                { text: "Jalur khusus untuk sepeda", correct: true },
                { text: "Tempat parkir sepeda", correct: false },
                { text: "Area berbahaya", correct: false }
            ],
            feedbackCorrect: "Benar! Ini adalah jalur aman untuk pesepeda.",
            feedbackIncorrect: "Bukan itu. Rambu ini menunjukkan adanya jalur sepeda.",
            points: 10,
            avatarX: '65%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 12: Situasional Perlintasan Sepeda ---
        {
            type: 'question',
            question: "[playerName] berjalan di dekat jalur sepeda. Apa yang harus [playerName] perhatikan?",
            map: 'bus_stop',
            options: [
                { text: "Berjalan di tengah jalur sepeda", correct: false },
                { text: "Memberi ruang dan waspada pada pesepeda", correct: true },
                { text: "Mengajak pesepeda balapan", correct: false },
                { text: "Mengabaikan pesepeda", correct: false }
            ],
            feedbackCorrect: "Tepat! Kita harus menghargai dan berhati-hati terhadap pengguna jalan lain.",
            feedbackIncorrect: "Tidak boleh begitu. [playerName] harus memberi ruang dan berhati-hati pada pesepeda.",
            points: 15,
            avatarX: '70%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 13: Rambu Pom Bensin ---
        {
            type: 'question',
            question: "Jika pengemudi ingin mengisi bensin, rambu ini akan menunjukkan apa?",
            sign: './assets/sign_gas_station.png',
            map: 'street_buildings_right', // Map jalan kota dengan bangunan
            options: [
                { text: "Area rekreasi", correct: false },
                { text: "Lokasi pom bensin terdekat", correct: true },
                { text: "Tempat istirahat", correct: false },
                { text: "Bengkel mobil", correct: false }
            ],
            feedbackCorrect: "Benar! Rambu ini sangat membantu pengemudi mencari SPBU.",
            feedbackIncorrect: "Salah. Ini adalah rambu petunjuk lokasi pom bensin.",
            points: 10,
            avatarX: '75%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 14: Rambu Perlintasan Kereta Api ---
        {
            type: 'question',
            question: "Suara kereta api terdengar. Lalu ada rambu ini. Apa artinya?",
            sign: './assets/sign_railroad_crossing.png',
            map: 'city_intersection', // Map umum, jika tidak ada map khusus rel kereta
            options: [
                { text: "Ada jembatan", correct: false },
                { text: "Ada perlintasan kereta api", correct: true },
                { text: "Jalan rusak", correct: false },
                { text: "Area wisata", correct: false }
            ],
            feedbackCorrect: "Tepat! Sangat penting untuk berhati-hati saat melewati rel kereta api.",
            feedbackIncorrect: "Perhatikan! Rambu ini adalah peringatan adanya perlintasan kereta api.",
            points: 15,
            avatarX: '80%',
            avatarY: 'bottom'
        },
        // --- Pertanyaan 15: Situasional Perlintasan Kereta Api ---
        {
            type: 'question',
            question: "Saat di perlintasan kereta api, palang pintu belum tertutup tapi sirine sudah berbunyi. Apa yang harus [playerName] lakukan?",
            map: 'city_intersection',
            options: [
                { text: "Cepat-cepat lewat", correct: false },
                { text: "Tunggu sampai kereta lewat dan palang pintu terbuka", correct: true },
                { text: "Mencari jalan pintas", correct: false },
                { text: "Melambaikan tangan ke masinis", correct: false }
            ],
            feedbackCorrect: "Sangat baik! Keselamatan adalah yang utama. Selalu tunggu sampai benar-benar aman.",
            feedbackIncorrect: "Bahaya! Jangan pernah mencoba menerobos perlintasan kereta api jika sirine sudah berbunyi.",
            points: 20,
            avatarX: '85%',
            avatarY: 'bottom'
        },
        // --- Stage Rumah Nenek (Transisi Akhir) ---
        {
            type: 'dialogue',
            text: "[playerName] akhirnya sampai di rumah nenek! Nenek sudah menunggu dengan senyum lebar. Selamat, [playerName]!",
            map: 'grandmas_house', // Background rumah nenek
            avatarX: '50%', // Karakter di tengah
            avatarY: 'bottom'
        },
        // --- Akhir Perjalanan (Final End Screen) ---
        {
            type: 'end',
            text: "Petualangan selesai! [playerName] berhasil sampai di rumah nenek dengan selamat dan hati-hati. Kamu hebat!",
            avatarX: '90%', // Posisi avatar tidak terlalu relevan di end screen
            avatarY: 'bottom'
        }
    ];

    // --- Fungsi Game Logic ---

    // Fungsi untuk menampilkan layar yang ditentukan dan menyembunyikan yang lain
    function showScreen(screen) {
        // Menyembunyikan semua layar yang mungkin aktif
        introScreen.classList.add('hidden');
        startScreen.classList.add('hidden');
        gamePlay.classList.add('hidden');
        endScreen.classList.add('hidden');
        // Menampilkan layar yang diminta
        screen.classList.remove('hidden');
    }

    // Fungsi untuk memvalidasi input nama dan pilihan gender untuk mengaktifkan tombol mulai
    function validateStart() {
        startButton.disabled = !(playerNameInput.value.trim() !== '' && playerGender !== null);
    }

    // Fungsi untuk menangani pemilihan gender karakter
    function selectCharacter(gender) {
        playerGender = gender;
        charButtons.forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`.char-btn[data-char="${gender}"]`).classList.add('selected');
        validateStart();
    }

    // Fungsi untuk memulai permainan
    function startGame() {
        playerName = playerNameInput.value.trim();
        if (!playerName || !playerGender) {
            alert('Silakan masukkan nama dan pilih karakter terlebih dahulu!');
            return;
        }

        showScreen(gamePlay);
        currentScore = 0;
        currentStage = 0;
        updateScore();
        updateProgress();
        playerAvatar.src = characterImages[playerGender]; // Mengatur gambar avatar utama
        playerAvatar.style.transition = 'none'; // Mereset transisi untuk penempatan awal
        playerAvatar.style.left = '10%'; // Posisi awal karakter
        backgroundMusic.play().catch(e => console.log("Gagal memutar musik latar otomatis:", e));

        // Mengaktifkan kembali transisi setelah penempatan awal
        setTimeout(() => {
            playerAvatar.style.transition = 'all 1s ease-in-out';
            processStage();
        }, 100);
    }

    // Fungsi untuk memperbarui tampilan skor
    function updateScore(points = 0) {
        currentScore += points;
        scoreDisplay.textContent = `Skor: ${currentScore}`;
    }

    // Fungsi untuk memperbarui tampilan progres permainan
    function updateProgress() {
        const progress = Math.round((currentStage / (gameStages.length - 1)) * 100);
        progressDisplay.textContent = `Progress: ${progress}%`;
    }

    // Fungsi untuk mengganti placeholder nama karakter dalam teks
    function replaceCharacterName(text) {
        return text.replace(/\[playerName\]/g, playerName);
    }

    // Fungsi untuk memproses stage permainan saat ini (dialog, pertanyaan, atau akhir)
    function processStage() {
        if (currentStage >= gameStages.length) {
            endGame(); // Pergi ke layar akhir utama
            return;
        }

        const stage = gameStages[currentStage];
        optionsContainer.innerHTML = ''; // Membersihkan opsi sebelumnya
        signImage.classList.add('hidden');
        trafficLightContainer.classList.add('hidden');
        trafficLights.forEach(light => light.classList.remove('active'));
        nextButton.classList.add('hidden');

        // Memperbarui background map berdasarkan stage
        if (stage.map && mapBackgrounds[stage.map]) {
            mapBackgroundImg.src = mapBackgrounds[stage.map];
            mapBackgroundImg.style.opacity = 0; // Mulai tersembunyi
            setTimeout(() => {
                mapBackgroundImg.style.opacity = 1; // Fade in setelah src diganti
            }, 50);
        } else {
            // Fallback jika map tidak didefinisikan atau tidak ditemukan
            mapBackgroundImg.src = '';
            mapBackgroundImg.style.opacity = 0;
        }


        // Memperbarui posisi avatar di peta
        if (stage.avatarX) {
            playerAvatar.style.left = stage.avatarX;
        }

        if (stage.type === 'dialogue') {
            questionBox.classList.add('hidden');
            dialogueText.textContent = replaceCharacterName(stage.text);
            nextButton.classList.remove('hidden');
        } else if (stage.type === 'question') {
            questionBox.classList.remove('hidden');
            dialogueText.textContent = ''; // Membersihkan dialog
            questionText.textContent = replaceCharacterName(stage.question);

            if (stage.sign) {
                signImage.src = stage.sign;
                signImage.classList.remove('hidden');
                // Mengatur ukuran gambar rambu agar proporsional
                signImage.style.width = 'auto';
                signImage.style.height = '100px';
                signImage.style.maxWidth = '100%';
                signImage.style.objectFit = 'contain';
            } else if (stage.trafficLight) {
                trafficLightContainer.classList.remove('hidden');
                document.querySelector(`.light.${stage.trafficLight}`).classList.add('active');
            }

            // Membuat tombol-tombol opsi jawaban
            stage.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.dataset.index = index;
                button.addEventListener('click', (event) => handleAnswer(option, stage, event));
                optionsContainer.appendChild(button);
            });
        } else if (stage.type === 'end') {
            // Jika ini stage 'end' sebelum final end screen (misal, rumah nenek)
            dialogueText.textContent = replaceCharacterName(stage.text);
            nextButton.classList.remove('hidden');
            questionBox.classList.add('hidden');
        }
    }

    // Fungsi untuk menangani jawaban pemain
    function handleAnswer(selectedOption, stage, event) {
        const optionButtons = optionsContainer.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.disabled = true; // Menonaktifkan semua opsi setelah memilih
            if (stage.options[button.dataset.index].correct) {
                button.classList.add('correct'); // Menandai jawaban benar
            } else if (button === event.currentTarget) {
                button.classList.add('incorrect'); // Menandai jawaban salah yang dipilih
            }
        });

        if (selectedOption.correct) {
            dialogueText.textContent = "Benar! " + replaceCharacterName(stage.feedbackCorrect);
            updateScore(stage.points);
            correctSound.play();
        } else {
            dialogueText.textContent = "Salah! " + replaceCharacterName(stage.feedbackIncorrect);
            incorrectSound.play();
        }
        nextButton.classList.remove('hidden');
        questionBox.classList.add('hidden'); // Menyembunyikan pertanyaan setelah jawaban
    }

    // Fungsi untuk mengakhiri permainan dan menampilkan layar akhir
    function endGame() {
        showScreen(endScreen);
        finalMessageDisplay.textContent = replaceCharacterName(gameStages[gameStages.length - 1].text);
        finalScoreDisplay.textContent = `Skor akhir Anda: ${currentScore}`;
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        winSound.play();
        createConfetti(); // Memanggil fungsi confetti untuk animasi perayaan
    }

    // Fungsi untuk membuat animasi confetti
    function createConfetti() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        for (let i = 0; i < 100; i++) { // Jumlah confetti
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = `${Math.random() * 100}%`; // Posisi horizontal acak
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Warna acak
            piece.style.animationDelay = `${Math.random() * 0.5}s`; // Delay acak
            piece.style.animationDuration = `${2 + Math.random() * 1}s`; // Durasi acak
            piece.style.transform = `translateY(${Math.random() * -100}px) rotate(${Math.random() * 360}deg)`; // Posisi awal acak
            confettiContainer.appendChild(piece);
        }
        setTimeout(() => { confettiContainer.innerHTML = ''; }, 3500); // Menghapus confetti setelah beberapa saat
    }


    // Fungsi untuk merestart permainan
    function restartGame() {
        currentStage = 0;
        currentScore = 0;
        playerName = '';
        playerGender = null;
        playerNameInput.value = '';
        startButton.disabled = true;
        charButtons.forEach(btn => btn.classList.remove('selected'));
        // Mengatur ulang gambar ikon di tombol karakter ke default saat restart
        document.querySelector(`.char-btn[data-char="boy"] img`).src = characterImages['boy'];
        document.querySelector(`.char-btn[data-char="girl"] img`).src = characterImages['girl'];
        showScreen(introScreen); // Kembali ke intro screen
    }

    // --- Event Listeners ---
    // Mendengarkan klik tombol 'Mulai Game' di intro screen
    introStartButton.addEventListener('click', () => {
        buttonClickSound.play(); // Memainkan suara klik
        showScreen(startScreen); // Transisi ke layar pemilihan karakter
    });

    // Mendengarkan perubahan input nama karakter
    playerNameInput.addEventListener('input', validateStart);

    // Mendengarkan klik pada tombol pemilihan karakter
    charButtons.forEach(button => {
        button.addEventListener('click', () => {
            buttonClickSound.play(); // Memainkan suara klik
            selectCharacter(button.dataset.char);
        });
    });

    // Mendengarkan klik tombol 'Mulai Petualangan'
    startButton.addEventListener('click', () => {
        buttonClickSound.play(); // Memainkan suara klik
        startGame();
    });
    // Mendengarkan klik tombol 'Main Lagi' di layar akhir
    restartButton.addEventListener('click', () => {
        buttonClickSound.play(); // Memainkan suara klik
        restartGame();
    });

    // Mendengarkan klik tombol 'Lanjutkan'
    nextButton.addEventListener('click', () => {
        buttonClickSound.play(); // Memainkan suara klik
        currentStage++;
        updateProgress();
        processStage();
    });

    // Pengaturan awal saat halaman dimuat: Tampilkan intro screen
    showScreen(introScreen);
    // Memastikan gambar ikon di tombol karakter dimuat saat awal
    document.querySelector(`.char-btn[data-char="boy"] img`).src = characterImages['boy'];
    document.querySelector(`.char-btn[data-char="girl"] img`).src = characterImages['girl'];
});