/**
 * prisma/seed.ts — örnek blog yazıları
 *
 *   set -a && . ./.env && set +a && npx tsx prisma/seed.ts
 *
 * veya
 *
 *   npx prisma db seed   (package.json'da tanımlıysa)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedPost {
  slug: string;
  locale: "tr" | "en";
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  coverAlt: string;
  daysAgo: number;
}

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

const POSTS: SeedPost[] = [
  {
    slug: "renk-psikolojisi-ve-arayuz-tasarimi",
    locale: "tr",
    title: "Renk Psikolojisi ve Arayüz Tasarımı",
    excerpt:
      "Renkler kullanıcıların karar verme süreçlerini şekillendirir. Doğru paleti seçmek, markanın mesajını güçlendirir.",
    content: `## Giriş

Renk psikolojisi, tasarımın görünmeyen katmanıdır. Kullanıcı bir butonun rengini fark etmeden önce bile, o renk onun güven duygusunu, aciliyet hissini ve marka çağrışımını şekillendirmiştir. Bu yazıda, modern arayüz tasarımında renklerin nasıl kullanılması gerektiğini üç temel eksende ele alacağız.

## Bilişsel Yük ve Renk Hiyerarşisi

Arayüzde çok fazla renk kullanmak, kullanıcının dikkatini dağıtır. Tipik bir SaaS panelinde üç ana renk ve bir vurgu tonu yeterlidir: birincil (eylem), ikincil (eylemsiz), nötr (zemin) ve vurgu (bildirim). Bu dörtlü yapı, kullanıcının her elemanda hangi aksiyonu alacağını hızla anlamasını sağlar.

## Erişilebilirlik ve Kontrast

WCAG 2.1 AA standardı, metin ve arka plan arasında minimum 4.5:1 kontrast oranı ister. Bu sadece yasal bir zorunluluk değil, aynı zamanda dış mekânda, parlak güneş ışığında ya da küçük fontlarla okuyan kullanıcılar için bir zorunluluktur. Hex kodlarını belirlerken her zaman bir kontrast kontrol aracı kullanın.

## Marka Tutarlılığı ve Kültürel Bağlam

Kırmızı Türkiye'de dikkat çekici bir vurgu iken bazı Asya pazarlarında şans ve bolluk anlamına gelir. Global bir ürün tasarlıyorsanız, her rengin hedef pazardaki çağrışımlarını araştırmanız gerekir. Aksi halde iyi niyetle seçtiğiniz bir palet, yanlış kültürel kodları tetikleyebilir.

## Test Etme ve İterasyon

Hiçbir palet ilk seferde mükemmel olmaz. A/B testleri ile farklı vurgu renklerinin dönüşüm oranlarını ölçün. Genel kural: tek bir değişkeni izole edin ve en az 1000 dönüşüm elde edene kadar testi sürdürün. Bu istatistiksel güven için minimum eşiktir.

## Sonuç

Renk psikolojisi bilim değil sanattır — ama ölçülebilir sanat. Doğru paleti bulmak, kullanıcı verisini dikkatlice okumayı, kültürel bağlamı anlamayı ve erişilebilirlik standartlarına saygı göstermeyi gerektirir.`,
    tags: ["renk psikolojisi", "ui tasarım", "erişilebilirlik"],
    metaTitle: "Renk Psikolojisi ve Arayüz Tasarımı Rehberi",
    metaDescription:
      "Renkler kullanıcıları yönlendirir. Doğru palet seçimi için 5 temel prensibi bu rehberde öğrenin.",
    coverAlt: "Renk paleti ve insan beyni temalı kapak görseli",
    daysAgo: 1,
  },
  {
    slug: "color-psychology-in-interface-design",
    locale: "en",
    title: "Color Psychology in Interface Design",
    excerpt:
      "Colors shape user decisions before they notice them. The right palette strengthens your brand message.",
    content: `## Introduction

Color psychology is the invisible layer of design. Before a user notices a button color, that color has already shaped their trust, urgency, and brand associations. This article explores three core axes of how colors should be used in modern interface design.

## Cognitive Load and Color Hierarchy

Using too many colors in an interface fragments user attention. A typical SaaS dashboard needs three primary colors and one accent: primary (action), secondary (inactive), neutral (surface), and accent (notification). This quartet lets users quickly understand what action each element will trigger.

## Accessibility and Contrast

WCAG 2.1 AA requires a minimum 4.5:1 contrast ratio between text and background. This is not just a legal obligation; it is a practical necessity for users reading outdoors, in bright sunlight, or at small font sizes. Always use a contrast checker when selecting hex codes.

## Brand Consistency and Cultural Context

Red signals urgency in Turkey but luck and prosperity in some Asian markets. If you are designing for a global product, you must research the cultural associations of each color in your target market. Otherwise, a palette chosen with good intent may trigger the wrong cultural codes.

## Testing and Iteration

No palette is perfect on the first try. Use A/B tests to measure conversion rates for different accent colors. A general rule: isolate a single variable and run the test until you have at least 1000 conversions. This is the minimum threshold for statistical confidence.

## Conclusion

Color psychology is not a science but an art — a measurable art. Finding the right palette requires reading user data carefully, understanding cultural context, and respecting accessibility standards.`,
    tags: ["color psychology", "ui design", "accessibility"],
    metaTitle: "Color Psychology in Interface Design — A Practical Guide",
    metaDescription:
      "Colors shape users. Learn 5 essential principles for picking the right palette in interface design.",
    coverAlt: "Color palette and human brain cover image",
    daysAgo: 1,
  },
  {
    slug: "neumorfizm-modern-web-arayuzlerinde-yumusak-golge-dili",
    locale: "tr",
    title: "Neumorfizm: Modern Web Arayüzlerinde Yumuşak Gölge Dili",
    excerpt:
      "Düz renklerden derinlikli yüzeylere geçiş. Neumorfizmin temelleri, avantajları ve sınırları.",
    content: `## Neumorfizm Nedir?

Neumorfizm (New + Skeuomorphism), 2020'de popülerleşen ve içeriğin arka planla aynı renkte, sadece ışık ve gölgeyle şekillendirildiği bir tasarım dilidir. Camgöbeği arka plan üzerinde hafifçe yükselen butonlar, gömülü input alanları — tüm bu efektler aynı dilin farklı ifadeleridir.

## Skeuomorfizmden Farkı

Klasik skeuomorfizm gerçek dünya objelerini taklit eder (ahşap, deri, kâğıt). Neumorfizm ise dijitali taklit etmez — aksine, dijitali minimalize eder. "Düz tasarım"ın (flat design) aşırı sadeliğine bir tepki olarak doğmuştur; derinliği geri getirir ama foto-realistik detaylara boğulmaz.

## Avantajları

Yumuşak gölgeler, kullanıcıya hangi öğelerin interaktif olduğunu sezdirir. Tıklama sonrası gölge yön değiştirir — bu, "pressed" durumunu fiziksel dünyadaki bir düğmeye basmak kadar anlaşılır kılar. Ayrıca görsel ağırlığı azaltır: binlerce piksel şeffaflık ve degrade yerine, sadece iki katmanlı bir gölge.

## Sınırlamaları

En büyük dezavantaj **erişilebilirlik**. Gölgeler, renklerden daha az kontrast oluşturur; WCAG kılavuzuna göre "görsel sınır" (boundary) olabilmek için minimum 3:1 kontrast gerekir. Koyu temalarda ise gölgeler neredeyse görünmez olur. Bu yüzden neumorfizm, **tek başına değil**, flat tasarımla karışık kullanılmalıdır.

## Chromai'de Neumorfizm

Chromai, tasarım sistemini iki katmanlı neumorfik gölgeler üzerine kurar. Ancak her interaktif öğe aynı zamanda net bir renk ipucu taşır: birincil eylemler mor-pembe gradyan, vurgular turuncu-rose, nötr yüzeyler yumuşak gri. Bu hibrit yaklaşım, gölgenin estetiğini erişilebilirlik ile dengeler.

## Sonuç

Neumorfizm, bir trend olarak geldi ve yerleşti. Doğru kullanıldığında sıcak, sakin ve modern bir arayüz sunar — yanlış kullanıldığında ise "neredeyse görünmez" öğelerle kullanıcıyı yorar. Altın kural: gölge güzeldir, ama sınır için renge her zaman bir görev düşer.`,
    tags: ["neumorfizm", "tasarım sistemi", "ui"],
    metaTitle: "Neumorfizm Rehberi: Yumuşak Gölgelerle Modern Arayüzler",
    metaDescription:
      "Neumorfizm nedir, nerede işe yarar, nerede sınırlanır? Erişilebilirlik ile estetik dengesi.",
    coverAlt: "Yumuşak gölgeler ve camgöbeği arka plan üzerinde yükselen UI elementleri",
    daysAgo: 3,
  },
  {
    slug: "neumorphism-modern-soft-shadow-ui",
    locale: "en",
    title: "Neumorphism: The Soft-Shadow Language of Modern Web UIs",
    excerpt:
      "From flat colors to deep surfaces. The basics, strengths, and limits of neumorphism.",
    content: `## What Is Neumorphism?

Neumorphism (New + Skeuomorphism) is a design language that took off in 2020. Surfaces share the background color and are shaped only by light and shadow. Buttons that lift slightly from the surface, inputs that look pressed in — these are all the same dialect.

## How It Differs from Skeuomorphism

Classic skeuomorphism imitates real-world objects (wood, leather, paper). Neumorphism doesn't imitate — it minimalizes. It emerged as a reaction to flat design's austerity, bringing depth back without the photo-realistic noise.

## Advantages

Soft shadows let users feel which elements are interactive. When pressed, the shadow flips — turning the press into something as legible as pushing a physical button. It also reduces visual weight: instead of a thousand pixels of transparency and gradient, just two layers of shadow.

## Limits

The biggest drawback is **accessibility**. Shadows produce less contrast than color, and WCAG requires a 3:1 contrast for a non-text element to qualify as a "boundary." In dark themes, shadows nearly vanish. For this reason, neumorphism should be used **not alone**, but mixed with flat signals.

## Neumorphism in Chromai

Chromai's design system is built on two-layer neumorphic shadows. Yet every interactive element also carries a clear color cue: primary actions in a purple-pink gradient, accents in orange-rose, neutral surfaces in soft gray. This hybrid balances the beauty of shadow with the need for accessible contrast.

## Conclusion

Neumorphism came, stayed, and earned its place. Used well, it gives an interface that feels warm, calm, and modern — used poorly, it produces near-invisible elements that strain the user. The golden rule: shadows are beautiful, but color always has a job to do at the boundary.`,
    tags: ["neumorphism", "design system", "ui"],
    metaTitle: "Neumorphism Guide: Soft Shadows in Modern Interfaces",
    metaDescription:
      "What neumorphism is, where it works, and where it stops. The balance between aesthetics and accessibility.",
    coverAlt:
      "Soft shadows and cyan background with floating UI elements",
    daysAgo: 3,
  },
  {
    slug: "yapay-zeka-ile-renk-paleti-nasil-olusturulur",
    locale: "tr",
    title: "Yapay Zekâ ile Renk Paleti Nasıl Oluşturulur?",
    excerpt:
      "Birkaç kelimeyle atmosferi tarif edin, AI size özel paleti üretsin. İşte perde arkası.",
    content: `## Giriş

"Yapay zekâ destekli tasarım" denince akla gelen ilk soru: AI gerçekten renk seçebilir mi, yoksa rastgele üretip aralarından "iyi" olanları mı bırakır? Cevap: ikisinin arası, ama daha çok ikincisi. Modern modeller, milyonlarca tasarım örneği üzerinde eğitildiği için hangi kombinasyonların "uyumlu" olduğunu istatistiksel olarak bilir. Bu bilgi, mühendislik değil sezgi gibidir — ama çoğu zaman doğru sonuç verir.

## Prompt Mühendisliği

AI'ın ürettiği paletin kalitesi, verdiğiniz prompt'a doğrudan bağlıdır. "Güzel palet" gibi genel ifadeler belirsiz sonuçlar üretir. Bunun yerine, atmosferi tarif edin: *"sahile bakan küçük bir kafede, akşam güneşinin son ışıkları"* ya da *"minimalist bir fintech panosu, kullanıcıya güven vermeli"*. AI, bu tür bağlamsal ifadeleri işleyerek renklerin ruh halini yakalar.

## Çıktı Formatı

Güvenilir bir AI renk aracının üç özelliği olmalı: önce **belirli bir format** (örneğin JSON, 2 renkli palet) istemeli, sonra **HEX kodlarını doğrulamalı**, son olarak da **açıklama** üretmeli. Açıklama olmadan, kullanıcı neden bu renkleri aldığını bilemez; açıklama ile birlikte, palet bir tasarım kararına dönüşür.

## Sınırlamalar

AI renk seçerken kültürel bağlamı her zaman anlamaz. Kırmızı bazı kültürlerde kutlama, bazılarında tehlike; mavi bazılarında hüzün, bazılarında güven. Global bir ürün tasarlıyorsanız, AI'ın önerisini son aşamada bir insan gözünden geçirmelisiniz.

## Chromai'nin Yaklaşımı

Chromai, bu sınırlamaları bilerek üç katmanlı bir sistem kullanır: önce AI birden fazla palet önerir, sonra her palet HEX formatında normalize edilir, son olarak da her palete kullanım önerisi ve tag eklenir. Bu yapı, hem hızı hem kontrolü korur.

## Sonuç

Yapay zekâ, renk seçiminde mühendis değil yardımcıdır. Birkaç saniyede düşünülmemiş kombinasyonları önerebilir, ama son sözü her zaman tasarımcı söyler. Bu iş birliği, en iyi paletleri üretir.`,
    tags: ["yapay zekâ", "renk paleti", "tasarım"],
    metaTitle:
      "Yapay Zekâ ile Renk Paleti Üretimi: Perde Arkası ve İpuçları",
    metaDescription:
      "AI ile renk paleti nasıl üretilir, prompt mühendisliği ipuçları ve sınırlamalar.",
    coverAlt:
      "Yapay zekânın ürettiği renk paleti örnekleri — modern bir tasarım stüdyosunda",
    daysAgo: 5,
  },
  {
    slug: "how-ai-generates-color-palettes",
    locale: "en",
    title: "How AI Generates Color Palettes (And Why It Works)",
    excerpt:
      "Describe the mood in a few words, and AI produces a custom palette. Here's what happens behind the scenes.",
    content: `## Introduction

When people hear "AI-assisted design," the first question is: can AI actually pick colors, or does it just generate random ones and keep the "good" results? The answer is somewhere in between, but closer to the second. Modern models are trained on millions of design examples, so they statistically know which combinations feel "harmonious." That knowledge is more like intuition than engineering — but it works most of the time.

## Prompt Engineering

The quality of an AI-generated palette depends directly on the prompt you give it. Vague phrases like "a nice palette" produce vague results. Instead, describe the atmosphere: *"a small seaside café in the last light of an evening sun"* or *"a minimal fintech dashboard, conveying trust."* AI processes these contextual cues and infers the mood of the colors.

## Output Format

A reliable AI color tool should do three things: first, demand a **specific format** (say, JSON, 2-color palette); then **validate HEX codes**; and finally, generate a **short explanation**. Without an explanation, users don't know why they got those colors; with one, a palette becomes a design decision.

## Limitations

AI doesn't always understand cultural context. Red signals celebration in some cultures and danger in others; blue means melancholy in some and trust in others. If you design for a global audience, you need a human to review the AI's final suggestions.

## Chromai's Approach

Chromai uses a three-layer system that respects these limits: first, the AI proposes multiple palettes; then each palette is normalized to a strict HEX format; finally, each gets a usage note and a few tags. This structure keeps both the speed and the control.

## Conclusion

AI is an assistant, not an engineer, in color selection. It can propose combinations you wouldn't have considered in seconds, but the last word is always the designer's. That collaboration produces the best palettes.`,
    tags: ["ai", "color palette", "design"],
    metaTitle: "How AI Generates Color Palettes: Behind the Scenes",
    metaDescription:
      "How AI color palette generation works, prompt engineering tips, and its limits.",
    coverAlt: "AI-generated color palette samples in a modern design studio",
    daysAgo: 5,
  },
];

async function main() {
  console.log(`Seeding ${POSTS.length} posts…`);

  for (const p of POSTS) {
    const publishedAt = new Date(NOW - p.daysAgo * DAY);
    const readMinutes = Math.max(
      1,
      Math.round(p.content.trim().split(/\s+/).length / 200),
    );

    await prisma.blogPost.upsert({
      where: { slug_locale: { slug: p.slug, locale: p.locale } },
      create: {
        slug: p.slug,
        locale: p.locale,
        status: "PUBLISHED",
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        tags: JSON.stringify(p.tags),
        coverUrl: null,
        coverAlt: p.coverAlt,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        readMinutes,
        publishedAt,
      },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        tags: JSON.stringify(p.tags),
        coverAlt: p.coverAlt,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        readMinutes,
        publishedAt,
      },
    });

    console.log(`  ✓ ${p.locale}/${p.slug}`);
  }

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
