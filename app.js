const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const client = new Client();
//OpenAI requires
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const Piii = require("piii");

class Message {
  constructor(texto) {
    this.texto = texto;
    this.piii = new Piii();
  }

  isValid() {
    // Verificar se a mensagem não está vazia e não contém palavrões
    return (
      this.texto && this.texto.trim().length > 0 && !this.piii.check(this.texto)
    );
  }
}

async function gpt(prompt) {
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    role: "assistant",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 100,
  });
  let response = completion.data.choices[0].message;
  return response;
}

client.on("message", async (message) => {
  let mensagem = new Message(message.body);

  if (mensagem.startsWith("$bot")) {
    if (mensagem.isValid()) {

      let comando = mensagem.texto.split(" ")[1];

      switch (comando) {
        // Responder com o link da documentação
        case '/doc':
          await message.reply(`\n Consulte a documentação completa em https://api-gpt.vercel.app/`);
      }

      let response = await gpt(mensagem.texto);
      await message.reply(`GPT:\n${response}`);

    } else {
      message.reply(`Desculpe, sua mensagem está fora do escopo de resposta.\n Verifique com os administradores do sistema ou consulte a documentação em https://api-gpt.vercel.app/. @5562986268745`);
    }
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();
