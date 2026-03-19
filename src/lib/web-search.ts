export type WebSearchSource =
  | 'search1api'
  | 'google'
  | 'bing'
  | 'serpapi'
  | 'serper'
  | 'duckduckgo'
  | 'searxng';

export interface WebSearchItem {
  source: WebSearchSource;
  title?: string;
  link?: string;
  snippet?: string;
}

export interface WebSearchSnapshot {
  query: string;
  sources: WebSearchSource[];
  items: WebSearchItem[];
  debug?: Array<{
    source: WebSearchSource;
    status?: number;
    message: string;
  }>;
}

type WebSearchDebugEntry = {
  source: WebSearchSource;
  status?: number;
  message: string;
};

const REQUEST_TIMEOUT_MS = 6000;
const DEFAULT_MAX_RESULTS = 5;

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildConfiguredSources(): WebSearchSource[] {
  const configured = process.env.WEB_SEARCH_SOURCES || process.env.SEARCH_SERVICE || '';
  const parsed = configured
    .split(',')
    .map((source) => source.trim().toLowerCase())
    .filter(Boolean) as WebSearchSource[];

  if (parsed.length) {
    return Array.from(new Set(parsed));
  }

  return ['duckduckgo'];
}

function buildSearchUrl(source: WebSearchSource, query: string): string | null {
  const encoded = encodeURIComponent(normalizeQuery(query));

  switch (source) {
    case 'search1api':
      return 'https://api.search1api.com/search/';
    case 'google':
      if (!process.env.GOOGLE_KEY || !process.env.GOOGLE_CX) return null;
      return `https://www.googleapis.com/customsearch/v1?cx=${process.env.GOOGLE_CX}&key=${process.env.GOOGLE_KEY}&q=${encoded}`;
    case 'bing':
      if (!process.env.BING_KEY) return null;
      return `https://api.bing.microsoft.com/v7.0/search?q=${encoded}`;
    case 'serpapi':
      if (!process.env.SERPAPI_KEY) return null;
      return `https://serpapi.com/search?api_key=${process.env.SERPAPI_KEY}&engine=google&q=${encoded}&google_domain=google.com`;
    case 'serper':
      if (!process.env.SERPER_KEY) return null;
      return 'https://google.serper.dev/search';
    case 'duckduckgo':
      return `https://html.duckduckgo.com/html/?q=${encoded}`;
    case 'searxng':
      if (!process.env.SEARXNG_BASE_URL) return null;
      return `${process.env.SEARXNG_BASE_URL}/search?q=${encoded}&category=general&format=json`;
    default:
      return null;
  }
}

function normalizeItem(source: WebSearchSource, item: any): WebSearchItem {
  return {
    source,
    title: item?.title || item?.name || item?.heading || item?.resultTitle || item?.titleText,
    link: item?.link || item?.url || item?.href || item?.destination || item?.originalUrl,
    snippet:
      item?.snippet || item?.body || item?.content || item?.description || item?.excerpt || item?.summary,
  };
}

function normalizeJsonResults(source: WebSearchSource, data: any): WebSearchItem[] {
  const candidates =
    (Array.isArray(data) && data) ||
    data?.results ||
    data?.items ||
    data?.organic ||
    data?.webPages?.value ||
    data?.news_results ||
    data?.organic_results ||
    data?.result ||
    [];

  if (!Array.isArray(candidates)) {
    return [];
  }

  return candidates.slice(0, DEFAULT_MAX_RESULTS).map((item) => normalizeItem(source, item));
}

function parseDuckDuckGoHtml(html: string): WebSearchItem[] {
  const items: WebSearchItem[] = [];
  const regex = /<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    items.push({
      source: 'duckduckgo',
      link: match[1],
      title: stripHtml(match[2]),
      snippet: stripHtml(match[3]),
    });

    if (items.length >= DEFAULT_MAX_RESULTS) {
      break;
    }
  }

  if (items.length) {
    return items;
  }

  const fallbackRegex = /<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = fallbackRegex.exec(html))) {
    items.push({
      source: 'duckduckgo',
      link: match[1],
      title: stripHtml(match[2]),
    });

    if (items.length >= DEFAULT_MAX_RESULTS) {
      break;
    }
  }

  return items;
}

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        ...(init?.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function searchSource(
  source: WebSearchSource,
  query: string,
): Promise<{ items: WebSearchItem[]; debug?: WebSearchDebugEntry | null }> {
  const url = buildSearchUrl(source, query);
  if (!url) {
    return {
      items: [],
      debug: { source, message: '未配置该搜索源所需的环境变量。' },
    };
  }

  try {
    if (source === 'serper') {
      const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS, {
        method: 'POST',
        body: JSON.stringify({ q: normalizeQuery(query), gl: process.env.GL || 'us', hl: process.env.HL || 'en' }),
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.SERPER_KEY || '',
        },
      });

      const text = await response.text();
      if (!response.ok) {
        return { items: [], debug: { source, status: response.status, message: text.slice(0, 160) || '请求失败' } };
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      return { items: normalizeJsonResults(source, data), debug: null };
    }

    if (source === 'duckduckgo') {
      const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
      const html = await response.text();

      if (!response.ok) {
        return { items: [], debug: { source, status: response.status, message: html.slice(0, 160) || '请求失败' } };
      }

      return { items: parseDuckDuckGoHtml(html), debug: null };
    }

    if (source === 'search1api') {
      const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.SEARCH1API_KEY ? `Bearer ${process.env.SEARCH1API_KEY}` : '',
        },
        body: JSON.stringify({
          query: normalizeQuery(query),
          search_service: 'google',
          max_results: String(DEFAULT_MAX_RESULTS),
          crawl_results: '0',
        }),
      });

      const text = await response.text();
      if (!response.ok) {
        return { items: [], debug: { source, status: response.status, message: text.slice(0, 160) || '请求失败' } };
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      return { items: normalizeJsonResults(source, data), debug: null };
    }

    if (source === 'google' || source === 'bing' || source === 'serpapi' || source === 'searxng') {
      const response = await fetchWithTimeout(
        url,
        REQUEST_TIMEOUT_MS,
        source === 'bing'
          ? { headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_KEY || '' } }
          : undefined
      );
      const text = await response.text();

      if (!response.ok) {
        return { items: [], debug: { source, status: response.status, message: text.slice(0, 160) || '请求失败' } };
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      return { items: normalizeJsonResults(source, data), debug: null };
    }

    return {
      items: [],
      debug: { source, message: '不支持的搜索源。' },
    };
  } catch (error) {
    return {
      items: [],
      debug: {
        source,
        message: error instanceof Error ? error.message : '联网搜索失败',
      },
    };
  }
}

export async function searchWeb(query: string, sources = buildConfiguredSources()): Promise<WebSearchSnapshot> {
  const normalizedSources = Array.from(new Set(sources)).filter(Boolean) as WebSearchSource[];
  const settled = await Promise.allSettled(normalizedSources.map((source) => searchSource(source, query)));

  const items: WebSearchItem[] = [];
  const debug: WebSearchSnapshot['debug'] = [];

  settled.forEach((result, index) => {
    const source = normalizedSources[index];

    if (result.status === 'fulfilled') {
      items.push(...result.value.items.slice(0, DEFAULT_MAX_RESULTS));
      if (result.value.debug) {
        debug.push(result.value.debug);
      }
      return;
    }

    debug.push({
      source,
      message: result.reason instanceof Error ? result.reason.message : '联网搜索失败',
    });
  });

  return {
    query: normalizeQuery(query),
    sources: normalizedSources,
    items: items.slice(0, DEFAULT_MAX_RESULTS),
    debug,
  };
}

export function formatWebSearchSnapshot(snapshot: WebSearchSnapshot): string {
  if (!snapshot.items.length) {
    const debugLines = snapshot.debug?.map((entry) => {
      const parts = [`${entry.source}: ${entry.message}`];
      if (entry.status) parts.push(`状态 ${entry.status}`);
      return parts.join('，');
    });

    return [
      `联网搜索查询词：${snapshot.query}`,
      '结果：当前没有抓到可用的联网搜索结果。',
      debugLines?.length ? `失败原因：${debugLines.join('；')}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  const lines = snapshot.items.map((item, index) => {
    const parts = [
      `第${index + 1}条 来源：${item.source}`,
      item.title ? `标题：${item.title}` : '',
      item.snippet ? `摘要：${item.snippet}` : '',
      item.link ? `链接：${item.link}` : '',
    ].filter(Boolean);

    return parts.join(' | ');
  });

  return [`联网搜索查询词：${snapshot.query}`, '搜索结果：', ...lines].join('\n');
}
