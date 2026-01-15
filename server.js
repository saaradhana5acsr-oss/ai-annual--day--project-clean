const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      return res.json({ reply });
    } else {
      return res.status(500).json({ reply: 'Unexpected response format from OpenAI.' });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return res.status(500).json({ reply: 'Error communicating with OpenAI.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});