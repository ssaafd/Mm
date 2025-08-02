export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const response = await fetch("https://api.sunoapi.com/api/v1/generate/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt
      })
    });

    const data = await response.json();
    const taskId = data?.data?.[0]?.task_id;
    if (!taskId) return res.status(500).json({ error: 'No taskId returned' });

    res.status(200).json({ taskId });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
