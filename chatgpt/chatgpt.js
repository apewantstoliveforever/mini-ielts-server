const OpenAI = require("openai");

const token = ''

const openai = new OpenAI({
    apiKey: token
});

async function createChatbotResponse(prompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature: 0,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const message = response.choices[0].message.content
    console.log(message)
    return message;
}

module.exports = { createChatbotResponse };
