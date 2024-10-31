import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "sk-L8F97XOcGHYcjC5GOMssbhlApyf3kseQBsF9Qy42PGqi32bR", // This is the default and can be omitted
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
}

main();