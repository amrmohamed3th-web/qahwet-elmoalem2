const WHATSAPP_NUMBER = '201000000000';

const MENU = [
  {
    id: 'hot',
    label: 'مشروبات سخنة',
    items: [
      { name: 'قهوة تركي', description: 'سادة، ع الريحة، مظبوط أو زيادة — على الفحم', price: 35 },
      { name: 'قهوة محوّجة', description: 'بالحبهان والتوابل على طريقة المعلم', price: 40 },
      { name: 'شاي كشري', description: 'شاي فتلة في كوباية إزاز وسكر على مزاجك', price: 20 },
      { name: 'شاي بالنعناع', description: 'نعناع فريش من السوق كل يوم', price: 25 },
      { name: 'شاي بلبن', description: 'لبن كامل الدسم وشاي تقيل', price: 30 },
      { name: 'سحلب', description: 'بالمكسرات وجوز الهند والقرفة', price: 45 },
      { name: 'ينسون / كركديه سخن', description: 'للي عايز يروّق', price: 25 },
      { name: 'حلبة حصى', description: 'دافية ومفيدة', price: 25 },
    ],
  },
  {
    id: 'cold',
    label: 'مشروبات ساقعة',
    items: [
      { name: 'كركديه ساقع', description: 'كركديه أسواني مركّز', price: 30 },
      { name: 'تمر هندي', description: 'على الطريقة الأصلية', price: 30 },
      { name: 'عرقسوس', description: 'بارد ومنعش', price: 30 },
      { name: 'ليمون نعناع', description: 'فريش ومتلّج', price: 40 },
      { name: 'قهوة ساقعة', description: 'قهوة تركي متلّجة بالحليب', price: 50 },
      { name: 'مانجا فريش', description: 'في الموسم بس', price: 55 },
    ],
  },
  {
    id: 'sweets',
    label: 'حلويات وفطار',
    items: [
      { name: 'بسبوسة بالقشطة', description: 'سخنة من الصينية', price: 40 },
      { name: 'أم علي', description: 'بالمكسرات والزبيب', price: 60 },
      { name: 'رز بلبن', description: 'بالفرن أو ساده', price: 35 },
      { name: 'فطار المعلم', description: 'فول، طعمية، بيض، جبنة وعيش بلدي', price: 90 },
      { name: 'ساندوتش جبنة رومي', description: 'عيش فينو محمّص', price: 35 },
    ],
  },
];

const toArabicDigits = (value) => String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

function initHeader() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'اقفل القائمة' : 'افتح القائمة');
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
}

function initMenu() {
  const tabsEl = document.getElementById('menuTabs');
  const panel = document.getElementById('menuPanel');

  const render = (categoryId) => {
    const category = MENU.find((c) => c.id === categoryId);
    panel.setAttribute('aria-labelledby', `tab-${categoryId}`);
    panel.innerHTML = category.items
      .map(
        (item, i) => `
        <div class="menu-item" style="animation-delay:${i * 40}ms">
          <div class="menu-item__body">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <span class="menu-item__price">${toArabicDigits(item.price)} ج</span>
        </div>`
      )
      .join('');

    tabsEl.querySelectorAll('.tab').forEach((tab) => {
      const selected = tab.dataset.id === categoryId;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  };

  tabsEl.innerHTML = MENU.map(
    (c) => `<button class="tab" role="tab" id="tab-${c.id}" data-id="${c.id}" aria-controls="menuPanel">${c.label}</button>`
  ).join('');

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) render(tab.dataset.id);
  });

  tabsEl.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const tabs = [...tabsEl.querySelectorAll('.tab')];
    const current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    // RTL: ArrowLeft moves forward
    const step = e.key === 'ArrowLeft' ? 1 : -1;
    const next = tabs[(current + step + tabs.length) % tabs.length];
    render(next.dataset.id);
    next.focus();
  });

  render(MENU[0].id);
}

function initReservation() {
  const form = document.getElementById('reserveForm');
  const errorEl = document.getElementById('formError');
  const dateInput = document.getElementById('date');
  dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const date = data.get('date');
    const time = data.get('time');
    const notes = String(data.get('notes') || '').trim();

    if (!name || !date || !time) {
      errorEl.textContent = 'من فضلك اكتب الاسم واختار اليوم والساعة.';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    const lines = [
      'السلام عليكم، عايز أحجز ترابيزة في قهوة المعلم',
      `الاسم: ${name}`,
      `عدد الأفراد: ${data.get('guests')}`,
      `اليوم: ${date}`,
      `الساعة: ${time}`,
    ];
    if (notes) lines.push(`ملاحظات: ${notes}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}

function initReveal() {
  const targets = document.querySelectorAll('.section-head, .about__media, .about__body, .feature, .gallery__item, .review, .reserve__intro, .form, .info-card, .visit__map');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

document.getElementById('year').textContent = toArabicDigits(new Date().getFullYear());
initHeader();
initMenu();
initReservation();
initReveal();
