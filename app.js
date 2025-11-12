if (window.lucide && typeof window.lucide.createIcons === 'function') { window.lucide.createIcons(); }

// Cursor functionality
const halka = document.querySelector('.cursor-ring');
const nokta = document.querySelector('.cursor-dot');
const hover_destegi = matchMedia('(hover:hover)').matches;
const azalmis_hareket = matchMedia('(prefers-reduced-motion: reduce)');

const performansDusuk = () => {
  const navRam = navigator.deviceMemory || 0;
  const cekirdekSayisi = navigator.hardwareConcurrency || 0;
  return navRam && navRam <= 4 || cekirdekSayisi && cekirdekSayisi <= 4;
};

let hareket_azaltildi = azalmis_hareket.matches;
let cihaz_dusuk = performansDusuk();

if (cihaz_dusuk) {
  document.body.classList.add('low-power');
}

let imlec_aktif = hover_destegi && !hareket_azaltildi && !cihaz_dusuk;
let hedef_x = 0, hedef_y = 0, halka_x = 0, halka_y = 0;

const imlecDegerleriniAyarla = (el, x, y) => {
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
};

let animasyonKareId = null;
let pointerDinleniyor = false;
let echoSonZaman = 0;
const echoGecikme = 80;

const pointerIsleyici = e => {
  hedef_x = e.clientX;
  hedef_y = e.clientY;
  if (nokta) imlecDegerleriniAyarla(nokta, hedef_x, hedef_y);
};

function cerceve_yenile() {
  halka_x += (hedef_x - halka_x) * 0.18;
  halka_y += (hedef_y - halka_y) * 0.18;
  if (halka) imlecDegerleriniAyarla(halka, halka_x, halka_y);
  if (imlec_aktif) {
    animasyonKareId = requestAnimationFrame(cerceve_yenile);
  }
}

function imlecKur() {
  if (imlec_aktif) {
    if (halka) imlecDegerleriniAyarla(halka, hedef_x, hedef_y);
    if (nokta) imlecDegerleriniAyarla(nokta, hedef_x, hedef_y);
    if (!pointerDinleniyor) {
      addEventListener('pointermove', pointerIsleyici);
      pointerDinleniyor = true;
    }
    if (animasyonKareId === null) {
      animasyonKareId = requestAnimationFrame(cerceve_yenile);
    }
  }
}

// Enhanced cursor with echo and press effects
if (imlec_aktif) {
  document.addEventListener('pointermove', (e) => {
    const simdi = performance.now();
    if (simdi - echoSonZaman > echoGecikme) {
      echoSonZaman = simdi;
      const echo = document.createElement('span');
      echo.className = 'cursor-echo';
      echo.style.left = `${e.clientX}px`;
      echo.style.top = `${e.clientY}px`;
      document.body.appendChild(echo);
      setTimeout(() => echo.remove(), 600);
    }
  });

  document.addEventListener('mousedown', () => {
    if (halka) halka.classList.add('press');
  });

  document.addEventListener('mouseup', () => {
    if (halka) halka.classList.remove('press');
  });
}

const hover_secici = 'a,button,.btn,.card,input,textarea,.service-card,.slider-btn';
if (imlec_aktif) {
  document.querySelectorAll(hover_secici).forEach(oge => {
    oge.addEventListener('mouseenter', () => halka && halka.classList.add('grow'));
    oge.addEventListener('mouseleave', () => halka && halka.classList.remove('grow'));
  });
}

// Fade animations
const fade_ogeleri = [...document.querySelectorAll('.fade')];
let kesisim_gozlemcisi = null;

function fadeGecisleriniKur() {
  if (kesisim_gozlemcisi) {
    kesisim_gozlemcisi.disconnect();
  }
  if (hareket_azaltildi) {
    fade_ogeleri.forEach(oge => oge.classList.add('show'));
    return;
  }
  kesisim_gozlemcisi = new IntersectionObserver((ogeler) => {
    ogeler.forEach(og => {
      if (og.isIntersecting) {
        og.target.classList.add('show');
      }
    });
  }, { threshold: 0.12 });
  fade_ogeleri.forEach(oge => kesisim_gozlemcisi.observe(oge));
}

// Parallax
const kahraman_icerik = document.querySelector('.hero-inner');
const gezinme_ogesi = document.querySelector('.nav.glass');

function paralaks() {
  const kaydirma = scrollY;
  if (kahraman_icerik) {
    if (cihaz_dusuk) {
      kahraman_icerik.style.transform = 'translateY(0)';
    } else {
      kahraman_icerik.style.transform = `translateY(${kaydirma * 0.15}px)`;
    }
  }
  if (gezinme_ogesi) {
    if (kaydirma > 10) {
      gezinme_ogesi.classList.add('scrolled');
    } else {
      gezinme_ogesi.classList.remove('scrolled');
    }
  }
}

let paralaksBeklemede = false;
function kaydirmaIsleyici() {
  if (paralaksBeklemede) return;
  paralaksBeklemede = true;
  requestAnimationFrame(() => {
    paralaksBeklemede = false;
    paralaks();
  });
}

function paralaksHazirla() {
  if (hareket_azaltildi || cihaz_dusuk) {
    if (kahraman_icerik) kahraman_icerik.style.transform = 'translateY(0)';
    return;
  }
  addEventListener('scroll', kaydirmaIsleyici, { passive: true });
  paralaks();
}

fadeGecisleriniKur();
paralaksHazirla();
imlecKur();

// Loading screen
window.addEventListener('load', () => {
  const yukleme = document.getElementById('yukleme');
  if (yukleme) {
    yukleme.classList.add('fade-out');
    setTimeout(() => {
      yukleme.style.display = 'none';
    }, 600);
  }
});

// Service card sparks
const kartlar = [...document.querySelectorAll('.service-card')];
const son_kivilcim = new WeakMap();

function kivilcim_olustur(kart, x, y) {
  const kivilcim = document.createElement('span');
  kivilcim.className = 'spark';
  const boyut = 3 + Math.random() * 5;
  kivilcim.style.width = boyut + 'px';
  kivilcim.style.height = boyut + 'px';
  kivilcim.style.left = x + 'px';
  kivilcim.style.top = y + 'px';
  kivilcim.style.background = 'radial-gradient(circle,#06b6d4,rgba(6,182,212,0) 70%)';
  kart.appendChild(kivilcim);
  const mevcut = kart.querySelectorAll('.spark');
  if (mevcut.length > 12) {
    mevcut[0].remove();
  }
  kivilcim.addEventListener('animationend', () => kivilcim.remove());
}

if (imlec_aktif) {
  kartlar.forEach(kart => {
    kart.addEventListener('pointermove', e => {
      const simdi = performance.now();
      const son = son_kivilcim.get(kart) || 0;
      if (simdi - son > 140) {
        const alan = kart.getBoundingClientRect();
        kivilcim_olustur(kart, e.clientX - alan.left, e.clientY - alan.top);
        son_kivilcim.set(kart, simdi);
      }
    });
  });
}

// Translations
const ceviri = {
  en: {
    "nav.home": "Home",
    "nav.slider": "Services",
    "nav.services": "Details",
    "nav.vision": "Vision",
    "nav.contact": "Contact",
    "slider.eyebrow": "Signature Experience",
    "slider.title": "With SPION",
    "slider.subtitle": "Turn your brand story into a cinematic journey with SPION, delivering the same impact at every touchpoint.",
    "slider.metric.0.value": "360°",
    "slider.metric.0.label": "Strategy across every channel",
    "slider.metric.1.value": "24/7",
    "slider.metric.1.label": "Operational monitoring",
    "slider.metric.2.value": "∞",
    "slider.metric.2.label": "Bespoke combinations",
    "slider.cta": "Start Your Plan",
    "slider.status": "Swipe to explore",
    "slider.item1.badge": "Creative Ops",
    "slider.item1.title": "Coming Soon...",
    "slider.item1.desc": "Command Hollywood-standard productions from a single panel.",
    "slider.item1.point.0": "All stage materials aligned in one pipeline",
    "slider.item1.point.1": "AI-assisted storyboard and tempo mapping",
    "slider.item1.point.2": "Live moderator and broadcast director in sync",
    "slider.item2.badge": "Agent Program",
    "slider.item2.title": "Our Agents Will Prepare You for This World..",
    "slider.item2.desc": "Our professional team guides you on your journey to stardom.",
    "slider.item2.point.0": "Personalized media readiness bootcamp",
    "slider.item2.point.1": "Weekly performance report and new missions",
    "slider.item2.point.2": "Mentor-led stage and camera rehearsals",
    "slider.item3.badge": "Social Lab",
    "slider.item3.title": "Spion Media to Become a Phenomenon!",
    "slider.item3.desc": "We make you the next phenomenon with data-driven social media strategies.",
    "slider.item3.point.0": "Trend-triggering content formulas",
    "slider.item3.point.1": "Multi-channel publishing calendar",
    "slider.item3.point.2": "Community management plus nano influencer network",
    "slider.item4.badge": "Neural Studio",
    "slider.item4.title": "Recreate Perceptions!",
    "slider.item4.desc": "Harness AI at full power to reshape perception.",
    "slider.item4.point.0": "Real-time voice and visual synthesis",
    "slider.item4.point.1": "Cognitive emotion mapping",
    "slider.item4.point.2": "Interactive expo and experience setups",
    "hero.badge": "Next Generation Media",
    "hero.line.prefix": "We merge ",
    "hero.line.suffix": " with technology",
    "hero.words.0": "mobility",
    "hero.words.1": "stability",
    "hero.words.2": "design",
    "hero.words.3": "intelligence",
    "hero.title.line1": "Merging Creativity",
    "hero.title.line2": "with Technology",
    "hero.subtitle": "SPIONARMY — Building the future of visual, audio, and digital experiences.",
    "hero.stats.0.value": "Sonsuz",
    "hero.stats.0.label": "Farklı tasarım",
    "hero.stats.1.value": "15+",
    "hero.stats.1.label": "Uzman personel",
    "hero.stats.2.value": "24/7",
    "hero.stats.2.label": "Destek",
    "hero.cta.primary": "Get Started",
    "hero.cta.secondary": "Watch Demo",
    "hero.scroll": "Scroll to explore",
    "services.title": "Our Services",
    "services.video.title": "Video Production Services",
    "services.video.desc": "Creating stunning visual stories that captivate audiences and elevate your brand.",
    "services.music.title": "Music Production Services",
    "services.music.desc": "Crafting unique soundscapes and professional audio experiences for any medium.",
    "services.gamification.title": "Gamified Marketing",
    "services.gamification.desc": "Engage your audience through interactive, game-based marketing strategies.",
    "services.ai.title": "AI Services",
    "services.ai.desc": "Voice and video cloning, content enhancement powered by cutting-edge AI technology.",
    "services.social.title": "Social Media Management",
    "services.social.desc": "Building and managing your digital presence across all social platforms.",
    "vision.title": "Vision",
    "vision.subtitle": "The Center Holding the Trend Scale",
    "vision.description": "We aim to become a strong, centralized structure that acts as the scale of the system, strategically selecting the trend and the person we will spotlight, and running operations with our specialist team.",
    "vision.statement": "The center holding the trend scale is a strategic operations hub where data, creativity, and our specialist network move in sync.",
    "vision.metrics.0.value": "24/7",
    "vision.metrics.0.label": "Trend scanning cycle",
    "vision.metrics.1.value": "15+",
    "vision.metrics.1.label": "Active specialists",
    "vision.metrics.2.value": "Core",
    "vision.metrics.2.label": "Specialist roster",
    "vision.quote": "\u201cWe hold the scale; expertise adds weight, outcomes set the balance.\u201d",
    "vision.mantra": "No spectacle, impact. Not process, outcome. Not aesthetics, supremacy.",
    "vision.pillars.title": "Three pillars that power the center",
    "vision.pillars.0.tag": "Selection",
    "vision.pillars.0.title": "Trend Strategy Table",
    "vision.pillars.0.desc": "The core team that filters cultural signals and decides who and what to amplify.",
    "vision.pillars.0.point.0": "Scales potential impact through data-led analysis.",
    "vision.pillars.0.point.1": "Listens to community insights in real time.",
    "vision.pillars.0.point.2": "Briefs agents with a clear target and narrative frame.",
    "vision.pillars.1.tag": "Production",
    "vision.pillars.1.title": "Our Specialists",
    "vision.pillars.1.desc": "Video, audio, 3D, and interactive specialists translate the same vision into every format.",
    "vision.pillars.1.point.0": "All production layers are coordinated from a single control board.",
    "vision.pillars.1.point.1": "A repeatable pipeline keeps quality consistent.",
    "vision.pillars.1.point.2": "Experimental missions evolve into impact-delivering formats.",
    "vision.pillars.2.tag": "Operations",
    "vision.pillars.2.title": "Power of the Specialist Network",
    "vision.pillars.2.desc": "Our specialists grow the trend on the ground and surface the right people.",
    "vision.pillars.2.point.0": "Generates measurable influence, not manipulation.",
    "vision.pillars.2.point.1": "Community management and media reflexes operate in sync.",
    "vision.pillars.2.point.2": "When results are proven, success becomes visible automatically.",
    "vision.flow.title": "How our operation flows",
    "vision.flow.0.step": "01",
    "vision.flow.0.title": "Data & instinct scan",
    "vision.flow.0.desc": "Algorithms and experienced eyes gather cultural signals.",
    "vision.flow.1.step": "02",
    "vision.flow.1.title": "Strategic selection",
    "vision.flow.1.desc": "The scale is set and the trend and talent we focus on are chosen.",
    "vision.flow.2.step": "03",
    "vision.flow.2.title": "Multi-channel production",
    "vision.flow.2.desc": "Specialist crews translate the story across every format.",
    "vision.flow.3.step": "04",
    "vision.flow.3.title": "Specialist-powered amplification",
    "vision.flow.3.desc": "The operations network grows the trend while results are measured and optimized.",
    "event.eyebrow": "Event Announcement",
    "event.title": "Sins of Time Short Film",
    "event.tag": "Coming soon",
    "event.cta": "Contact Us",
    "contact.title": "Get in Touch",
    "contact.tag": "Work with SPIONARMY",
    "contact.headline": "Let's build unforgettable experiences",
    "contact.lead": "Share your goals and we'll design the visual, audio, and digital journey that amplifies your brand.",
    "contact.highlight.0.title": "End-to-end creative direction",
    "contact.highlight.0.desc": "From concept development to final delivery, we align technology and artistry for your story.",
    "contact.highlight.1.title": "Adaptive, multilingual production",
    "contact.highlight.1.desc": "Content tailored for global audiences across video, audio, social, and immersive platforms.",
    "contact.social.title": "Prefer social channels?",
    "contact.form.title": "Project brief",
    "contact.form.desc": "Tell us about your vision, timeline, and any references. We'll follow up within one business day.",
    "contact.form.name": "Your Name",
    "contact.form.email": "Your Email",
    "contact.form.message": "Your Message",
    "contact.form.submit": "Send Message",
    "why.title": "Why SPIONARMY?",
    "why.perspective.title": "New Perspective",
    "why.perspective.desc": "A young, dynamic team full of new-generation creative thinking and fresh ideas.",
    "why.tech.title": "Latest Technology",
    "why.tech.desc": "Modern infrastructure equipped with the latest AI tools and production technologies.",
    "why.customer.title": "Customer-Centric",
    "why.customer.desc": "Every project is a unique story — we are dedicated to turning your vision into reality.",
    "why.innovative.title": "Innovative Approach",
    "why.innovative.desc": "We combine creative and technical solutions, pushing traditional boundaries.",
    "why.highlight": "Latest Technology and New-Generation Mindset",
    "cookies.title": "Cookies & Privacy",
    "cookies.description": "We use cookies to enhance your browsing experience and understand how our site is used.",
    "cookies.item.necessary": "Essential cookies keep the site secure and enable core functionality.",
    "cookies.item.analytics": "Analytics cookies help us analyze traffic so we can improve our services.",
    "cookies.item.preference": "Preference cookies remember your language selection and settings."
  },
  tr: {
    "nav.home": "Ana Sayfa",
    "nav.slider": "Hizmetler",
    "nav.services": "Detaylar",
    "nav.vision": "Vizyon",
    "nav.contact": "İletişim",
    "slider.eyebrow": "Özel Deneyim",
    "slider.title": "SPION ile",
    "slider.subtitle": "SPION ile marka hikâyeni sinematik bir serüvene dönüştür, her temas noktasında aynı etkiyi bırak.",
    "slider.metric.0.value": "360°",
    "slider.metric.0.label": "Tüm kanallarda strateji",
    "slider.metric.1.value": "7/24",
    "slider.metric.1.label": "Operasyon takibi",
    "slider.metric.2.value": "∞",
    "slider.metric.2.label": "Kişiye özel kombinasyon",
    "slider.cta": "Planını Başlat",
    "slider.status": "Kaydırarak keşfet",
    "slider.item1.badge": "Creative Ops",
    "slider.item1.title": "Yakında...",
    "slider.item1.desc": "Hollywood standartlarındaki hizmetleri tek panelden yönet.",
    "slider.item1.point.0": "Sahnede kullanılacak tüm materyaller tek pipeline",
    "slider.item1.point.1": "AI destekli storyboard ve tempo eşleme",
    "slider.item1.point.2": "Canlı moderatör ve yayın yönetmeni eş zamanlı",
    "slider.item2.badge": "Agent Program",
    "slider.item2.title": "Ajanlarımız seni bu dünyaya hazırlasın..",
    "slider.item2.desc": "Profesyonel ekibimizle yıldız olma yolculuğunda yanındayız.",
    "slider.item2.point.0": "Kişiye özel medya hazırlık kampı",
    "slider.item2.point.1": "Haftalık performans raporu ve yeni görevler",
    "slider.item2.point.2": "Mentor eşliğinde sahne ve kamera provası",
    "slider.item3.badge": "Social Lab",
    "slider.item3.title": "Fenomen Olmak İçin Spion Media!",
    "slider.item3.desc": "Sosyal medya algoritmalarımız ve içerik stratejilerimizle sizi bir sonraki fenomen yapıyoruz.",
    "slider.item3.point.0": "Trend tetikleyici içerik kalıpları",
    "slider.item3.point.1": "Çok kanallı yayın akışı takvimi",
    "slider.item3.point.2": "Topluluk yönetimi ve nano influencer ağı",
    "slider.item4.badge": "Neural Studio",
    "slider.item4.title": "Algıları Baştan Yarat!",
    "slider.item4.desc": "Yapay zekanın gücünü sonuna kadar kullan.",
    "slider.item4.point.0": "Gerçek zamanlı ses ve görüntü sentezi",
    "slider.item4.point.1": "Bilişsel duygu haritalaması",
    "slider.item4.point.2": "Interaktif fuar ve deneyim kurulumu",
    "hero.badge": "Yeni Nesil Medya",
    "hero.line.prefix": "",
    "hero.line.suffix": " teknoloji ile birleştiriyoruz",
    "hero.words.0": "mobiliteyi",
    "hero.words.1": "kararlılığı",
    "hero.words.2": "tasarımı",
    "hero.words.3": "zekayı",
    "hero.title.line1": "Yaratıcılığı Teknoloji",
    "hero.title.line2": "ile Birleştiriyoruz",
    "hero.subtitle": "SPIONARMY — görsel, işitsel ve dijital deneyimlerin geleceğini inşa ediyor.",
    "hero.stats.0.value": "Sonsuz",
    "hero.stats.0.label": "Farklı tasarım",
    "hero.stats.1.value": "15+",
    "hero.stats.1.label": "Uzman personel",
    "hero.stats.2.value": "24/7",
    "hero.stats.2.label": "Destek",
    "hero.cta.primary": "Başlayın",
    "hero.cta.secondary": "Demo İzle",
    "hero.scroll": "Keşfetmek için kaydır",
    "services.title": "Hizmetlerimiz",
    "services.video.title": "Video Prodüksiyon Hizmetleri",
    "services.video.desc": "Markanızı yükselten, izleyiciyi büyüleyen görsel hikayeler oluşturuyoruz.",
    "services.music.title": "Müzik Prodüksiyon Hizmetleri",
    "services.music.desc": "Her mecra için özgün ses dünyaları ve profesyonel ses deneyimleri hazırlıyoruz.",
    "services.gamification.title": "Oyunlaştırılmış Pazarlama",
    "services.gamification.desc": "Etkileşimi artıran, oyun tabanlı pazarlama stratejileri geliştiriyoruz.",
    "services.ai.title": "Yapay Zeka Hizmetleri",
    "services.ai.desc": "Ses ve video klonlama, içerik iyileştirme ve ileri AI çözümleri sunuyoruz.",
    "services.social.title": "Sosyal Medya Yönetimi",
    "services.social.desc": "Tüm platformlarda dijital varlığınızı planlıyor ve yönetiyoruz.",
    "vision.title": "Vizyon",
    "vision.subtitle": "Trend Terazisini Tutan Merkez",
    "vision.description": "Sistemde bir terazi işlevi görerek, öne çıkaracağımız trendi ve kişiyi stratejik olarak belirleyen; operasyonlarını kendi uzman ekibiyle yürüten güçlü ve merkezi bir yapı olmayı hedefliyoruz.",
    "vision.statement": "Trend terazisini tuttuğumuz bu merkez; veri, yaratıcılık ve uzman ağımızın aynı anda çalıştığı stratejik bir operasyon üssüdür.",
    "vision.metrics.0.value": "24/7",
    "vision.metrics.0.label": "Trend tarama döngüsü",
    "vision.metrics.1.value": "15+",
    "vision.metrics.1.label": "Aktif uzman",
    "vision.metrics.2.value": "Çekirdek",
    "vision.metrics.2.label": "Uzman kadro",
    "vision.quote": "\u201cTeraziyi biz tutarız; yetkinlik ağırlık yapar, sonuç dengeyi belirler.\u201d",
    "vision.mantra": "Şov değil, etki. Süreç değil, sonuç. Estetik değil, üstünlük.",
    "vision.pillars.title": "Merkezi güçlü kılan üç kolon",
    "vision.pillars.0.tag": "Seçim",
    "vision.pillars.0.title": "Trend Strateji Masası",
    "vision.pillars.0.desc": "Güncel kültürel sinyalleri filtreleyip kimin ve neyin yükseltileceğine karar veren çekirdek ekip.",
    "vision.pillars.0.point.0": "Veri odaklı analiz ile potansiyel etkileri ölçekler.",
    "vision.pillars.0.point.1": "Topluluk içgörülerini gerçek zamanlı dinler.",
    "vision.pillars.0.point.2": "Ajanslara net hedef ve hikâye çerçevesi verir.",
    "vision.pillars.1.tag": "Üretim",
    "vision.pillars.1.title": "Uzmanlarımız",
    "vision.pillars.1.desc": "Video, ses, 3D ve oyunlaştırma alanındaki uzmanlarımız aynı vizyonu farklı formatlara taşır.",
    "vision.pillars.1.point.0": "Tüm üretim katmanları tek pano üzerinden koordine edilir.",
    "vision.pillars.1.point.1": "Tekrarlanabilir pipeline, kaliteyi standart tutar.",
    "vision.pillars.1.point.2": "Deneysel görevler sonuç üreten formatlara evrilir.",
    "vision.pillars.2.tag": "Operasyon",
    "vision.pillars.2.title": "Uzman Ağının Gücü",
    "vision.pillars.2.desc": "Kendi uzmanlarımız trendi sahada büyütür, doğru kişileri görünür kılar.",
    "vision.pillars.2.point.0": "Manipülasyon değil, ölçümlenebilir etki üretir.",
    "vision.pillars.2.point.1": "Topluluk yönetimi ve medya refleksleri entegredir.",
    "vision.pillars.2.point.2": "Sonuç kanıtlandığında başarı otomatik görünür olur.",
    "vision.flow.title": "Operasyon akışımız",
    "vision.flow.0.step": "01",
    "vision.flow.0.title": "Veri ve sezgi taraması",
    "vision.flow.0.desc": "Algoritmalar ve deneyimli gözler kültürel sinyalleri toplar.",
    "vision.flow.1.step": "02",
    "vision.flow.1.title": "Stratejik seçim",
    "vision.flow.1.desc": "Terazi kurulup odaklanacağımız trend ve kişi belirlenir.",
    "vision.flow.2.step": "03",
    "vision.flow.2.title": "Çok kanallı üretim",
    "vision.flow.2.desc": "Uzman ekipler hikâyeyi tüm formatlara dönüştürür.",
    "vision.flow.3.step": "04",
    "vision.flow.3.title": "Uzman destekli yayılım",
    "vision.flow.3.desc": "Operasyon ağı trendi büyütür, etkiler ölçülür ve optimize edilir.",
    "event.eyebrow": "Etkinlik Duyurusu",
    "event.title": "Zamanın Günahları Kısa Filmi",
    "event.tag": "Yakında",
    "event.cta": "İletişime Geç",
    "contact.title": "İletişime Geçin",
    "contact.tag": "SPIONARMY ile çalışın",
    "contact.headline": "Unutulmaz deneyimleri birlikte oluşturalım",
    "contact.lead": "Hedeflerinizi paylaşın; markanızı güçlendirecek görsel, işitsel ve dijital yolculuğu tasarlayalım.",
    "contact.highlight.0.title": "Uçtan uca kreatif yönlendirme",
    "contact.highlight.0.desc": "Konsept geliştirmeden teslimata kadar hikayenizi teknoloji ve sanatla uyumlu hale getiriyoruz.",
    "contact.highlight.1.title": "Uyarlanabilir, çok dilli prodüksiyon",
    "contact.highlight.1.desc": "Video, ses, sosyal ve immersif platformlarda global kitlelere özel içerik üretiyoruz.",
    "contact.social.title": "Sosyal kanalları mı tercih ediyorsunuz?",
    "contact.form.title": "Proje özeti",
    "contact.form.desc": "Vizyonunuzu, zaman çizelgenizi ve referanslarınızı paylaşın. Bir iş günü içinde geri dönüş yapalım.",
    "contact.form.name": "Adınız",
    "contact.form.email": "E-postanız",
    "contact.form.message": "Mesajınız",
    "contact.form.submit": "Mesaj Gönder",
    "why.title": "Neden SPIONARMY?",
    "why.perspective.title": "Yeni Bakış Açısı",
    "why.perspective.desc": "Yeni nesil yaratıcı düşünce ve taze fikirlerle dolu genç, dinamik bir ekip.",
    "why.tech.title": "Son Teknoloji",
    "why.tech.desc": "En yeni yapay zeka araçları ve üretim teknolojileriyle donatılmış modern altyapı.",
    "why.customer.title": "Müşteri Odaklı",
    "why.customer.desc": "Her proje benzersiz bir hikâye — vizyonunuzu gerçeğe dönüştürmeye kendimizi adadık.",
    "why.innovative.title": "İnovatif Yaklaşım",
    "why.innovative.desc": "Geleneksel sınırları zorlayan yaratıcı ve teknik çözümler sunuyoruz.",
    "why.highlight": "Son Teknoloji ve Yeni Nesil Bakış Açısı",
    "cookies.title": "Çerezler ve Gizlilik",
    "cookies.description": "Site deneyiminizi iyileştirmek ve kullanım verilerini anlamak için çerezler kullanıyoruz.",
    "cookies.item.necessary": "Zorunlu çerezler güvenliği sağlar ve temel işlevsellikleri etkin tutar.",
    "cookies.item.analytics": "Analitik çerezler trafiği analiz ederek hizmetlerimizi geliştirmemize yardımcı olur.",
    "cookies.item.preference": "Tercih çerezleri dil seçiminizi ve ayarlarınızı hatırlar."
  },
  az: {
    "nav.home": "Ana Səhifə",
    "nav.slider": "Xidmətlər",
    "nav.services": "Təfərrüatlar",
    "nav.vision": "Vizion",
    "nav.contact": "Əlaqə",
    "slider.eyebrow": "Xüsusi Təcrübə",
    "slider.title": "SPION ilə",
    "slider.subtitle": "SPION ilə marka hekayəni kinoteatr səfərinə çevir, hər toxunma nöqtəsində eyni təsiri yarat.",
    "slider.metric.0.value": "360°",
    "slider.metric.0.label": "Bütün kanallarda strategiya",
    "slider.metric.1.value": "7/24",
    "slider.metric.1.label": "Operativ izləmə",
    "slider.metric.2.value": "∞",
    "slider.metric.2.label": "Fərdi kombinasiyalar",
    "slider.cta": "Planını Başlat",
    "slider.status": "Kəşf etmək üçün sürüşdür",
    "slider.item1.badge": "Creative Ops",
    "slider.item1.title": "Tezliklə...",
    "slider.item1.desc": "Hollywood standartlı istehsalı tək paneldən idarə et.",
    "slider.item1.point.0": "Səhnə materiallarının hamısı tək pipeline",
    "slider.item1.point.1": "AI dəstəyi ilə storyboard və tempo uyğunluğu",
    "slider.item1.point.2": "Canlı moderator və yayım rejissoru sinxron",
    "slider.item2.badge": "Agent Program",
    "slider.item2.title": "Agentlərimiz sizi bu dünyaya hazırlasın..",
    "slider.item2.desc": "Peşəkar komandamız sizi ulduzluğa gedən yolda müşayiət edir.",
    "slider.item2.point.0": "Fərdi media hazırlıq düşərgəsi",
    "slider.item2.point.1": "Həftəlik performans hesabatı və yeni missiyalar",
    "slider.item2.point.2": "Mentorla səhnə və kamera məşqləri",
    "slider.item3.badge": "Social Lab",
    "slider.item3.title": "Fenomen Olmaq Üçün Spion Media!",
    "slider.item3.desc": "Sosial media alqoritmlərimizlə sizi növbəti fenomen edirik.",
    "slider.item3.point.0": "Trend yaradan kontent formulları",
    "slider.item3.point.1": "Çox kanallı dərc təqvimi",
    "slider.item3.point.2": "İcma idarəçiliyi və nano influencer şəbəkəsi",
    "slider.item4.badge": "Neural Studio",
    "slider.item4.title": "Qavrayışları Yenidən Yarat!",
    "slider.item4.desc": "Süni intellektin gücündən tam istifadə et.",
    "slider.item4.point.0": "Real vaxtda səs və görüntü sintezi",
    "slider.item4.point.1": "Koqnitiv emosional xəritəçəkmə",
    "slider.item4.point.2": "Interaktiv sərgi və təcrübə qurğuları",
    "hero.badge": "Yeni Nəsil Media",
    "hero.line.prefix": "Biz ",
    "hero.line.suffix": " texnologiya ilə birləşdiririk",
    "hero.words.0": "mobilliyi",
    "hero.words.1": "sabitliyi",
    "hero.words.2": "dizaynı",
    "hero.words.3": "intellekti",
    "hero.title.line1": "Yaradıcılığı Texnologiya",
    "hero.title.line2": "ilə Birləşdiririk",
    "hero.subtitle": "SPIONARMY — vizual, audio və rəqəmsal təcrübələrin gələcəyini qurur.",
    "hero.stats.0.value": "Sonsuz",
    "hero.stats.0.label": "Farklı tasarım",
    "hero.stats.1.value": "15+",
    "hero.stats.1.label": "Uzman personel",
    "hero.stats.2.value": "24/7",
    "hero.stats.2.label": "Destek",
    "hero.cta.primary": "Başlayın",
    "hero.cta.secondary": "Demo İzlə",
    "hero.scroll": "Kəşf etmək üçün sürüşdür"
  }
};

const DIL_TERCIH_ANAHTARI = 'spion-dil';

const dilTercihiniKaydet = (dil) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DIL_TERCIH_ANAHTARI, dil);
    }
  } catch (e) {}
};

const dilTercihiniAl = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saklanan = window.localStorage.getItem(DIL_TERCIH_ANAHTARI);
      return saklanan && ceviri[saklanan] ? saklanan : null;
    }
  } catch (e) {}
  return null;
};

// Language switcher
const dil_kodu_ogesi = document.getElementById('dil_kodu');
const dil_secimleri = [...document.querySelectorAll('.lang-option')];
const icerik_koku = document.querySelector('main');

function dilDegistir(yeni_dil, options = {}) {
  if (!ceviri[yeni_dil]) return;

  const sessiz = options.sessiz === true;

  const cevirileriUygula = () => {
    document.querySelectorAll('[data-translate]').forEach(oge => {
      const anahtar = oge.getAttribute('data-translate');
      if (ceviri[yeni_dil][anahtar]) {
        oge.textContent = ceviri[yeni_dil][anahtar];
      }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(oge => {
      const anahtar = oge.getAttribute('data-translate-placeholder');
      if (ceviri[yeni_dil][anahtar]) {
        oge.placeholder = ceviri[yeni_dil][anahtar];
      }
    });
  };

  document.body.setAttribute('data-dil', yeni_dil);

  if (!sessiz && icerik_koku) {
    icerik_koku.classList.add('lang-transition');
    setTimeout(() => {
      cevirileriUygula();
      if (icerik_koku) {
        icerik_koku.classList.remove('lang-transition');
      }
    }, 150);
  } else {
    cevirileriUygula();
    if (icerik_koku) {
      icerik_koku.classList.remove('lang-transition');
    }
  }

  dil_secimleri.forEach(sec => {
    const secim_dili = sec.getAttribute('data-lang');
    const aktif = secim_dili === yeni_dil;
    sec.classList.toggle('is-active', aktif);
    sec.setAttribute('aria-selected', aktif ? 'true' : 'false');
  });
  
  const aktif_secim = dil_secimleri.find(s => s.getAttribute('data-lang') === yeni_dil);
  if (aktif_secim && dil_kodu_ogesi) {
    dil_kodu_ogesi.textContent = aktif_secim.getAttribute('data-code');
  }

  dilTercihiniKaydet(yeni_dil);
}

const dil_anahtari = document.getElementById('dil_anahtari');
const dil_menusu = document.getElementById('dil_menusu');
const dil_kutusu = document.getElementById('dil_kutusu');

if (dil_anahtari && dil_menusu && dil_kutusu) {
  dil_anahtari.addEventListener('click', () => {
    const acik = dil_kutusu.classList.toggle('open');
    dil_anahtari.setAttribute('aria-expanded', acik ? 'true' : 'false');
  });
  
  document.addEventListener('click', e => {
    if (!dil_kutusu.contains(e.target)) {
      dil_kutusu.classList.remove('open');
      dil_anahtari.setAttribute('aria-expanded', 'false');
    }
  });
  
  dil_secimleri.forEach(secim => {
    secim.addEventListener('click', () => {
      const yeni_dil = secim.getAttribute('data-lang');
      dilDegistir(yeni_dil);
      dil_kutusu.classList.remove('open');
      dil_anahtari.setAttribute('aria-expanded', 'false');
    });
  });
}

const baslangicDili = dilTercihiniAl() || 'tr';
dilDegistir(baslangicDili, { sessiz: true });

// Year
const yil_ogesi = document.getElementById('yil');
if (yil_ogesi) {
  yil_ogesi.textContent = new Date().getFullYear();
}

// Contact form
const iletisim_formu = document.getElementById('iletisim_formu');
if (iletisim_formu) {
  iletisim_formu.addEventListener('submit', async e => {
    e.preventDefault();
    const ad = document.getElementById('ad').value.trim();
    const eposta = document.getElementById('eposta').value.trim();
    const mesaj = document.getElementById('mesaj').value.trim();
    
    if (!ad || !eposta || !mesaj) return;
    
    const durum_ogesi = document.querySelector('.form-status') || document.createElement('div');
    if (!durum_ogesi.classList.contains('form-status')) {
      durum_ogesi.className = 'form-status';
      iletisim_formu.appendChild(durum_ogesi);
    }
    
    durum_ogesi.classList.add('is-active');
    durum_ogesi.classList.remove('is-success', 'is-error');
    durum_ogesi.textContent = 'Gönderiliyor...';
    
    await new Promise(r => setTimeout(r, 1500));
    
    durum_ogesi.classList.add('is-success');
    durum_ogesi.textContent = 'Mesajınız başarıyla gönderildi!';
    iletisim_formu.reset();
    
    setTimeout(() => {
      durum_ogesi.classList.remove('is-active');
    }, 4000);
  });
}

// Slider functionality
const sliderTrack = document.querySelector('.slider-track');
const sliderItems = document.querySelectorAll('.slider-item');
const sliderPrev = document.querySelector('.slider-prev');
const sliderNext = document.querySelector('.slider-next');
const sliderDotsContainer = document.querySelector('.slider-dots');

if (sliderTrack && sliderItems.length > 0) {
  let currentSlide = 0;
  const totalSlides = sliderItems.length;
  
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.slider-dot');
  
  function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }
  
  if (sliderNext) sliderNext.addEventListener('click', nextSlide);
  if (sliderPrev) sliderPrev.addEventListener('click', prevSlide);
  
  // Auto-play slider
  let autoplayInterval = setInterval(nextSlide, 5000);
  
  // Pause on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });
    sliderContainer.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }
}

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Update active link
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Mobile menu toggle
const navKoku = document.querySelector('.nav.glass');
const menuToggle = document.querySelector('.menu-toggle');
if (navKoku && menuToggle) {
  menuToggle.setAttribute('aria-expanded', 'false');
  navKoku.classList.add('show');

  menuToggle.addEventListener('click', () => {
    const open = navKoku.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      navKoku.classList.add('show');
      navKoku.classList.remove('hide');
    }
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navKoku.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Hide/show on scroll direction
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    const down = current > lastScrollY;

    if (!navKoku.classList.contains('open')) {
      if (down && current > 80) {
        navKoku.classList.add('hide');
        navKoku.classList.remove('show');
      } else {
        navKoku.classList.remove('hide');
        navKoku.classList.add('show');
      }
    } else {
      // Keep visible if menu is open
      navKoku.classList.remove('hide');
      navKoku.classList.add('show');
      // Close menu on scroll movement
      if (Math.abs(current - lastScrollY) > 5) {
        navKoku.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }

    lastScrollY = current;
  }, { passive: true });
}

// Update active nav link on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 100);
});


// Add French translations
ceviri.fr = {
  "nav.home": "Accueil",
  "nav.slider": "Services",
  "nav.services": "Détails",
  "nav.vision": "Vision",
  "nav.contact": "Contact",
  "slider.eyebrow": "Expérience Signature",
  "slider.title": "Avec SPION",
  "slider.subtitle": "Avec SPION, transformez votre histoire de marque en un voyage cinématographique et créez le même impact à chaque point de contact.",
  "slider.metric.0.value": "360°",
  "slider.metric.0.label": "Stratégie sur tous les canaux",
  "slider.metric.1.value": "24/7",
  "slider.metric.1.label": "Suivi opérationnel",
  "slider.metric.2.value": "∞",
  "slider.metric.2.label": "Combinaisons sur mesure",
  "slider.cta": "Lancer votre plan",
  "slider.status": "Faites défiler pour explorer",
  "slider.item1.badge": "Creative Ops",
  "slider.item1.title": "Bientôt...",
  "slider.item1.desc": "Pilotez des productions de niveau Hollywood depuis un seul panneau.",
  "slider.item1.point.0": "Tous les éléments de scène réunis dans un pipeline",
  "slider.item1.point.1": "Storyboard et tempo assistés par IA",
  "slider.item1.point.2": "Modérateur en direct et réalisateur synchronisés",
  "slider.item2.badge": "Agent Program",
  "slider.item2.title": "Nos agents vous préparent à ce monde..",
  "slider.item2.desc": "Notre équipe professionnelle vous accompagne vers la célébrité.",
  "slider.item2.point.0": "Bootcamp de préparation médiatique personnalisé",
  "slider.item2.point.1": "Rapport de performance hebdomadaire et nouvelles missions",
  "slider.item2.point.2": "Répétitions scène et caméra avec mentor",
  "slider.item3.badge": "Social Lab",
  "slider.item3.title": "Spion Media pour devenir un phénomène !",
  "slider.item3.desc": "Nous faisons de vous le prochain phénomène avec des stratégies sociales fondées sur la donnée.",
  "slider.item3.point.0": "Formules de contenu déclencheur de tendance",
  "slider.item3.point.1": "Calendrier de diffusion multicanal",
  "slider.item3.point.2": "Gestion de communauté et réseau de nano-influenceurs",
  "slider.item4.badge": "Neural Studio",
  "slider.item4.title": "Recréez les perceptions !",
  "slider.item4.desc": "Exploitez toute la puissance de l'IA pour remodeler la perception.",
  "slider.item4.point.0": "Synthèse vocale et visuelle en temps réel",
  "slider.item4.point.1": "Cartographie cognitive des émotions",
  "slider.item4.point.2": "Installations interactives pour salons et expériences",
  "hero.badge": "Médias Nouvelle Génération",
  "hero.line.prefix": "Nous fusionnons ",
  "hero.line.suffix": " avec la technologie",
  "hero.words.0": "la mobilité",
  "hero.words.1": "la stabilité",
  "hero.words.2": "le design",
  "hero.words.3": "l'intelligence",
  "hero.title.line1": "Fusionner la créativité",
  "hero.title.line2": "avec la technologie",
  "hero.subtitle": "SPIONARMY — Construire l'avenir des expériences visuelles, audio et numériques.",
  "hero.stats.0.value": "Sonsuz",
  "hero.stats.0.label": "Farklı tasarım",
  "hero.stats.1.value": "15+",
  "hero.stats.1.label": "Uzman personel",
  "hero.stats.2.value": "24/7",
  "hero.stats.2.label": "Destek",
  "hero.cta.primary": "Commencer",
  "hero.cta.secondary": "Voir la démo",
  "hero.scroll": "Faites défiler pour explorer",
  "services.title": "Nos Services",
  "why.title": "Pourquoi SPIONARMY ?",
  "contact.title": "Contactez-nous",
  "vision.title": "Vision",
  "vision.quote": "\u00ab Nous tenons la balance ; l'expertise ajoute du poids, les r\u00e9sultats fixent l'\u00e9quilibre. \u00bb",
  "vision.mantra": "Pas le spectacle, l'impact. Pas le processus, le r\u00e9sultat. Pas l'esth\u00e9tique, la sup\u00e9riorit\u00e9."
};

// Add German translations
ceviri.de = {
  "nav.home": "Startseite",
  "nav.slider": "Dienstleistungen",
  "nav.services": "Details",
  "nav.vision": "Vision",
  "nav.contact": "Kontakt",
  "slider.eyebrow": "Signature-Erlebnis",
  "slider.title": "Mit SPION",
  "slider.subtitle": "Mit SPION wird Ihre Markenstory zu einer filmischen Reise – mit derselben Wirkung an jedem Touchpoint.",
  "slider.metric.0.value": "360°",
  "slider.metric.0.label": "Strategie über alle Kanäle",
  "slider.metric.1.value": "24/7",
  "slider.metric.1.label": "Operatives Monitoring",
  "slider.metric.2.value": "∞",
  "slider.metric.2.label": "Individuelle Kombinationen",
  "slider.cta": "Plan starten",
  "slider.status": "Zum Entdecken wischen",
  "slider.item1.badge": "Creative Ops",
  "slider.item1.title": "Demnächst...",
  "slider.item1.desc": "Hollywood-Produktionen über ein einziges Dashboard steuern.",
  "slider.item1.point.0": "Alle Bühnenelemente in einer Pipeline",
  "slider.item1.point.1": "KI-gestütztes Storyboard und Tempomatching",
  "slider.item1.point.2": "Live-Moderator und Regie synchron",
  "slider.item2.badge": "Agent Program",
  "slider.item2.title": "Unsere Agenten bereiten Sie auf diese Welt vor..",
  "slider.item2.desc": "Unser Team begleitet Sie professionell auf dem Weg zum Star.",
  "slider.item2.point.0": "Personalisierte Media-Prep-Bootcamps",
  "slider.item2.point.1": "Wöchentlicher Performance-Report und neue Missionen",
  "slider.item2.point.2": "Bühnen- und Kamera-Coaching mit Mentor",
  "slider.item3.badge": "Social Lab",
  "slider.item3.title": "Spion Media, um ein Phänomen zu werden!",
  "slider.item3.desc": "Mit datengetriebenen Social-Media-Strategien machen wir Sie zum Phänomen.",
  "slider.item3.point.0": "Trend-auslösende Content-Formeln",
  "slider.item3.point.1": "Multichannel-Publishing-Kalender",
  "slider.item3.point.2": "Community-Management plus Nano-Influencer-Netzwerk",
  "slider.item4.badge": "Neural Studio",
  "slider.item4.title": "Wahrnehmungen neu erschaffen!",
  "slider.item4.desc": "Nutzen Sie KI voll aus, um Wahrnehmung zu formen.",
  "slider.item4.point.0": "Echtzeit-Synthese von Stimme und Bild",
  "slider.item4.point.1": "Kognitive Emotionskartierung",
  "slider.item4.point.2": "Interaktive Expo- und Erlebnisinstallationen",
  "hero.badge": "Medien der nächsten Generation",
  "hero.line.prefix": "Wir vereinen ",
  "hero.line.suffix": " mit Technologie",
  "hero.words.0": "Mobilität",
  "hero.words.1": "Stabilität",
  "hero.words.2": "Design",
  "hero.words.3": "Intelligenz",
  "hero.title.line1": "Kreativität mit",
  "hero.title.line2": "Technologie verschmelzen",
  "hero.subtitle": "SPIONARMY — Die Zukunft visueller, audio und digitaler Erlebnisse gestalten.",
  "hero.stats.0.value": "Sonsuz",
  "hero.stats.0.label": "Farklı tasarım",
  "hero.stats.1.value": "15+",
  "hero.stats.1.label": "Uzman personel",
  "hero.stats.2.value": "24/7",
  "hero.stats.2.label": "Destek",
  "hero.cta.primary": "Loslegen",
  "hero.cta.secondary": "Demo ansehen",
  "hero.scroll": "Scrollen Sie zum Erkunden",
  "services.title": "Unsere Dienstleistungen",
  "why.title": "Warum SPIONARMY?",
  "contact.title": "Kontakt aufnehmen",
  "vision.title": "Vision"
};

// Add Spanish translations
ceviri.es = {
  "nav.home": "Inicio",
  "nav.slider": "Servicios",
  "nav.services": "Detalles",
  "nav.vision": "Visión",
  "nav.contact": "Contacto",
  "slider.eyebrow": "Experiencia exclusiva",
  "slider.title": "Con SPION",
  "slider.subtitle": "Con SPION, convierte la historia de tu marca en una travesía cinematográfica con el mismo impacto en cada punto de contacto.",
  "slider.metric.0.value": "360°",
  "slider.metric.0.label": "Estrategia en todos los canales",
  "slider.metric.1.value": "24/7",
  "slider.metric.1.label": "Monitoreo operativo",
  "slider.metric.2.value": "∞",
  "slider.metric.2.label": "Combinaciones personalizadas",
  "slider.cta": "Iniciar plan",
  "slider.status": "Desliza para explorar",
  "slider.item1.badge": "Creative Ops",
  "slider.item1.title": "Próximamente...",
  "slider.item1.desc": "Dirige producciones al estándar de Hollywood desde un solo panel.",
  "slider.item1.point.0": "Todo el material escénico en una sola pipeline",
  "slider.item1.point.1": "Storyboard y tempo asistidos por IA",
  "slider.item1.point.2": "Moderador en vivo y director sincronizados",
  "slider.item2.badge": "Agent Program",
  "slider.item2.title": "Nuestros agentes te preparan para este mundo..",
  "slider.item2.desc": "Nuestro equipo profesional te acompaña hacia la fama.",
  "slider.item2.point.0": "Bootcamp personalizado de preparación mediática",
  "slider.item2.point.1": "Informe semanal de desempeño y nuevas misiones",
  "slider.item2.point.2": "Ensayos de escenario y cámara con mentor",
  "slider.item3.badge": "Social Lab",
  "slider.item3.title": "¡Spion Media para convertirte en un fenómeno!",
  "slider.item3.desc": "Te convertimos en un fenómeno con estrategias sociales basadas en datos.",
  "slider.item3.point.0": "Fórmulas de contenido que disparan tendencias",
  "slider.item3.point.1": "Calendario de publicación multicanal",
  "slider.item3.point.2": "Gestión de comunidad y red de nano influencers",
  "slider.item4.badge": "Neural Studio",
  "slider.item4.title": "¡Recrea las percepciones!",
  "slider.item4.desc": "Exprime al máximo la IA para reinventar la percepción.",
  "slider.item4.point.0": "Síntesis de voz e imagen en tiempo real",
  "slider.item4.point.1": "Mapeo cognitivo de emociones",
  "slider.item4.point.2": "Montajes interactivos para ferias y experiencias",
  "hero.badge": "Medios de Nueva Generación",
  "hero.line.prefix": "Unimos ",
  "hero.line.suffix": " con la tecnología",
  "hero.words.0": "la movilidad",
  "hero.words.1": "la estabilidad",
  "hero.words.2": "el diseño",
  "hero.words.3": "la inteligencia",
  "hero.title.line1": "Fusionando creatividad",
  "hero.title.line2": "con tecnología",
  "hero.subtitle": "SPIONARMY — Construyendo el futuro de las experiencias visuales, de audio y digitales.",
  "hero.stats.0.value": "Sonsuz",
  "hero.stats.0.label": "Farklı tasarım",
  "hero.stats.1.value": "15+",
  "hero.stats.1.label": "Uzman personel",
  "hero.stats.2.value": "24/7",
  "hero.stats.2.label": "Destek",
  "hero.cta.primary": "Comenzar",
  "hero.cta.secondary": "Ver demo",
  "hero.scroll": "Desplázate para explorar",
  "services.title": "Nuestros Servicios",
  "why.title": "¿Por qué SPIONARMY?",
  "contact.title": "Ponte en contacto",
  "vision.title": "Visión"
};

// Add Russian translations
ceviri.ru = {
  "nav.home": "Главная",
  "nav.slider": "Услуги",
  "nav.services": "Подробнее",
  "nav.vision": "Видение",
  "nav.contact": "Контакт",
  "slider.eyebrow": "Эксклюзивный опыт",
  "slider.title": "Со SPION",
  "slider.subtitle": "Со SPION история вашего бренда становится кинематографическим путешествием с одинаковым эффектом в каждой точке контакта.",
  "slider.metric.0.value": "360°",
  "slider.metric.0.label": "Стратегия на всех каналах",
  "slider.metric.1.value": "24/7",
  "slider.metric.1.label": "Операционный мониторинг",
  "slider.metric.2.value": "∞",
  "slider.metric.2.label": "Индивидуальные комбинации",
  "slider.cta": "Запустить план",
  "slider.status": "Прокрутите, чтобы изучить",
  "slider.item1.badge": "Creative Ops",
  "slider.item1.title": "Скоро...",
  "slider.item1.desc": "Управляйте производством уровня Голливуд с одного панели.",
  "slider.item1.point.0": "Все сценические материалы в едином конвейере",
  "slider.item1.point.1": "КИ-ассистированный сторибординг и темп",
  "slider.item1.point.2": "Живой модератор и режиссер синхронизированы",
  "slider.item2.badge": "Agent Program",
  "slider.item2.title": "Наши агенты подготовят вас к этому миру..",
  "slider.item2.desc": "Мы с вами на пути к звездной славе с нашей профессиональной командой.",
  "slider.item2.point.0": "Персонализированный медиа-подготовительный.bootcamp",
  "slider.item2.point.1": "Еженедельный отчет о производительности и новые миссии",
  "slider.item2.point.2": "Тренировки сцены и камеры с наставником",
  "slider.item3.badge": "Social Lab",
  "slider.item3.title": "Spion Media, чтобы стать феноменом!",
  "slider.item3.desc": "Мы делаем вас следующим феноменом с нашими алгоритмами социальных сетей и контент-стратегиями.",
  "slider.item3.point.0": "Формулы контента, запускающие тренды",
  "slider.item3.point.1": "Мультиканальный календарь публикаций",
  "slider.item3.point.2": "Управление сообществом и сеть нано-инфлюенсеров",
  "slider.item4.badge": "Neural Studio",
  "slider.item4.title": "Пересоздайте восприятие!",
  "slider.item4.desc": "Используйте ИИ для формирования восприятия.",
  "slider.item4.point.0": "Синтез голоса и изображения в режиме реального времени",
  "slider.item4.point.1": "Когнитивная карта эмоций",
  "slider.item4.point.2": "Интерактивные установки для выставок и опыта",
  "hero.badge": "Медиа нового поколения",
  "hero.line.prefix": "Мы объединяем ",
  "hero.line.suffix": " с технологиями",
  "hero.words.0": "мобильность",
  "hero.words.1": "устойчивость",
  "hero.words.2": "дизайн",
  "hero.words.3": "интеллект",
  "hero.title.line1": "Объединяя креативность",
  "hero.title.line2": "с технологией",
  "hero.subtitle": "SPIONARMY — Создаем будущее визуальных, аудио и цифровых впечатлений.",
  "hero.stats.0.value": "Sonsuz",
  "hero.stats.0.label": "Farklı tasarım",
  "hero.stats.1.value": "15+",
  "hero.stats.1.label": "Uzman personel",
  "hero.stats.2.value": "24/7",
  "hero.stats.2.label": "Destek",
  "hero.cta.primary": "Начать",
  "hero.cta.secondary": "Смотреть демо",
  "hero.scroll": "Прокрутите для изучения",
  "services.title": "Наши услуги",
  "why.title": "Почему SPIONARMY?",
  "contact.title": "Связаться",
  "vision.title": "Видение",
  "vision.quote": "\u00ab\u041c\u044b \u0443\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043c \u0432\u0435\u0441\u044b; \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043d\u043e\u0441\u0442\u044c \u0434\u043e\u0431\u0430\u0432\u043b\u044f\u0435\u0442 \u0432\u0435\u0441, \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0437\u0430\u0434\u0430\u044e\u0442 \u0431\u0430\u043b\u0430\u043d\u0441.\u00bb",
  "vision.mantra": "\u041d\u0435 \u0448\u043e\u0443, \u0430 \u044d\u0444\u0444\u0435\u043a\u0442. \u041d\u0435 \u043f\u0440\u043e\u0446\u0435\u0441\u0441, \u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442. \u041d\u0435 \u044d\u0441\u0442\u0435\u0442\u0438\u043a\u0430, \u0430 \u043f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u0441\u0442\u0432\u043e."
};

// Advanced Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    // Add scroll reveal classes to elements
    document.querySelectorAll('.card').forEach((el, index) => {
      el.classList.add('scroll-reveal', `stagger-${(index % 6) + 1}`);
      this.elements.push(el);
    });

    document.querySelectorAll('.vision-card').forEach((el, index) => {
      const direction = index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'zoom';
      el.classList.add(`scroll-reveal-${direction}`, `stagger-${(index % 3) + 1}`);
      this.elements.push(el);
    });

    // Add floating animation to icons
    document.querySelectorAll('.slider-icon, .service-thumb').forEach(el => {
      el.classList.add('float-animation');
    });

    // Add shimmer to section titles only (avoid hero h1 to prevent visibility issues)
    document.querySelectorAll('.title').forEach(el => {
      el.classList.add('text-shimmer');
    });

    // Add 3D effect to cards
    document.querySelectorAll('.service-card').forEach(el => {
      el.classList.add('card-3d', 'card-enhanced');
    });

    // Create scroll progress bar
    this.createScrollProgress();

    // Create particles
    this.createParticles();

    // Setup observers
    this.setupIntersectionObserver();
    this.setupParallax();
    this.setupMagneticEffect();
  }

  createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progress.style.width = scrolled + '%';
    });
  }

  createParticles() {
    const particleCount = 15;
    const hero = document.querySelector('.hero');
    
    if (!hero) return;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      
      hero.appendChild(particle);
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero-inner, .bg-orbs .orb');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.05;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .slider-btn, .nav-link');
    
    magneticElements.forEach(el => {
      el.classList.add('magnetic');
      
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  addRippleEffect(element, x, y) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// Initialize scroll animations
const scrollAnimations = new ScrollAnimations();

// Add ripple effect to buttons
document.querySelectorAll('.btn, button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scrollAnimations.addRippleEffect(this, x, y);
  });
});

// Add section dividers
document.querySelectorAll('.section').forEach((section, index) => {
  if (index > 0) {
    const divider = document.createElement('div');
    divider.className = 'section-divider';
    section.insertBefore(divider, section.firstChild);
  }
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add gradient text animation to specific elements
document.querySelectorAll('.vision-title, .event-title').forEach(el => {
  el.classList.add('gradient-text-animated');
});

// Add neon effect to specific text (exclude logo)
document.querySelectorAll('.vision-quote').forEach(el => {
  el.classList.add('neon-text');
});

// Add glow pulse to cards on hover
document.querySelectorAll('.card, .vision-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('glow-pulse');
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('glow-pulse');
  });
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.body.classList.add('reduce-animations');
}


// Matrix rain effect for hero section
class MatrixRain {
  constructor() {
    this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    this.hero = document.querySelector('.hero');
    if (this.hero && window.innerWidth > 768) {
      this.createRain();
    }
  }

  createRain() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDelay = Math.random() * 2 + 's';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        this.hero.appendChild(char);
        
        setTimeout(() => char.remove(), 5000);
      }, i * 200);
    }
  }
}

// Initialize matrix rain
if (window.innerWidth > 768) {
  new MatrixRain();
  setInterval(() => new MatrixRain(), 10000);
}

// Tilt effect for cards
document.querySelectorAll('.service-card, .vision-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// Spotlight effect
document.querySelectorAll('.card, .btn').forEach(el => {
  el.classList.add('spotlight');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Press 'L' to cycle through languages
  if (e.key === 'l' || e.key === 'L') {
    const langs = ['en', 'tr', 'az', 'fr', 'de', 'es', 'ru'];
    const currentLang = document.body.getAttribute('data-dil') || 'en';
    const currentIndex = langs.indexOf(currentLang);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    dilDegistir(nextLang);
  }
  
  // Press 'T' to scroll to top
  if (e.key === 't' || e.key === 'T') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Press 'B' to scroll to bottom
  if (e.key === 'b' || e.key === 'B') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.classList.add('color-shift');
    setTimeout(() => document.body.classList.remove('color-shift'), 10000);
    
    // Show secret message
    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#0f0;padding:40px;border-radius:20px;font-family:monospace;font-size:24px;z-index:10000;text-align:center;box-shadow:0 0 50px rgba(0,255,0,0.5)';
    msg.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮<br><br>You found the secret!<br>SPIONARMY ELITE MODE';
    document.body.appendChild(msg);
    
    setTimeout(() => msg.remove(), 3000);
  }
});

// Parallax mouse movement for hero
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    document.querySelectorAll('.bg-orbs .orb').forEach((orb, index) => {
      const speed = (index + 1) * 0.5;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

// Add wave effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.classList.add('wave-effect', 'btn-liquid');
});

// Lazy load images with fade-in
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.style.transition = 'opacity 0.6s ease';
    const show = () => { img.style.opacity = '1'; };
    const prepareAndShow = () => {
      if (img.complete) {
        show();
      } else {
        img.style.opacity = '0';
        img.onload = show;
      }
    };
    if (img.dataset.src) {
      img.style.opacity = '0';
      img.src = img.dataset.src;
      img.onload = show;
    } else {
      prepareAndShow();
    }
    imageObserver.unobserve(img);
  });
});

document.querySelectorAll('img').forEach(img => {
  imageObserver.observe(img);
});

// Add scanline effect to specific sections
document.querySelectorAll('.event, .vision').forEach(section => {
  section.classList.add('scanline-effect');
});

// Smooth scroll with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add glass morphism to specific elements
document.querySelectorAll('.contact-info, .contact-form').forEach(el => {
  el.classList.add('glass-morph');
});

// Performance monitoring
if (window.performance && window.performance.memory) {
  console.log('Memory usage:', Math.round(window.performance.memory.usedJSHeapSize / 1048576) + ' MB');
}

// Add loading animation to images
document.querySelectorAll('.service-thumb img').forEach(img => {
  img.style.filter = 'blur(10px)';
  img.style.transition = 'filter 0.5s ease';
  
  img.addEventListener('load', () => {
    img.style.filter = 'blur(0)';
  });
});

// Console art
console.log('%c' + `
███████╗██████╗ ██╗ ██████╗ ███╗   ██╗ █████╗ ██████╗ ███╗   ███╗██╗   ██╗
██╔════╝██╔══██╗██║██╔═══██╗████╗  ██║██╔══██╗██╔══██╗████╗ ████║╚██╗ ██╔╝
███████╗██████╔╝██║██║   ██║██╔██╗ ██║███████║██████╔╝██╔████╔██║ ╚████╔╝ 
╚════██║██╔═══╝ ██║██║   ██║██║╚██╗██║██╔══██║██╔══██╗██║╚██╔╝██║  ╚██╔╝  
███████║██║     ██║╚██████╔╝██║ ╚████║██║  ██║██║  ██║██║ ╚═╝ ██║   ██║   
╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   
`, 'color: #27d3ff; font-weight: bold;');

console.log('%cWelcome to SPIONARMY! 🚀', 'color: #b07bff; font-size: 20px; font-weight: bold;');
console.log('%cKeyboard shortcuts:', 'color: #27d3ff; font-size: 14px; font-weight: bold;');
console.log('%c• Press L to cycle languages', 'color: #fff; font-size: 12px;');
console.log('%c• Press T to scroll to top', 'color: #fff; font-size: 12px;');
console.log('%c• Press B to scroll to bottom', 'color: #fff; font-size: 12px;');
console.log('%c• Try the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color: #ff5fc1; font-size: 12px;');

// Initialize all animations
console.log('%c✨ All animations initialized!', 'color: #0f0; font-size: 12px;');


// Enhanced Hero Section Animations
class HeroAnimations {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.heroInner = document.querySelector('.hero-inner');
    this.particlesContainer = document.querySelector('.hero-particles-container');
    
    if (this.hero) {
      this.init();
    }
  }

  init() {
    this.createFloatingParticles();
    this.setupMouseParallax();
    this.animateHeroElements();
    this.createLightBeams();
  }

  createFloatingParticles() {
    if (!this.particlesContainer || window.innerWidth < 768) return;

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      
      const size = Math.random() * 6 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle, rgba(176,123,255,0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: heroParticleFloat ${duration}s ease-in-out ${delay}s infinite;
        opacity: 0;
      `;
      
      this.particlesContainer.appendChild(particle);
    }
  }

  setupMouseParallax() {
    if (window.innerWidth < 768) return;

    this.hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      // Parallax for hero shapes
      document.querySelectorAll('.hero-shape').forEach((shape, index) => {
        const speed = (index + 1) * 10;
        shape.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
      });
      
      // Parallax for hero badge
      const badge = document.querySelector('.hero-badge');
      if (badge) {
        badge.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px)`;
      }
    });
  }

  animateHeroElements() {
    // Stagger animation for hero elements
    const elements = [
      '.hero-badge',
      '.hero-title-line:first-child',
      '.hero-title-line:last-child',
      '.hero-subtitle',
      '.hero-stats',
      '.hero-cta-group',
      '.hero-scroll-indicator'
    ];

    elements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.animationDelay = `${index * 0.15}s`;
      }
    });
  }

  createLightBeams() {
    if (window.innerWidth < 768) return;

    const beamCount = 3;
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroBackground) return;

    for (let i = 0; i < beamCount; i++) {
      const beam = document.createElement('div');
      beam.className = 'hero-light-beam';
      
      const width = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 15;
      const delay = Math.random() * 5;
      
      beam.style.cssText = `
        position: absolute;
        top: -50%;
        left: ${left}%;
        width: ${width}px;
        height: 200%;
        background: linear-gradient(180deg, 
          transparent, 
          rgba(176,123,255,0.1) 30%, 
          rgba(39,211,255,0.1) 70%, 
          transparent
        );
        transform: rotate(${Math.random() * 30 - 15}deg);
        opacity: 0;
        animation: lightBeamPulse ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
        filter: blur(20px);
      `;
      
      heroBackground.appendChild(beam);
    }
  }
}

// Initialize hero animations
new HeroAnimations();

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes heroParticleFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    50% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
      opacity: 0.6;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.5);
      opacity: 0;
    }
  }

  @keyframes lightBeamPulse {
    0%, 100% {
      opacity: 0;
      transform: translateY(0) rotate(var(--rotation, 0deg));
    }
    50% {
      opacity: 0.3;
      transform: translateY(20px) rotate(var(--rotation, 0deg));
    }
  }

  .hero-particle {
    box-shadow: 0 0 20px rgba(176,123,255,0.6);
  }

  .hero-title-line {
    display: inline-block;
    animation: fadeInUp 1s ease-out forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hero-stat {
    animation: scaleIn 0.6s ease-out forwards;
    opacity: 0;
  }

  .hero-stat:nth-child(1) { animation-delay: 0.8s; }
  .hero-stat:nth-child(2) { animation-delay: 0.95s; }
  .hero-stat:nth-child(3) { animation-delay: 1.1s; }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .btn-primary, .btn-secondary {
    animation: buttonFloat 3s ease-in-out infinite;
  }

  .btn-secondary {
    animation-delay: 0.5s;
  }

  @keyframes buttonFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;
document.head.appendChild(style);

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Apply typing effect after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
      const originalText = subtitle.textContent;
      typeWriter(subtitle, originalText, 30);
    }
  }, 1500);
});

// Add glitch effect to hero title on hover
document.querySelectorAll('.hero-title-gradient').forEach(title => {
  title.addEventListener('mouseenter', function() {
    this.style.animation = 'glitch 0.3s ease-in-out';
  });
  
  title.addEventListener('animationend', function() {
    this.style.animation = '';
  });
});

// Smooth reveal for hero stats with counter animation
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }
  }, 16);
}

// Observe hero stats and animate when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const value = entry.target.querySelector('.hero-stat-value');
      if (value && !value.dataset.animated) {
        value.dataset.animated = 'true';
        const text = value.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        if (!isNaN(number)) {
          animateCounter(value, number, 1500);
        }
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat').forEach(stat => {
  statsObserver.observe(stat);
});


const degisenKelimeEl = document.getElementById('degisen-kelime');
if (degisenKelimeEl) {
  const defaultCycle = ['mobiliteyi','kararlılığı','tasarımı','zekayı'];
  const getWordsForLang = (lang) => {
    const prefix = 'hero.words.';
    const translations = ceviri[lang] || {};
    const keys = Object.keys(translations).filter(key => key.startsWith(prefix)).sort();
    return keys.length ? keys.map(key => translations[key]) : defaultCycle;
  };

  let activeWords = getWordsForLang(document.body.getAttribute('data-dil') || 'tr');
  let i = 0;
  const cycle = () => {
    i = (i + 1) % activeWords.length;
    degisenKelimeEl.textContent = activeWords[i];
  };
  const interval = setInterval(cycle, 2200);

  const updateWords = (lang) => {
    activeWords = getWordsForLang(lang);
    i = 0;
    degisenKelimeEl.textContent = activeWords[0];
  };

  const observer = new MutationObserver(() => {
    const lang = document.body.getAttribute('data-dil') || 'tr';
    updateWords(lang);
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-dil'] });

  updateWords(document.body.getAttribute('data-dil') || 'tr');
}

console.log('%c🎨 Hero section enhanced with advanced animations!', 'color: #b07bff; font-size: 14px; font-weight: bold;');
