---
"@gracefullight/saju": minor
---

Introduce Label objects across all analysis modules

- TwelveStages, TenGods, Strength, YongShen, SolarTerms, Relations, and Sinsals modules now return Label objects containing hanja (Chinese characters), korean (Korean text), and meaning (description)
- Replace plain string return values with structured Label objects for better i18n and detailed display support
- Improve example app UI to display hanja + korean + meaning across all analysis sections
