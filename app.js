const { Client } = require('whatsapp-web.js');
const client = new Client();
//OpenAI requires
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const Piii = require('piii');

class Message {
  constructor(texto) {
    this.texto = texto;
    this.piii = new Piii();
  }

  isValid() {
    // Verificar se a mensagem não está vazia e não contém palavrões
    return this.texto && this.texto.trim().length > 0 && !this.piii.check(this.texto);
  }
}


  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
  model: "gpt-3.5-turbo",
  prompt: "Say this is a test",
  temperature: 0.6,
  max_tokens: 20,
  });


client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
