const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
    authStrategy: new LocalAuth()
});

const Piii = require("piii");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function exemplo() {
  let exemplos = [
    "$bot Crie uma frase engraçada para compartilhar no grupo.",
    "$bot Escreva um texto que possa ser usado como legenda em uma foto.",
    "$bot Crie uma frase inspiradora para compartilhar no grupo.",
    "$bot Escreva uma mensagem de bom dia para alegrar o grupo.",
    "$bot Crie uma mensagem de parabéns para um membro do grupo.",
    "$bot Escreva uma mensagem de agradecimento para o organizador do último evento.",
    "$bot Crie uma mensagem de despedida para um membro que está saindo do grupo.",
    "$bot Escreva uma mensagem motivacional para incentivar os membros do grupo.",
    "$bot Crie uma mensagem divertida para compartilhar com o grupo no fim de semana.",
    "$bot Escreva uma mensagem de boas-vindas para um novo membro do grupo.",
  ];
  let numeroAleatorio = Math.floor(Math.random() * exemplo.length);
  return exemplo[numeroAleatorio];
}

async function gpt(prompt, model = 'gpt-3.5-turbo', role = 'assistant', temperature = 0.6, max_tokens = 150) {
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model,
    role: role,
    prompt: prompt,
    temperature,
    max_tokens,
  });
  let response = completion.data.choices[0].message;
  return response;
}

client.on('message_create', async (message) => {
    const { body, from } = message;

    if (from && body.startsWith('$bot')) {
        console.log('Enviando Mensagem');
        message_create.sendMessage('Funcionando')
    }
});

/*
client.on("message", async (message) => {
  let mensagem = new Message(message.body);

  if (mensagem.slice(0, 4)) {
    if (mensagem.isValid()) {
      let comando = mensagem.texto.split(" ")[1];

      switch (comando) {

        case "/doc":
          await message.reply(`\n Consulte a documentação completa em https://api-gpt.vercel.app/`);
        break;

        case "/exemplo":
          await message.reply(`\n Exemplo de uso:`);
          await message.sendMessage(exemplo());
        break;

        case "--config":
          
          break;
      }

      let response = await gpt(mensagem.texto);
      await message.reply(`GPT:\n${response}`);
    } else {
      message.reply(
        `Desculpe, sua mensagem está fora do escopo de resposta.\n Verifique com os administradores do sistema ou consulte a documentação em https://api-gpt.vercel.app/. @5562986268745`
      );
    }
  }
});
*/