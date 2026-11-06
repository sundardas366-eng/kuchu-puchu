export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Ping hits.sh to get real persistent global visit count
    const response = await fetch('https://hits.sh/kuchu-puchu-sigma.vercel.app.svg?cache=' + Date.now(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KuchuPuchuBot/1.0)' }
    });
    const svgText = await response.text();
    const match = svgText.match(/<title>hits:\s*(\d+)<\/title>/i) || svgText.match(/<text[^>]*>(\d+)<\/text>/i);
    const realViews = match ? parseInt(match[1], 10) : 1;

    return res.status(200).json({
      success: true,
      views: realViews,
      timestamp: Date.now()
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      views: 1,
      error: err.message
    });
  }
}
