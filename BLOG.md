# Chromai Blog + n8n Daily Automation

Bu doküman projedeki blog altyapısını ve onu besleyen n8n iş akışını
açıklar.

## Mimari

```
n8n (self-hosted)
   │  her gün 09:00
   ▼
[OpenRouter → TR+EN makale]
   │
   ▼
[Telegram'a önizleme + Onay/Red butonları]
   │
   ▼  kullanıcı tıklar
   │
   ├─ onay ──► POST /api/blog/webhook ──► Next.js (Prisma+SQLite)
   │                                            │
   │                                            └─► /blog/[slug] sayfası yayında
   └─ red  ──► mesaj "❌ yazı reddedildi" olarak düzenlenir, bir şey yapılmaz
```

## Site Tarafı (Next.js)

### Kurulu Bileşenler

| Dosya | Ne yapıyor |
| --- | --- |
| `prisma/schema.prisma` | `BlogPost` modeli — slug + locale unique key, status (DRAFT/PUBLISHED), markdown içerik, SEO alanları |
| `lib/db.ts` | Prisma client singleton (dev hot-reload leak korumalı) |
| `lib/blog.ts` | `listPublishedPosts`, `getPublishedPost`, `listPublishedSlugs`, `upsertPostFromWebhook` |
| `lib/blog-types.ts` | `BlogPostDTO`, `WebhookPayload` type'ları |
| `app/api/blog/webhook/route.ts` | **POST** `/api/blog/webhook` — secret doğrulamalı, TR+EN post'ları upsert eder |
| `app/api/blog/posts/route.ts` | **GET** `/api/blog/posts?locale=tr&limit=20` — public liste |
| `app/api/blog/posts/[slug]/route.ts` | **GET** `/api/blog/posts/[slug]?locale=tr` — tek post |
| `app/blog/page.tsx` | `/blog` listeleme sayfası (5 dk ISR) |
| `app/blog/[slug]/page.tsx` | `/blog/[slug]` detay sayfası (SSG, markdown render, JSON-LD, related posts) |
| `components/blog/blog-card.tsx` | Liste kartı (kapak + tag + excerpt + okuma süresi) |
| `components/blog/blog-content.tsx` | `react-markdown` + `remark-gfm` + `rehype-slug` ile güvenli render |
| `app/sitemap.ts` | Tüm yayınlanmış post'lar sitemap'e eklenir |
| `components/chromai/site-header.tsx`, `site-footer.tsx` | "Blog" linki eklendi |
| `lib/i18n/messages.ts` | `nav.blog` + `footer.linkBlog` çevirileri (tr/en/de) |

### Webhook Payload

`POST /api/blog/webhook` — aşağıdaki yapıyı bekler:

```json
{
  "secret": "2ef0e309c567f4...e49fb",
  "posts": [
    {
      "slug": "renk-psikolojisi-ve-arayuz-tasarimi",
      "locale": "tr",
      "title": "Renk Psikolojisi ve Arayüz Tasarımı",
      "excerpt": "Kısa özet, 200 karakteri geçmez.",
      "content": "# ...\n\n## Alt başlık 1\n\n600+ kelime markdown içerik.\n\n## Alt başlık 2\n...",
      "tags": ["renk", "tasarım", "ux"],
      "metaTitle": "SEO başlığı (max 60)",
      "metaDescription": "SEO açıklaması (max 160)",
      "coverUrl": "https://...",
      "coverAlt": "Kapak görseli alt metni",
      "status": "PUBLISHED",
      "publishedAt": "2026-06-18T09:00:00.000Z"
    },
    { "slug": "renk-psikolojisi-ve-arayuz-tasarimi", "locale": "en", "...": "..." }
  ]
}
```

- `slug + locale` çifti unique'dir → aynı slug farklı dillerde olabilir.
- Aynı slug tekrar gelirse **upsert** edilir (yayın güncellenir).
- Secret `process.env.BLOG_WEBHOOK_SECRET` ile constant-time karşılaştırılır.
- `status` her zaman `PUBLISHED` olarak yazılır (workflow sadece onaylanmış içerik gönderir).

### Kurulum

```bash
# 1. Bağımlılıklar
npm install
# veya: bun install

# 2. .env (örnek .env.example ile aynı anahtarlar, secret otomatik üretildi)
cp .env.example .env
# → BLOG_WEBHOOK_SECRET zaten üretilmiş; değiştirmek istersen:
openssl rand -hex 32

# 3. Veritabanı
npx prisma generate
npx prisma db push   # prisma/dev.db oluşur

# 4. Geliştirme sunucusu
npm run dev
# → http://localhost:3000/blog
```

### Yeni bir blog yazısını manuel tetikleme

```bash
curl -X POST http://localhost:3000/api/blog/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "BURAYA_BLOG_WEBHOOK_SECRET",
    "posts": [{
      "slug": "test-yazi",
      "locale": "tr",
      "title": "Test Yazısı",
      "excerpt": "Kısa açıklama.",
      "content": "## Giriş\n\nBu bir test yazısıdır. 600 kelimeden fazla olması gerekir ama manual test için kısa tutuyoruz.\n\n## Bölüm 1\n\nİçerik.\n\n## Bölüm 2\n\nİçerik.\n\n## Bölüm 3\n\nİçerik.\n\n## Sonuç\n\nİçerik.",
      "tags": ["test"],
      "status": "PUBLISHED"
    }]
  }'
```

## n8n İş Akışı (Workflow)

**Workflow adı:** `Chromai — Daily AI Blog Post Generator`
**Workflow ID:** `cjlGJqQACIzFmnFi`
**URL:** https://n8n.musayazlik.com/workflow/cjlGJqQACIzFmnFi

### Akış

```
SCHEDULE (her gün 09:00) ──►
                            │
                            ▼
              [OpenRouter: TR+EN makale üret]
                            │
                            ▼
              [Code: parse + validate + static data'ya yaz]
                            │
                            ▼
              [Telegram: önizleme + butonlar] ◄──┐
                                                  │
TELEGRAM CALLBACK (buton tıklaması) ──►           │
                            │                     │
                            ▼                     │
              [Code: callback parse + state çek]   │
                            │                     │
                            ▼                     │
              [IF: geçerli mi? + bekleyen post var mı?]
                            │                     │
                            ▼                     │
              [IF: onay mı red mi?]                │
                ├─ onay ─► [POST webhook] ─► [Edit: Yayında] ─┘
                └─ red  ─► [Edit: Reddedildi] ──────────────┘
```

### Kurulum Adımları

1. **Telegram bot'u oluştur (henüz yoksa)**
   - [@BotFather](https://t.me/BotFather) ile sohbet başlat
   - `/newbot` → bot adı + username belirle
   - BotFather sana bir **token** verecek → sakla
2. **Chat ID'ni öğren**
   - Bot'a kendi kişisel sohbetinden `/start` gönder
   - [@userinfobot](https://t.me/userinfobot)'a `/start` at → sana **chat ID**'ni söyleyecek
   - (Grup için grup ID'si; kanal için kanal ID'si)
3. **n8n'de kimlik bilgileri**
   - **Credentials → New**
     - **Telegram** (tip: `telegramApi`) → "Telegram account" adıyla, BotFather'dan aldığın token'ı yapıştır → kaydet
     - **Header Auth** (tip: `httpHeaderAuth`) → "OpenRouter Bearer" adıyla, Name=`Authorization`, Value=`Bearer sk-or-v1-...` şeklinde doldur → kaydet
   - `Telegram account` zaten var. `OpenRouter account` ise LangChain node'ları için; biz generic HTTP Request kullandığımızdan onu değil, **HTTP Header Auth** tipinde yeni bir credential yaratmamız gerek.
4. **Workflow ayarları**
   - Workflow'u aç → **Generate Post (OpenRouter)** node'una tıkla
     - "Authentication" → "Generic Credential Type" → "HTTP Bearer Auth"
     - Sağdaki "Credential to connect with" → yeni oluşturduğun **OpenRouter Bearer**'ı seç
   - **Send for Approval** node'u → `chatId` alanına kendi chat ID'ni yaz (örn. `123456789`)
   - **Publish to Site Webhook** node'u → `url` alanını sitenin gerçek adresine çevir (örn. `https://staging.chromai.app/api/blog/webhook`)
5. **Aktive et** — sağ üstteki toggle'ı aç. Artık her gün 09:00'te bir yazı üretilecek.

### Mevcut Secret

```
BLOG_WEBHOOK_SECRET=2ef0e309c567f43574841023ac24720ace3562c612fc7695ac6d705e365e49fb
```

Bu değer:
- Sitenin `.env` dosyasında (`BLOG_WEBHOOK_SECRET`)
- n8n'de **Publish to Site Webhook** node'unun `jsonBody` alanında (güncellendi)

İkisi aynı olmalı. Değiştirmek istersen:
1. Yeni secret üret: `openssl rand -hex 32`
2. Sitenin `.env`'sine yaz
3. n8n'de **Publish to Site Webhook** node'unu aç → "jsonBody" alanını güncelle
4. Sitenin Next.js sunucusunu yeniden başlat (env değişikliği için)

### Manuel Test

Workflow'u **manuel çalıştırmak** için (henüz 09:00'i beklemeden):
1. n8n'de workflow'u aç
2. Sol panelde "Daily Schedule (09:00)" tetikleyicisine tıkla
3. "Execute Workflow" düğmesine bas
4. Telegram'dan bir önizleme mesajı gelecek → Onayla/Reddet

### Statik Veri (Pending Posts)

Workflow, Telegram yolunda bekleyen post'ları workflow'un **static data**'sında
saklar (`$getWorkflowStaticData('global')`). Bu sayede:
- Birden fazla gün üst üste birikmez (her cron yeni bir slug üretir)
- 7 günden eski pending post'lar otomatik temizlenir
- n8n yeniden başladığında kaybolur — bu yüzden "Edit: Stale" dalı kullanıcıya
  bilgilendirme mesajı gösterir ("Bu yazı zaman aşımına uğradı")

### Hata Durumları

| Durum | Davranış |
| --- | --- |
| AI 600 kelimeden az döndürürse | Workflow durur (Code node `throw new Error`) |
| AI 4'ten az H2 döndürürse | Workflow durur |
| AI JSON döndürmezse | Workflow durur (parse hatası) |
| Slug boş/çok uzunsa | Workflow durur |
| n8n yeniden başladı, buton tıklandı | "Edit: Stale" — yazı kayıp, yeniden üretilmeli |
| Site webhook 401 döndürürse | "Edit: Publish Failed" — secret uyuşmuyor |
| Site webhook 5xx döndürürse | "Edit: Publish Failed" — site çökmüş |
| Bilinmeyen callback | "Skip Unknown Callback" — ack'le geç |

## Veri Modeli

```
BlogPost
├─ id          cuid
├─ slug        string         ← + locale ile unique
├─ locale      "tr" | "en" | "de"
├─ status      "DRAFT" | "PUBLISHED"
├─ title       string
├─ excerpt     string (≤200 char önerilir)
├─ content     string (markdown)
├─ tags        JSON string  → parse edilir
├─ coverUrl    string | null
├─ coverAlt    string | null
├─ metaTitle   string | null
├─ metaDescription string | null (≤160 char)
├─ readMinutes int  (otomatik hesaplanır)
├─ createdAt   DateTime
├─ updatedAt   DateTime (auto)
└─ publishedAt DateTime | null
```

## SEO

- `/blog` ve `/blog/[slug]` sayfaları `generateMetadata` ile OG + Twitter card üretir
- Detay sayfada `<script type="application/ld+json">` ile Article şeması
- `app/sitemap.ts` tüm yayınlanmış post'ları her dil için ekler
- Kapak görseli yoksa `picsum.photos/seed/{slug}/1200/630` placeholder kullanılır

## İçerik Üretim Prompt'u

Workflow, OpenRouter'a şu sistem + kullanıcı prompt'unu gönderir (özet):

```
SYSTEM: You are a senior content writer for a design/AI/web dev blog.
        ALWAYS reply with a single valid JSON object — no markdown, no prose.

USER:   Bugünün blog yazısını üret. Tarih: YYYY-MM-DD.
        Konu: tasarım, AI, frontend, UX, renk teorisi, üretkenlik veya web
              performansı — güncel ve özgün.
        Aynı makaleyi iki dilde yaz (TR + EN).
        Her sürüm: ≥600 kelime, ≥4 H2 alt başlık.
        Markdown.
        Slug: ASCII kebab-case, max 60 char.
        excerpt: max 200 char.
        metaDescription: max 160 char.
        coverImageAlt: kısa, erişilebilir.
```

JSON çıktı `response_format: { type: "json_object" }` ile zorlanır;
Code node ek olarak parse + doğrulama yapar (karakter sayısı, H2 sayısı).

## Maliyet

- OpenRouter ücretsiz model (`google/gemini-2.0-flash-exp:free`) → $0/gün
- OpenRouter ücretli model (`openai/gpt-4o-mini`) → ~$0.001-0.005/yazı
- n8n self-hosted → $0
- Next.js site → $0 (mevcut altyapı)
- Toplam günlük: $0 ile $0.01 arası

## Sık Karşılaşılan Sorunlar

### n8n'de "Authorization header is required" hatası
HTTP Request node'unu "Authentication" → "Generic Credential Type" → "HTTP Bearer
Auth" yap ve yeni oluşturduğun credential'ı seç.

### Telegram'da butonlara tıklayınca bir şey olmuyor
n8n instance'ı public HTTPS üzerinden erişilebilir olmalı (Telegram callback için).
Localhost ise ngrok veya Cloudflare Tunnel kullan.

### Sitede yeni yazı görünmüyor
1. `/api/blog/posts?locale=tr` adresinde var mı kontrol et
2. `publishedAt` ayarlı mı, `status = PUBLISHED` mi kontrol et
3. `next build && next start` ile production'da test ediyorsan, ISR cache'i
   dolmuş olmalı (5 dakika) veya `revalidatePath('/blog')` çağrılmalı

### AI aynı konuyu tekrar tekrar üretiyor
OpenRouter'da `temperature: 0.85` ayarlı; daha çeşitli istersen
`Generate Post` node'undaki `temperature` değerini 1.0'a çek ve prompt'a
"her gün benzersiz bir konu seç" koşulunu ekle.
