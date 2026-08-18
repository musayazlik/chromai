/**
 * Chromai — Daily AI Blog Post Generator
 * ───────────────────────────────────────
 *  • Her gün 09:00'te bir konu seçer, araştırır ve TR + EN içerik üretir.
 *  • İçeriği Telegram'a gönderir ve onay/red butonları sunar.
 *  • Onaylanırsa site webhook'una POST eder; reddedilirse yok sayar.
 *
 * Bu dosya n8n Workflow SDK formatındadır. Kurulum için:
 *  1) n8n'de Settings → Variables'a `CHROMAI_WEBHOOK_SECRET` ekleyin.
 *     (Bu değer sitenizdeki BLOG_WEBHOOK_SECRET ile aynı olmalı.)
 *  2) n8n'de Credentials altına "OpenRouter API Key" (HTTP Bearer) oluşturun.
 *  3) n8n'de Credentials altına "Telegram Blog Bot" oluşturun.
 *  4) Aşağıdaki PLACEHOLDER değerleri gerçek değerlerle değiştirin:
 *       - TELEGRAM_CHAT_ID   : Bot'un mesaj göndereceği sohbet ID'si
 *       - BLOG_WEBHOOK_URL   : Sitenizin /api/blog/webhook tam URL'i
 *       - BLOG_WEBHOOK_SECRET: Sitenizdeki BLOG_WEBHOOK_SECRET
 *  5) `npx n8n-mcp validate_workflow` ile doğrulayıp `create_workflow_from_code`
 *     ile yükleyin. Alternatif olarak bu kodu n8n → Workflows → New →
 *     "Code workflow" bölümüne yapıştırabilirsiniz.
 */

import {
  workflow,
  trigger,
  node,
  ifElse,
  newCredential,
  expr,
} from "@n8n/workflow-sdk";

// ────────────────────────────────────────────────────────────────────────
// PLACEHOLDERS — kurulumdan önce değiştirin
// ────────────────────────────────────────────────────────────────────────
const TELEGRAM_CHAT_ID = "CHAT_ID_BURAYA"; // @userinfobot'tan aldığınız sayı
const BLOG_WEBHOOK_URL = "https://chromai.app/api/blog/webhook";
const BLOG_WEBHOOK_SECRET = "WEBHOOK_SECRET_BURAYA"; // openssl rand -hex 32
const OPENROUTER_MODEL = "openai/gpt-4o-mini"; // ücretsiz model isterseniz:
// const OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";

// ════════════════════════════════════════════════════════════════════════
//  TRIGGERS
// ════════════════════════════════════════════════════════════════════════

/** Her gün saat 09:00'te tetiklenir. */
const dailyTrigger = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: {
    name: "Daily Schedule (09:00)",
    parameters: {
      rule: {
        interval: [
          {
            field: "cronExpression",
            // Her gün 09:00 (Europe/Istanbul ile aynı cron)
            expression: "0 0 9 * * *",
          },
        ],
      },
    },
  },
});

/** Telegram botuna gelen callback (buton tıklaması) ile tetiklenir. */
const telegramTrigger = trigger({
  type: "n8n-nodes-base.telegramTrigger",
  version: 1.3,
  config: {
    name: "Telegram Approval Callback",
    parameters: {
      updates: ["callback_query"],
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

// ════════════════════════════════════════════════════════════════════════
//  DAILY PATH — Generate → Save → Send for approval
// ════════════════════════════════════════════════════════════════════════

/** OpenRouter'a tek seferde TR+EN makale ürettirir. */
const generatePost = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Generate Post (OpenRouter)",
    parameters: {
      method: "POST",
      url: "https://openrouter.ai/api/v1/chat/completions",
      authentication: "genericCredentialType",
      genericAuthType: "httpBearerAuth",
      sendHeaders: true,
      specifyHeaders: "keypair",
      headerParameters: {
        parameters: [
          { name: "Content-Type", value: "application/json" },
          { name: "HTTP-Referer", value: "https://chromai.app" },
          { name: "X-Title", value: "Chromai Daily Blog" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: expr(`{
        "model": "${OPENROUTER_MODEL}",
        "temperature": 0.85,
        "max_tokens": 4500,
        "response_format": { "type": "json_object" },
        "messages": [
          {
            "role": "system",
            "content": "You are a senior content writer for a design / AI / web development blog. You ALWAYS reply with a single valid JSON object — no markdown, no prose, no code fences, ever."
          },
          {
            "role": "user",
            "content": "Bugünün blog yazısını üret.\\n\\nBugünün tarihi: {{ $now.toFormat('yyyy-MM-dd') }}\\n\\nKurallar:\\n- Konu: tasarım, yapay zekâ, frontend, UX, renk teorisi, üretkenlik ya da web performansı alanlarından, güncel ve özgün bir konu seç. Tekrarlayan başlıklar üretme.\\n- Aynı makaleyi iki dilde yaz: Türkçe (tr) ve İngilizce (en).\\n- Her iki sürüm de EN AZ 600 KELİME ve EN AZ 4 ALT BAŞLIK (## ile) içermeli.\\n- Markdown formatında yaz. Kod bloğu ve liste kullanabilirsin.\\n- Türkçe tonu: samimi, profesyonel, Türkiye pazarına uygun.\\n- İngilizce tonu: doğal, global, profesyonel.\\n- Slug: yalnızca ASCII, kebab-case, en fazla 60 karakter.\\n- Tags: 3-5 adet, her biri tek kelime ya da kısa öbek.\\n- excerpt: 1-2 cümle, 200 karakteri GEÇMESİN.\\n- metaDescription: SEO uyumlu, 160 karakteri GEÇMESİN.\\n- coverImageAlt: kapak görseli için kısa, erişilebilir bir açıklama.\\n\\nŞu JSON formatında döndür:\\n{\\n  \\\"slug\\\": \\\"...\\\",\\n  \\\"tags\\\": [\\\"t1\\\",\\\"t2\\\",\\\"t3\\\"],\\n  \\\"tr\\\": {\\\"title\\\":\\\"...\\\",\\\"excerpt\\\":\\\"...\\\",\\\"content\\\":\\\"... 600+ kelime markdown ...\\\",\\\"metaTitle\\\":\\\"...\\\",\\\"metaDescription\\\":\\\"...\\\",\\\"coverImageAlt\\\":\\\"...\\\"},\\n  \\\"en\\\": {\\\"title\\\":\\\"...\\\",\\\"excerpt\\\":\\\"...\\\",\\\"content\\\":\\\"... 600+ word markdown ...\\\",\\\"metaTitle\\\":\\\"...\\\",\\\"metaDescription\\\":\\\"...\\\",\\\"coverImageAlt\\\":\\\"...\\\"}\\n}"
          }
        ]
      }`),
      options: {
        timeout: 90000,
      },
    },
  },
  credentials: {
    httpBearerAuth: newCredential("OpenRouter API Key"),
  },
});

/**
 * OpenRouter'ın cevabını temizler, JSON'a çevirir, hem slug hem iki dilde
 * post verisini hazırlar ve statik veriye yazar (Telegram yolu buradan
 * okuyacak). Tek bir item döndürür.
 */
const parseAiResponse = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Parse AI Response",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: `
const raw = $input.first().json?.choices?.[0]?.message?.content;
if (!raw) {
  throw new Error('OpenRouter boş cevap döndü.');
}

const cleaned = String(raw).replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, '').trim();
let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch (err) {
  throw new Error('AI cevabı JSON olarak ayrıştırılamadı: ' + err.message);
}

for (const locale of ['tr', 'en']) {
  const p = parsed[locale];
  if (!p || !p.title || !p.excerpt || !p.content) {
    throw new Error('AI cevabında ' + locale + ' alanları eksik.');
  }
  if (typeof p.content !== 'string' || p.content.length < 1800) {
    throw new Error(locale + ' içeriği 600+ kelime değil (' + p.content.length + ' karakter).');
  }
  const h2Count = (p.content.match(/^## /gm) || []).length;
  if (h2Count < 4) {
    throw new Error(locale + ' içeriğinde en az 4 H2 alt başlık olmalı (bulunan: ' + h2Count + ').');
  }
}

const slug = String(parsed.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
if (!slug || slug.length > 60) {
  throw new Error('Geçersiz slug: ' + slug);
}

const tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5).map(String) : [];
const now = new Date().toISOString();

const posts = [
  {
    locale: 'tr',
    slug,
    title: parsed.tr.title,
    excerpt: parsed.tr.excerpt,
    content: parsed.tr.content,
    tags,
    metaTitle: parsed.tr.metaTitle || parsed.tr.title,
    metaDescription: parsed.tr.metaDescription || parsed.tr.excerpt,
    coverUrl: null,
    coverAlt: parsed.tr.coverImageAlt || parsed.tr.title,
    status: 'PUBLISHED',
    readMinutes: 0,
    publishedAt: now,
  },
  {
    locale: 'en',
    slug,
    title: parsed.en.title,
    excerpt: parsed.en.excerpt,
    content: parsed.en.content,
    tags,
    metaTitle: parsed.en.metaTitle || parsed.en.title,
    metaDescription: parsed.en.metaDescription || parsed.en.excerpt,
    coverUrl: null,
    coverAlt: parsed.en.coverImageAlt || parsed.en.title,
    status: 'PUBLISHED',
    readMinutes: 0,
    publishedAt: now,
  },
];

// Statik veriye yaz — kullanıcı onay butonuna tıkladığında Telegram yolu
// buradan okuyacak. 7 gün sonra otomatik temizlenir.
const staticData = $getWorkflowStaticData('global');
staticData.pendingPosts = staticData.pendingPosts || {};
staticData.pendingPosts[slug] = {
  posts,
  createdAt: Date.now(),
};

return [{
  json: {
    slug,
    trTitle: parsed.tr.title,
    trExcerpt: parsed.tr.excerpt,
    enTitle: parsed.en.title,
    enExcerpt: parsed.en.excerpt,
    postCount: posts.length,
  }
}];
      `,
    },
  },
});

/** Hazırlanan içeriği önizleme olarak Telegram'a gönderir. */
const sendForApproval = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Send for Approval",
    parameters: {
      resource: "message",
      operation: "sendMessage",
      chatId: expr(TELEGRAM_CHAT_ID),
      text: expr(`📝 *Yeni blog yazısı hazır!*

🇹🇷 *{{ $json.trTitle }}*
{{ $json.trExcerpt }}

🇬🇧 *{{ $json.enTitle }}*
{{ $json.enExcerpt }}

🔖 Slug: \`{{ $json.slug }}\`
📦 {{ $json.postCount }} sürüm (TR + EN)

Onaylarsan hemen siteye yayınlanır.`),
      replyMarkup: "inlineKeyboard",
      inlineKeyboard: {
        rows: [
          {
            row: {
              buttons: [
                {
                  text: "✅ Onayla ve Yayınla",
                  additionalFields: {
                    callback_data: expr(`blog:approve:{{ $json.slug }}`),
                  },
                },
                {
                  text: "❌ Reddet",
                  additionalFields: {
                    callback_data: expr(`blog:reject:{{ $json.slug }}`),
                  },
                },
              ],
            },
          },
        ],
      },
      additionalFields: {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

// ════════════════════════════════════════════════════════════════════════
//  APPROVAL PATH — Telegram callback → publish or discard
// ════════════════════════════════════════════════════════════════════════

/** Callback payload'ını ayrıştırır ve statik veriden post verisini çeker. */
const extractCallback = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Extract Callback Decision",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: `
const cb = $input.first().json?.callback_query;
if (!cb) {
  return [{ json: { skip: true, reason: 'no_callback_query' } }];
}

const data = String(cb.data || '');
const match = data.match(/^blog:(approve|reject):(.+)$/);
if (!match) {
  return [{ json: { skip: true, reason: 'invalid_callback_data' } }];
}

const decision = match[1];
const slug = match[2];
const callbackQueryId = cb.id;
const messageId = cb.message?.message_id;
const chatId = cb.message?.chat?.id;

const staticData = $getWorkflowStaticData('global');
const pending = staticData.pendingPosts?.[slug];

// 7 günden eski pending post'ları temizle (background job gibi)
if (staticData.pendingPosts) {
  const now = Date.now();
  for (const [k, v] of Object.entries(staticData.pendingPosts)) {
    if (v && v.createdAt && now - v.createdAt > 7 * 24 * 60 * 60 * 1000) {
      delete staticData.pendingPosts[k];
    }
  }
}

return [{
  json: {
    decision,
    slug,
    callbackQueryId,
    messageId,
    chatId,
    posts: pending?.posts || null,
    hasPending: !!pending,
  }
}];
      `,
    },
  },
});

/** Onay mı, red mi? */
const routeDecision = ifElse({
  type: "n8n-nodes-base.if",
  version: 2.3,
  config: {
    name: "Route: Approve or Reject",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
        conditions: [
          {
            leftValue: expr("{{ $json.decision }}"),
            operator: { type: "string", operation: "equals" },
            rightValue: "approve",
          },
        ],
        combinator: "and",
      },
    },
  },
});

/** Onay: site webhook'una POST. */
const publishToSite = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Publish to Site Webhook",
    parameters: {
      method: "POST",
      url: BLOG_WEBHOOK_URL,
      sendHeaders: true,
      specifyHeaders: "keypair",
      headerParameters: {
        parameters: [
          { name: "Content-Type", value: "application/json" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: expr(
        `JSON.stringify({ secret: ${JSON.stringify(BLOG_WEBHOOK_SECRET)}, posts: $json.posts })`,
      ),
      options: {
        timeout: 30000,
        response: {
          response: {
            response: {
              neverError: true,
            },
          },
        },
      },
    },
  },
});

/** Onay başarılıysa mesajı düzenle. */
const editApprovedMsg = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Edit: Approved",
    parameters: {
      resource: "message",
      operation: "editMessageText",
      messageType: "message",
      chatId: expr("{{ $json.chatId }}"),
      messageId: expr("{{ $json.messageId }}"),
      text: expr(
        "✅ *Yayında!* Yazı siteye eklendi — /blog/{{ $json.slug }}",
      ),
      additionalFields: {
        parse_mode: "Markdown",
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

/** Onay başarısızsa mesajı düzenle (hata ile). */
const editPublishFailedMsg = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Edit: Publish Failed",
    parameters: {
      resource: "message",
      operation: "editMessageText",
      messageType: "message",
      chatId: expr("{{ $json.chatId }}"),
      messageId: expr("{{ $json.messageId }}"),
      text: expr(
        "⚠️ Yayınlama sırasında hata: \`{{ $json.publishError || 'bilinmiyor' }}\`\nSite webhook kontrol edilmeli.",
      ),
      additionalFields: {
        parse_mode: "Markdown",
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

/** Red yolu: mesajı düzenle. */
const editRejectedMsg = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Edit: Rejected",
    parameters: {
      resource: "message",
      operation: "editMessageText",
      messageType: "message",
      chatId: expr("{{ $json.chatId }}"),
      messageId: expr("{{ $json.messageId }}"),
      text: expr("❌ Yazı reddedildi, yayınlanmadı."),
      additionalFields: {
        parse_mode: "Markdown",
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

/** "Bekleyen post bulunamadı" — örn. n8n yeniden başladıysa. */
const editStaleMsg = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Edit: Stale (Pending Lost)",
    parameters: {
      resource: "message",
      operation: "editMessageText",
      messageType: "message",
      chatId: expr("{{ $json.chatId }}"),
      messageId: expr("{{ $json.messageId }}"),
      text: expr(
        "⚠️ Bu yazı çoktan zaman aşımına uğradı (n8n yeniden başlamış olabilir). Yeniden üretilmesi gerekiyor.",
      ),
      additionalFields: {
        parse_mode: "Markdown",
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

/** "Bilinmeyen callback" — yabancı bir mesajdan gelirse. */
const skipCallback = node({
  type: "n8n-nodes-base.telegram",
  version: 1.2,
  config: {
    name: "Answer & Skip Unknown Callback",
    parameters: {
      resource: "callback",
      operation: "answerQuery",
      queryId: expr("{{ $json.callbackQueryId }}"),
      additionalFields: {
        text: "Bu işlem geçerli değil veya zaman aşımına uğramış.",
        show_alert: true,
      },
    },
  },
  credentials: {
    telegramApi: newCredential("Telegram Blog Bot"),
  },
});

// ════════════════════════════════════════════════════════════════════════
//  WORKFLOW COMPOSITION
// ════════════════════════════════════════════════════════════════════════

export default workflow(
  "chromai-blog-daily",
  "Chromai — Daily AI Blog Post Generator",
)
  // ─── DAILY PATH ────────────────────────────────────────────────
  .add(dailyTrigger)
  .to(generatePost)
  .to(parseAiResponse)
  .to(sendForApproval)

  // ─── TELEGRAM APPROVAL PATH ────────────────────────────────────
  .add(telegramTrigger)
  .to(extractCallback)

  // Önce "bu bot için geçerli bir callback mi?" kontrolü — değilse ack ile geç
  .to(
    ifElse({
      type: "n8n-nodes-base.if",
      version: 2.3,
      config: {
        name: "Is Blog Callback?",
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: "",
              typeValidation: "strict",
            },
            conditions: [
              {
                leftValue: expr("{{ $json.skip }}"),
                operator: { type: "boolean", operation: "not" },
                rightValue: "true",
              },
            ],
            combinator: "and",
          },
        },
      },
    })
      // Geçerli callback → yönlendir
      .onTrue(
        ifElse({
          type: "n8n-nodes-base.if",
          version: 2.3,
          config: {
            name: "Pending Post Exists?",
            parameters: {
              conditions: {
                options: {
                  caseSensitive: true,
                  leftValue: "",
                  typeValidation: "strict",
                },
                conditions: [
                  {
                    leftValue: expr("{{ $json.hasPending }}"),
                    operator: { type: "boolean", operation: "true" },
                  },
                ],
                combinator: "and",
              },
            },
          },
        })
          .onTrue(
            // Karar → onay mı red mi?
            routeDecision
              .onTrue(
                // ONAY: siteye yayınla → mesajı düzenle
                publishToSite.to(
                  ifElse({
                    type: "n8n-nodes-base.if",
                    version: 2.3,
                    config: {
                      name: "Publish Succeeded?",
                      parameters: {
                        conditions: {
                          options: {
                            caseSensitive: true,
                            leftValue: "",
                            typeValidation: "strict",
                          },
                          conditions: [
                            {
                              leftValue: expr(
                                "{{ $json.statusCode && $json.statusCode < 300 }}",
                              ),
                              operator: { type: "boolean", operation: "true" },
                            },
                          ],
                          combinator: "and",
                        },
                      },
                    },
                  })
                    .onTrue(editApprovedMsg)
                    .onFalse(editPublishFailedMsg),
                ),
              )
              .onFalse(editRejectedMsg),
          )
          .onFalse(editStaleMsg),
      )
      // Geçersiz callback → ack'le ve geç
      .onFalse(skipCallback),
  );
