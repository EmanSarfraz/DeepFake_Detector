const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { videoBase64, mimeType } = JSON.parse(event.body);

    const response = await fetch('https://api.thehive.ai/api/v2/task/sync', {
      method: 'POST',
      headers: {
        'Authorization': {
            "statement": [
              {
                "key": "models",
                "action": [
                  "hive:CallApi"
                ],
                "effect": "Allow",
                "resource": [
                  "hive:models:sf1:::v3/*",
                  "hive:models:va1:::v3/*"
                ]
              }
            ]
          },
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        media: [{
          url: `data:${mimeType};base64,${videoBase64}`
        }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};