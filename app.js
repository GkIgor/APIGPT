const { create, Whatsapp } = require('@open-wa/wa-automate');
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

create().then((client) => {
   client.onMessage(async (message) => {
    if (message.body.startsWith('$bot')) {
      const msg = new Message(message.body.substring(4));
      if (msg.isValid()) {
        console.log('Nova mensagem recebida:', message.body);
        // Chamar a função para gerar a resposta usando o GPT-3 ou outro modelo

        const { Configuration, OpenAIApi } = require("openai");

        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{role: "user", content: message.body}],
        });
        console.log(completion.data.choices[0].message);

      } else {
        console.log('Mensagem inválida recebida:', message.body);
      }
    }
  });
}).catch((err) => { console.error(err) });


/*
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: new Message(message)}],
});
console.log(completion.data.choices[0].message);
*/