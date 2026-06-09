const slideFiles = [
    'slides/01-intro.html',
    'slides/02-toc.html',
    'slides/03-team.html',
    'slides/04-strategy.html',
    'slides/05-day1.html',
    'slides/06-day2.html',
    'slides/07-comiket-intro.html',
    'slides/08-day3-prep.html',
    'slides/09-day3-tactics.html',
    'slides/10-day3-budget.html',
    'slides/11-day4-shibuya.html',  // 👈 수정된 Day 4
    'slides/12-day5-akiba.html',    // 👈 추가된 Day 5
    'slides/13-day6-disney.html',   // (기존 12번 -> 13번으로 변경)
    'slides/14-phrases.html',       // (기존 13번 -> 14번으로 변경)
    'slides/15-budget.html',         // (기존 14번 -> 15번으로 변경)
    'slides/16-thanks.html'
];

const coverImages = [
    'haruhi.png', 'fullmethal.png','ubw.png','fzero.png','heavensfeel.png',
    'bleach.webp','chainsawman.webp','codegeass.webp','demonslayer.webp','gintama.webp',
    'girlbandcry.webp','hellsing.webp','jujutsukaisen.webp','karanokyoukai.webp',
    'killlakill.webp','luckystar.webp','myheroacademia.webp','naruto.webp','onepiece.webp',
    'oshinoko.webp','overload.webp','RDnDoBGS.webp','steinsgate.webp','tokyogoul.webp',
    'violetevergarden.webp','86.webp','april.webp','attackontitan.webp','beastars.webp','bebop.webp',
    'biskdoll.webp','bocchi.webp','callofthenight.webp','clannad.webp','cyberpunk.webp','dandadan.webp',
    'deathnote.webp','euphoria.webp','evangerion.webp','friren.webp','grenragan.webp','gushingovermagicalgirls.webp',
    'hyangggoat.webp','kakegurui.webp','konosba.webp','madeinabyss.webp','mamama.webp','moori.webp','neverland.webp',
    'onepunchman.webp','pansga.webp','ranma.webp','reantalgirlfriend.webp','redoofhealer.webp','rezero.webp','sakurajang.webp',
    'schooldays.webp','schoollive.webp','slamdunk.webp','spyfamilly.webp','takopi.webp','theeminenceinshadow.webp','toradora.webp',
    'witchtravel.webp'
];

const container = document.getElementById('presentation-container');
let slides = [];
let currentSlideIndex = 0;
let comiketIntervalId = null; // 🌟 무한 발사 타이머를 기억할 변수 추가

// 2. 비동기로 슬라이드 파일들을 불러와서 컨테이너에 합치는 함수
async function loadSlides() {
    for (const file of slideFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`${file} 로드 실패`);
            
            const html = await response.text();
            container.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error("슬라이드 로딩 에러:", error);
        }
    }
    initPresentation();
}

// 4. 슬라이드 조작 기능 초기화 함수
function initPresentation() {
    slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        slides[0].classList.add('active'); 
    }

    // 키보드 이벤트 바인딩
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'Space') {
            changeSlide(currentSlideIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            changeSlide(currentSlideIndex - 1);
        }
    });

    // 🌟 화면 클릭 이벤트 추가 (코미케 페이지일 때만 로고 토글)
    document.addEventListener('click', () => {
        const activeSlide = slides[currentSlideIndex];
        if (activeSlide && activeSlide.id === 'slide-comiket-intro') {
            const logoBox = document.querySelector('.comiket-logo-box');
            if (logoBox) {
                logoBox.classList.toggle('show'); // 클릭할 때마다 떴다 사라짐
            }
        }
    });
}

// 5. 슬라이드 넘김 처리 함수
function changeSlide(nextIndex) {
    if (slides.length === 0) return;

    if (nextIndex < 0) {
        nextIndex = slides.length - 1;
    } else if (nextIndex >= slides.length) {
        nextIndex = 0;
    }

    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = nextIndex;
    slides[currentSlideIndex].classList.add('active');
    const activeSlide = slides[currentSlideIndex];
    
    if (activeSlide.id === 'slide-comiket-intro') {
        playComiketAnimation();
    } else {
        resetComiketAnimation(); 
    }
}

// 🌟 코미케 무한 워프 터널(Warp Tunnel) 효과 함수
function playComiketAnimation() {
    const imgContainer = document.getElementById('radial-image-container');
    const logoBox = document.querySelector('.comiket-logo-box');
    if (!imgContainer || !logoBox) return;

    // 초기화 및 이전 타이머 중지
    imgContainer.innerHTML = '';
    logoBox.classList.remove('show');
    if (comiketIntervalId) clearInterval(comiketIntervalId);

    // --------------------------------------------------
    // 연출 세팅값
    // --------------------------------------------------
    const spawnInterval = 150;      // 0.15초마다 한 장씩 무한 발사
    const flyDuration = 5500;       // 내 눈앞까지 날아오는 시간
    let imageIndex = 0;             // 균일한 각도를 위한 인덱스
    // --------------------------------------------------

    // 🌟 무한 반복을 위한 이미지 발사 함수
    function spawnImage() {
        const img = document.createElement('img');
        const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];
        img.src = `assets/images/${randomImage}`; 
        img.className = 'anime-cover';
        imgContainer.appendChild(img);

        const angle = imageIndex * 137.508 * (Math.PI / 180);
        imageIndex++;

        const distance = 2000 + Math.random() * 800; 
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const finalRotation = (Math.random() - 0.5) * 90; 

        setTimeout(() => {
            img.style.transition = `
                transform ${flyDuration}ms cubic-bezier(0.7, 0, 1, 1), 
                opacity ${flyDuration}ms ease-in
            `;
            img.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(8) rotate(${finalRotation}deg)`;
            img.style.opacity = '0.75';

            // 끝나기 400ms 전에 투명해지고, 완전히 끝나면 DOM에서 삭제 (메모리 최적화)
            setTimeout(() => {
                img.style.transition = 'opacity 400ms ease-out';
                img.style.opacity = '0';
                setTimeout(() => {
                    if (imgContainer.contains(img)) {
                        img.remove();
                    }
                }, 400);
            }, flyDuration - 400);

        }, 50);
    }

    // 설정한 간격으로 무한 발사 시작
    comiketIntervalId = setInterval(spawnImage, spawnInterval);
}

// 🌟 코미케 슬라이드를 벗어나면 리셋하고 타이머 멈추는 함수
function resetComiketAnimation() {
    const imgContainer = document.getElementById('radial-image-container');
    const logoBox = document.querySelector('.comiket-logo-box');
    
    if (comiketIntervalId) clearInterval(comiketIntervalId); // 무한 발사 중지
    if (imgContainer) imgContainer.innerHTML = '';
    if (logoBox) logoBox.classList.remove('show');
}

// 스크립트가 실행되면 가장 먼저 슬라이드 로드 시작
loadSlides();