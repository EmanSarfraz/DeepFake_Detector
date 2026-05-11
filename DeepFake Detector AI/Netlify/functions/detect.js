exports.handler = async (event) => {
  try {
    const { videoBase64, mimeType } = JSON.parse(event.body);

    const response = await fetch('https://api.thehive.ai/api/v2/task/sync', {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + process.env.HIVE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        media: [{ url: `data:${mimeType};base64,${videoBase64}` }]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
