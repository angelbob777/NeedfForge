(function () {
  const STORAGE_KEY = 'needforgeSiteContent';

  const DEFAULT_SITE_CONTENT = {
    heroTitle: 'Grow wealth and knowledge.',
    heroSubtitle: 'Track every level, cycle and available position in one clear view.',
    noticeTitle: 'Supabase setup required',
    noticeBody: 'Add your Supabase URL and anon key in the configuration at the bottom of this file to enable shared registration and realtime updates.',
    howItWorksTitle: 'How it works',
    howItWorksText: 'NeedForge is built around a 10-level member journey. Each level has 10 cycles and each cycle contains 5 spots. Members enter through a chosen level, complete the relevant entry and upgrade requirements, and build a structured network across the platform. As each new level unlocks, members gain access to deeper products, stronger support, and continued growth through their genealogy tree. Every cycle is designed to create a clear path from first entry to long-term progression.',
    productsTitle: 'Products by level',
    productList: [
      'Level 1: Starter product bundle + onboarding access',
      'Level 2: Growth toolkit + member education pack',
      'Level 3: Sales and network building resources',
      'Level 4: Brand and visibility tools',
      'Level 5: Business systems and support training',
      'Level 6: Leadership and team development assets',
      'Level 7: Advanced strategy and operations training',
      'Level 8: Premium scaling resources',
      'Level 9: High-level business product set',
      'Level 10: Executive and flagship product offering'
    ],
    bonusProducts: [
      'Bonus product collection: Additional value packs and special offers',
      'Member bonus resource: Exclusive member-only rewards and partner offers'
    ],
    freeProducts: [
      'NeedForge starter guide: Free introduction to the platform and member dashboard',
      'Free member checklist: Level, cycle and product guidance for new members'
    ],
    contact: {
      company: 'NeedForge',
      email: 'support@needforge.example',
      phone: 'Contact details coming soon',
      address: 'Business address coming soon',
      facebook: '',
      instagram: '',
      whatsapp: ''
    },
    affiliate: {
      eyebrow: 'NeedForge affiliate program',
      title: 'Grow together',
      intro: 'Share NeedForge with people who want a structured path through our products and ten-level member platform.',
      body1: 'When you introduce someone to NeedForge, help them understand the products, entry levels and cycle structure. Your genealogy page helps you follow member positions and activity connected to your network.',
      body2: 'New members may choose any target level. They must complete the entry fees for that level and every preceding level, so their account is prepared in the correct order.',
      cta: 'View all level entry options',
      lead: 'Review every level, its entry fee and the combined amount required for your selected target level.'
    },
    productsPage: {
      eyebrow: 'Member resources',
      title: 'Products',
      intro: 'Browse level products, bonus products and free resources. Select an item to view its full details.'
    },
    faqPage: {
      eyebrow: 'Need to know',
      title: 'Frequently asked questions',
      intro: 'Clear answers about levels, cycles and account access.'
    }
  };

  function mergeContent(base, incoming) {
    const merged = JSON.parse(JSON.stringify(base));
    if (!incoming) return merged;

    Object.keys(base).forEach((key) => {
      if (incoming && Object.prototype.hasOwnProperty.call(incoming, key)) {
        if (key === 'contact' || key === 'affiliate' || key === 'productsPage' || key === 'faqPage') {
          merged[key] = { ...(base[key] || {}), ...(incoming[key] || {}) };
        } else if (Array.isArray(base[key])) {
          merged[key] = Array.isArray(incoming[key]) ? incoming[key] : base[key];
        } else if (typeof base[key] === 'object' && base[key] && !Array.isArray(base[key])) {
          merged[key] = { ...(base[key] || {}), ...(incoming[key] || {}) };
        } else {
          merged[key] = incoming[key];
        }
      }
    });

    if (Array.isArray(incoming.productList)) merged.productList = incoming.productList;
    return merged;
  }

  function getSiteContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const legacyContact = JSON.parse(localStorage.getItem('needforgeContact') || 'null');
      const base = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));

      if (raw) {
        const parsed = JSON.parse(raw);
        const hasTemporaryDemoValues =
          parsed.heroTitle === 'Live title update' ||
          parsed.noticeTitle === 'Live notice' ||
          parsed.noticeBody === 'This update was saved and should appear immediately on the home page.' ||
          parsed.howItWorksTitle === 'How it works live' ||
          parsed.productsTitle === 'Live product list';

        if (hasTemporaryDemoValues) {
          localStorage.removeItem(STORAGE_KEY);
          return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
        }
      }

      const merged = raw ? mergeContent(base, JSON.parse(raw)) : base;
      if (legacyContact) merged.contact = { ...merged.contact, ...legacyContact };
      return merged;
    } catch (error) {
      return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    }
  }

  function saveSiteContent(content) {
    const nextContent = mergeContent(DEFAULT_SITE_CONTENT, content || {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
    if (nextContent.contact) {
      localStorage.setItem('needforgeContact', JSON.stringify(nextContent.contact));
    }
    window.dispatchEvent(new Event('needforge-site-content-updated'));
    return nextContent;
  }

  window.NeedForgeSiteContent = {
    STORAGE_KEY,
    DEFAULT_SITE_CONTENT,
    getSiteContent,
    saveSiteContent
  };
})();
