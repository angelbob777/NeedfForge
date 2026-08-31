(function () {
  const STORAGE_KEY = "needforgeLevelPricing";
  const DEFAULT_LEVEL_PRICING = [
    { level: 1, fee: 100, upgrade: 250 },
    { level: 2, fee: 250, upgrade: 500 },
    { level: 3, fee: 500, upgrade: 1000 },
    { level: 4, fee: 1000, upgrade: 2500 },
    { level: 5, fee: 2500, upgrade: 5000 },
    { level: 6, fee: 5000, upgrade: 11000 },
    { level: 7, fee: 11000, upgrade: 25000 },
    { level: 8, fee: 25000, upgrade: 50000 },
    { level: 9, fee: 50000, upgrade: 100000 },
    { level: 10, fee: 100000, upgrade: null }
  ];

  function sanitizePricing(rawPricing) {
    const defaults = DEFAULT_LEVEL_PRICING.map(level => ({
      level: level.level,
      fee: Number(level.fee) || 0,
      upgrade: level.upgrade == null ? null : Number(level.upgrade) || 0
    }));

    const parsed = Array.isArray(rawPricing) ? rawPricing : defaults;
    return defaults.map((defaultLevel, index) => {
      const saved = parsed[index] || {};
      return {
        level: defaultLevel.level,
        fee: Number(saved.fee) || defaultLevel.fee,
        upgrade: saved.upgrade == null ? defaultLevel.upgrade : Number(saved.upgrade) || 0
      };
    });
  }

  function getLevelPricing() {
    try {
      const savedPricing = localStorage.getItem(STORAGE_KEY);
      if (!savedPricing) {
        return DEFAULT_LEVEL_PRICING.map(level => ({ ...level }));
      }
      return sanitizePricing(JSON.parse(savedPricing));
    } catch (error) {
      return DEFAULT_LEVEL_PRICING.map(level => ({ ...level }));
    }
  }

  function saveLevelPricing(levelPricing) {
    const sanitized = sanitizePricing(levelPricing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event("needforge-pricing-updated"));
    return sanitized;
  }

  function money(value) {
    if (value == null || value === "") return "—";
    return `R${Number(value).toLocaleString("en-ZA")}`;
  }

  window.NeedForgePricing = {
    STORAGE_KEY,
    DEFAULT_LEVEL_PRICING,
    getLevelPricing,
    saveLevelPricing,
    money
  };
})();
