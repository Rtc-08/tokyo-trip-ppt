// 1. 불러올 슬라이드 파일들의 경로를 순서대로 배열에 저장 (새로 추가할 때마다 여기에 적어주면 됨)
const slideFiles = [
    'slides/01-intro.html',
    'slides/02-toc.html',
    'slides/03-team.html',
    'slides/04-strategy.html',
    'slides/05-day1.html',
    'slides/06-day2.html',
    'slides/07-comiket-intro.html',
    'slides/08-preview.html'
];
const coverImages = [
    'haruhi.png', 'fullmethal.png','ubw.png','fzero.png','heavensfeel.png',
    'bleach.webp','chainsawman.webp','codegeass.webp','demonslayer.webp','gintama.webp',
    'girlbandcry.webp','hellsing.webp','jujutsukaisen.webp','karanokyoukai.webp',
    'killlakill.webp','luckystar.webp','myheroacademia.webp','naruto.webp','onepiece.webp',
    'oshinoko.webp','overload.webp','RDnDoBGS.webp','steinsgate.webp','tokyogoul.webp',
    'violetevergarden.webp'
];
const container = document.getElementById('presentation-container');
let slides = [];
let currentSlideIndex = 0;

// 2. 비동기로 슬라이드 파일들을 불러와서 컨테이너에 합치는 함수
async function loadSlides() {
    for (const file of slideFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`${file} 로드 실패`);
            
            const html = await response.text();
            
            // 가져온 HTML 텍스트를 컨테이너의 맨 끝에 차곡차곡 추가
            container.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error("슬라이드 로딩 에러:", error);
        }
    }
    
    // 3. 모든 슬라이드를 다 불러온 후 프레젠테이션 세팅 실행
    initPresentation();
}

// 4. 슬라이드 조작 기능 초기화 함수
function initPresentation() {
    // 이제 화면에 추가된 모든 .slide 요소를 수집
    slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        slides[0].classList.add('active'); // 첫 번째 슬라이드 활성화
    }

    // 키보드 이벤트 바인딩
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'Space') {
            changeSlide(currentSlideIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            changeSlide(currentSlideIndex - 1);
        }
    });
}

// 5. 슬라이드 넘김 처리 함수
function changeSlide(nextIndex) {
    if (slides.length === 0) return;

    // 순환 구조 (마지막 장 -> 첫 장 / 첫 장 -> 마지막 장)
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
        resetComiketAnimation(); // 다른 슬라이드로 가면 초기화
    }
}
// 🌟 코미케 워프 터널(Warp Tunnel) 효과 함수
function playComiketAnimation() {
    const imgContainer = document.getElementById('radial-image-container');
    const logoBox = document.querySelector('.comiket-logo-box');
    if (!imgContainer || !logoBox) return;

    // 초기화
    imgContainer.innerHTML = '';
    logoBox.classList.remove('show');

    // --------------------------------------------------
    // 연출 세팅값 (원하는 대로 조절해!)
    // --------------------------------------------------
    const totalImages = 60;        // 쏟아져 나올 총 이미지 개수 (훨씬 많아짐)
    const spawnInterval = 200;      // 0.08초마다 한 장씩 발사 (총 6.4초 동안 쏟아짐)
    const flyDuration = 5500;      // 이미지 하나가 내 눈앞까지 날아오는 데 걸리는 시간 (3.5초)
    // --------------------------------------------------

    for (let i = 0; i < totalImages; i++) {
        // 이미지를 시간차를 두고 계속 생성
        setTimeout(() => {
            const img = document.createElement('img');
            const randomImage = coverImages[Math.floor(Math.random() * coverImages.length)];
            img.src = `assets/images/${randomImage}`; 
            img.className = 'anime-cover';
            imgContainer.appendChild(img);

            // 화면을 뚫고 지나갈 수 있도록 엄청나게 먼 최종 도달 거리 설정
            const angle = i * 137.508 * (Math.PI / 180);
            const distance = 2000 + Math.random() * 800; // 2000px 이상 밖으로 날아감
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            // 날아가면서 약간씩 틀어지는 각도
            const finalRotation = (Math.random() - 0.5) * 90; 

            // 요소가 추가된 후 애니메이션 프레임이 잡힐 수 있도록 아주 짧은 딜레이 부여
            setTimeout(() => {
                // 핵심 가속도: cubic-bezier(0.7, 0, 1, 1)
                // 처음(소실점)엔 아주 천천히 움직이다가, 카메라에 가까워질수록 미친 듯이 빨라짐
                img.style.transition = `
                    transform ${flyDuration}ms cubic-bezier(0.7, 0, 1, 1), 
                    opacity ${flyDuration}ms ease-in
                `;
                
                // 크기를 8배(scale 8)로 키우면서 내 눈앞으로 덮치게 만듦
                img.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(8) rotate(${finalRotation}deg)`;
                
                // 빛이 퍼지는 것처럼 살짝 투명도를 유지
                img.style.opacity = '0.75';

                // 내 눈을 스쳐 지나갈 때쯤(끝나기 400ms 전) 스르륵 사라지게 처리
                setTimeout(() => {
                    img.style.transition = 'opacity 400ms ease-out';
                    img.style.opacity = '0';
                }, flyDuration - 400);

            }, 50);
        }, i * spawnInterval);
    }

    // 🌟 폭풍우처럼 이미지가 쏟아지고 난 뒤, 클라이맥스에 코미케 로고 쾅!
    // (마지막 이미지가 거의 다 날아갔을 타이밍인 약 7.5초 뒤)
    setTimeout(() => {
        logoBox.classList.add('show');
    }, totalImages * spawnInterval + 1500); 
}

// 코미케 슬라이드를 벗어나면 다시 볼 수 있게 상태를 리셋해주는 함수
function resetComiketAnimation() {
    const imgContainer = document.getElementById('radial-image-container');
    const logoBox = document.querySelector('.comiket-logo-box');
    if (imgContainer) imgContainer.innerHTML = '';
    if (logoBox) logoBox.classList.remove('show');
}

loadSlides();
// 6. 스크립트가 실행되면 가장 먼저 슬라이드 로드 시작
