export type MarketSource =
  | 'amazon'
  | 'google'
  | 'walmart'
  | 'target'
  | 'ebay'
  | 'taobao'
  | 'pdd'
  | 'jd';

export interface MarketPriceItem {
  source: MarketSource;
  title?: string;
  price?: string;
  currency?: string;
  url?: string;
  seller?: string;
  shipping?: string;
  rating?: string;
}

export interface MarketPriceSnapshot {
  query: string;
  sources: MarketSource[];
  items: MarketPriceItem[];
  debug?: Array<{
    source: MarketSource;
    status?: number;
    message: string;
  }>;
}

const DEFAULT_SOURCES: MarketSource[] = [
  'amazon',
  'google',
  'walmart',
  'target',
  'ebay',
  'taobao',
  'pdd',
  'jd',
];

const REQUEST_TIMEOUT_MS = 8000;

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

function tokenizeQuery(query: string): string[] {
  return normalizeQuery(query)
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function isRelevantTitle(title: string, query: string): boolean {
  const normalizedTitle = title.toLowerCase();
  const tokens = tokenizeQuery(query);

  if (!tokens.length) {
    return true;
  }

  const hits = tokens.filter((token) => normalizedTitle.includes(token));
  return hits.length >= Math.max(1, Math.ceil(tokens.length / 3));
}

function buildSearchUrl(source: MarketSource, query: string): string | null {
  const encoded = encodeURIComponent(normalizeQuery(query));

  switch (source) {
    case 'amazon':
      return `https://www.amazon.com/s?k=${encoded}`;
    case 'google':
      return `https://www.google.com/search?tbm=shop&q=${encoded}`;
    case 'walmart':
      return `https://www.walmart.com/search?q=${encoded}`;
    case 'target':
      return `https://www.target.com/s?searchTerm=${encoded}`;
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${encoded}`;
    case 'taobao':
      return `https://s.taobao.com/search?q=${encoded}`;
    case 'pdd':
      return `https://mobile.yangkeduo.com/search_result.html?search_key=${encoded}`;
    case 'jd':
      return `https://search.jd.com/Search?keyword=${encoded}`;
    default:
      return null;
  }
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeMaybeJson(input: string): string {
  return input
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\"/g, '"');
}

function extractJsonLdBlocks(html: string): any[] {
  const blocks: any[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const raw = decodeMaybeJson(match[1].trim());

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else {
        blocks.push(parsed);
      }
    } catch {
      // ignore malformed blocks
    }
  }

  return blocks;
}

function extractMeta(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return stripHtml(match[1]);
    }
  }

  return undefined;
}

function firstMatch(html: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return stripHtml(match[1]);
    }
  }

  return undefined;
}

function parseNumberish(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/\s+/g, ' ').trim();
  return cleaned || undefined;
}

function normalizePriceText(input?: string): string | undefined {
  if (!input) return undefined;

  const cleaned = stripHtml(input)
    .replace(/CNY|USD|RMB|￥|¥|\$/gi, '')
    .replace(/(?:From|to|In stock|Save|Price|Sale)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const match = cleaned.match(/[0-9]+(?:[,.][0-9]{1,2})?/);
  return match?.[0] ? match[0].replace(/,/g, '') : undefined;
}

function parseItemsFromJsonLd(source: MarketSource, html: string): MarketPriceItem[] {
  const blocks = extractJsonLdBlocks(html);
  const items: MarketPriceItem[] = [];

  for (const block of blocks) {
    const candidates = Array.isArray(block?.itemListElement)
      ? block.itemListElement
      : Array.isArray(block?.mainEntity?.itemListElement)
        ? block.mainEntity.itemListElement
        : [];

    for (const candidate of candidates) {
      const item = candidate?.item || candidate;
      if (!item) continue;

      items.push({
        source,
        title: stripHtml(item?.name || candidate?.name || ''),
        price: parseNumberish(item?.offers?.price || candidate?.price || item?.price),
        currency: item?.offers?.priceCurrency || candidate?.priceCurrency || item?.priceCurrency,
        url: item?.url || candidate?.url,
        seller: item?.brand?.name || item?.seller?.name,
        shipping: item?.offers?.shippingDetails?.shippingRate?.value,
        rating: item?.aggregateRating?.ratingValue,
      });
    }
  }

  return items;
}

function parseAmazon(query: string, html: string): MarketPriceItem[] {
  const results: MarketPriceItem[] = [];
  const regex = /<div[^>]+data-component-type=["']s-search-result["'][\s\S]*?<h2[^>]*aria-label=["']([^"']+)["'][\s\S]*?<a[^>]+href=["']([^"']+)["'][\s\S]*?(?:<span class=["']a-price-whole["']>([^<]+)<\/span>[\s\S]*?<span class=["']a-price-fraction["']>([^<]+)<\/span>|<span class=["']a-offscreen["']>([^<]+)<\/span>)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const title = stripHtml(match[1]);
    const whole = match[3]?.trim();
    const fraction = match[4]?.trim();
    const offscreen = match[5]?.trim();
    const price =
      (whole
        ? `${whole}${fraction ? `.${fraction}` : ''}`
        : normalizePriceText(offscreen)) || undefined;
    const url = match[2]?.startsWith('http') ? match[2] : `https://www.amazon.com${match[2]}`;

    if (title && isRelevantTitle(title, query)) {
      results.push({ source: 'amazon', title, price, url });
    }
  }

  return results;
}

function extractBlockItems(
  source: MarketSource,
  html: string,
  blockPattern: RegExp,
  titlePatterns: RegExp[],
  pricePatterns: RegExp[],
  urlPatterns: RegExp[] = [],
): MarketPriceItem[] {
  const results: MarketPriceItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html))) {
    const block = match[1] || match[0];

    const title = firstMatch(block, titlePatterns);
    const price = firstMatch(block, pricePatterns);
    const url = firstMatch(block, urlPatterns);

    if (!title && !price) {
      continue;
    }

    results.push({
      source,
      title,
      price: normalizePriceText(price),
      url,
    });

    if (results.length >= 5) {
      break;
    }
  }

  return results;
}

function parseEbay(html: string): MarketPriceItem[] {
  const results: MarketPriceItem[] = [];
  const regex = /<li[^>]+class=["'][^"']*s-item[^"']*["'][\s\S]*?<a[^>]+class=["'][^"']*s-item__link[^"']*["'][^>]+href=["']([^"']+)["'][\s\S]*?<h3[^>]+class=["'][^"']*s-item__title[^"']*["'][^>]*>([\s\S]*?)<\/h3>[\s\S]*?<span[^>]+class=["'][^"']*s-item__price[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const url = match[1];
    const title = stripHtml(match[2]);
    const price = stripHtml(match[3]);

    if (title) {
      results.push({ source: 'ebay', title, price, url });
    }
  }

  return results;
}

function parseGenericTitlePriceLink(source: MarketSource, html: string): MarketPriceItem[] {
  const ldItems = parseItemsFromJsonLd(source, html);
  if (ldItems.length) return ldItems;

  const title =
    extractMeta(html, 'og:title') ||
    firstMatch(html, [
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    ]);

  const price =
    extractMeta(html, 'product:price:amount') ||
    extractMeta(html, 'og:price:amount') ||
    firstMatch(html, [
      /(?:"price"\s*:\s*|data-price=["'])([0-9]+(?:\.[0-9]+)?)/i,
      /(?:¥|￥|\$)\s*([0-9]+(?:\.[0-9]+)?)/i,
    ]);

  const url = extractMeta(html, 'og:url');

  if (!title && !price && !url) {
    return [];
  }

  return [
    {
      source,
      title,
      price: normalizePriceText(price),
      url,
    },
  ];
}

function parseGoogle(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'google',
    html,
    /<div[^>]+class=["'][^"']*(?:sh-dgr__grid-result|sh-dgr__content|sh-np__click-target|sh-osd__results)[^"']*["'][\s\S]*?<\/div>/gi,
    [
      /<h3[^>]*>([\s\S]*?)<\/h3>/i,
      /aria-label=["']([^"']+)["']/i,
      /data-attrid=["']title["'][^>]*>([\s\S]*?)<\/span>/i,
    ],
    [
      /<span[^>]+class=["'][^"']*(?:a8Pemb|T14wmb|g9WBQb|XcVN5d)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      /(?:¥|￥|\$)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('google', html);
}

function parseWalmart(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'walmart',
    html,
    /<div[^>]+data-item-id=["'][^"']+["'][\s\S]*?<\/div>/gi,
    [
      /data-automation-id=["']product-title["'][^>]*>([\s\S]*?)<\/a>/i,
      /aria-label=["']([^"']+)["']/i,
      /<span[^>]+class=["'][^"']*(?:w_iUH7|prod-ProductTitle|f3)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    ],
    [
      /data-automation-id=["']product-price["'][^>]*>([\s\S]*?)<\/span>/i,
      /<span[^>]+class=["'][^"']*(?:price-group|price-characteristic|price-display)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      /(?:\$|USD)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('walmart', html);
}

function parseTarget(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'target',
    html,
    /<div[^>]+data-test=["']product-card["'][\s\S]*?<\/div>/gi,
    [
      /data-test=["']product-title["'][^>]*>([\s\S]*?)<\/a>/i,
      /aria-label=["']([^"']+)["']/i,
      /<h3[^>]*>([\s\S]*?)<\/h3>/i,
    ],
    [
      /data-test=["']current-price["'][^>]*>([\s\S]*?)<\/span>/i,
      /<span[^>]+class=["'][^"']*(?:h-text-red|price|styles__PriceText)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      /(?:\$|USD)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('target', html);
}

function parseTaobao(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'taobao',
    html,
    /<div[^>]+(?:class|data-tag)=["'][^"']*(?:item|item J_MouserOnverReq|sale-item|ctx-box)[^"']*["'][\s\S]*?<\/div>/gi,
    [
      /<a[^>]+title=["']([^"']+)["']/i,
      /<img[^>]+alt=["']([^"']+)["']/i,
      /<span[^>]*class=["'][^"']*(?:title|J_ClickStat|main-title)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    ],
    [
      /(?:¥|￥)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
      /data-price=["']([0-9]+(?:\.[0-9]+)?)["']/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('taobao', html);
}

function parsePdd(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'pdd',
    html,
    /<div[^>]+(?:class|data-log-view)=["'][^"']*(?:goods|search-result|search_list|goods-card)[^"']*["'][\s\S]*?<\/div>/gi,
    [
      /<span[^>]+class=["'][^"']*(?:goods-name|title|link-title)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      /aria-label=["']([^"']+)["']/i,
    ],
    [
      /<span[^>]+class=["'][^"']*(?:normal-price|price|goods-price)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      /(?:¥|￥)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('pdd', html);
}

function parseJd(html: string): MarketPriceItem[] {
  const blockItems = extractBlockItems(
    'jd',
    html,
    /<li[^>]+class=["'][^"']*(?:gl-item|goods-item|item[^"']*)[^"']*["'][\s\S]*?<\/li>/gi,
    [
      /<em[^>]*>([\s\S]*?)<\/em>/i,
      /<img[^>]+alt=["']([^"']+)["']/i,
      /<a[^>]+title=["']([^"']+)["']/i,
    ],
    [
      /<i[^>]+class=["'][^"']*(?:price|J-p-)[^"']*["'][^>]*>([\s\S]*?)<\/i>/i,
      /(?:¥|￥)\s*([0-9]+(?:[,.][0-9]{1,2})?)/i,
    ],
    [
      /<a[^>]+href=["']([^"']+)["']/i,
    ],
  );

  return blockItems.length ? blockItems : parseGenericTitlePriceLink('jd', html);
}

function parseMarketplace(source: MarketSource, query: string, html: string): MarketPriceItem[] {
  switch (source) {
    case 'amazon':
      return parseAmazon(query, html);
    case 'ebay':
      return parseEbay(html);
    case 'google':
      return parseGoogle(html);
    case 'walmart':
      return parseWalmart(html);
    case 'target':
      return parseTarget(html);
    case 'taobao':
      return parseTaobao(html);
    case 'pdd':
      return parsePdd(html);
    case 'jd':
      return parseJd(html);
    default:
      return [];
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function crawlMarketPrices(query: string, sources = DEFAULT_SOURCES): Promise<MarketPriceSnapshot> {
  const normalizedSources = Array.from(new Set(sources)).filter(Boolean) as MarketSource[];
  const items: MarketPriceItem[] = [];
  const debug: MarketPriceSnapshot['debug'] = [];

  const settled = await Promise.allSettled(
    normalizedSources.map(async (source) => {
      const url = buildSearchUrl(source, query);

      if (!url) {
        return {
          source,
          items: [] as MarketPriceItem[],
          debug: { source, message: '不支持该平台。' },
        };
      }

      try {
        const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
        const html = await response.text();

        if (!response.ok) {
          return {
            source,
            items: [] as MarketPriceItem[],
            debug: {
              source,
              status: response.status,
              message: html.slice(0, 160) || '请求失败',
            },
          };
        }

        const parsedItems = parseMarketplace(source, query, html).filter((item) => {
          if (!item.title) return Boolean(item.price);
          return isRelevantTitle(item.title, query) || Boolean(item.price);
        });
        if (!parsedItems.length) {
          return {
            source,
            items: [] as MarketPriceItem[],
            debug: {
              source,
              status: response.status,
              message: '页面返回成功，但未解析到与查询相关的可用结果。',
            },
          };
        }

        return {
          source,
          items: parsedItems.slice(0, 3),
          debug: null,
        };
      } catch (error) {
        return {
          source,
          items: [] as MarketPriceItem[],
          debug: {
            source,
            message: error instanceof Error ? error.message : '抓取失败',
          },
        };
      }
    })
  );

  settled.forEach((result, index) => {
    const source = normalizedSources[index];

    if (result.status === 'fulfilled') {
      items.push(...result.value.items);
      if (result.value.debug) {
        debug.push(result.value.debug);
      }
      return;
    }

    debug.push({
      source,
      message: result.reason instanceof Error ? result.reason.message : '抓取失败',
    });
  });

  return {
    query: normalizeQuery(query),
    sources: normalizedSources,
    items,
    debug,
  };
}

export function formatMarketSnapshot(snapshot: MarketPriceSnapshot): string {
  if (!snapshot.items.length) {
    const debugLines = snapshot.debug?.map((entry) => {
      const parts = [`${entry.source}: ${entry.message}`];
      if (entry.status) parts.push(`状态 ${entry.status}`);
      return parts.join('，');
    });

    return [
      `采购查询词：${snapshot.query}`,
      '结果：当前没有抓到可用的价格结果。',
      debugLines?.length ? `失败原因：${debugLines.join('；')}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  const lines = snapshot.items.map((item, index) => {
    const parts = [
      `第${index + 1}条 平台：${item.source}`,
      item.title ? `商品：${item.title}` : '',
      item.price ? `价格：${item.price}${item.currency ? ` ${item.currency}` : ''}` : '',
      item.seller ? `卖家：${item.seller}` : '',
      item.shipping ? `运费：${item.shipping}` : '',
      item.rating ? `评分：${item.rating}` : '',
      item.url ? `链接：${item.url}` : '',
    ].filter(Boolean);

    return parts.join(' | ');
  });

  return [`采购查询词：${snapshot.query}`, '平台比价结果：', ...lines].join('\n');
}
