const { Client, LocalAuth } = require("whatsapp-web.js");
const puppeteer = require("puppeteer");

//gpt

const Piii = require("piii");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//Fim do gpt

const grupos = [
  "120363092460966035@g.us",
  "120363148607141306@g.us",
  "120363029900825529@g.us",
  "555195660801-1424668624@g.us",
];

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
    headless: true,
  },
});
const qrcode = require("qrcode-terminal");

const comandos = {
  doc: "active",
  exemplo: "active",
  config: "inactive",
};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", () => {
  console.log("Mensagem recebida");
});

client.on("ready", () => {
  console.log("Logado!");
});

process.on("SIGINT", () => {
  console.log("Encerrando conexão com WhatsApp...");
  wwebConnection.destroy();
  process.exit();
});

client
  .initialize()
  .then(() => console.log("Cliente inicializado com sucesso!"))
  .catch((err) => console.error("Erro ao inicializar o cliente:", err));

// Codigo do bot

// Config do gpt

class Message {
  constructor(body) {
    this.texto = body;
    this.piii = new Piii();
  }

  isValid() {
    // Verificar se a mensagem não está vazia e não contém palavrões
    return (
      this.texto && this.texto.trim().length > 0 && !this.piii.check(this.texto)
    );
  }
}

async function gpt(
  body,
  model = "gpt-3.5-turbo",
  role = "assistant",
  temperature = 0.6,
  max_tokens = 150
) {
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model,
    role,
    prompt: body,
    temperature,
    max_tokens,
  });
  let response = completion.data.choices[0].message;
  return response;
}

// Função exemplo

function exemplo() {
  const exemplos = [
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
  const numeroAleatorio = Math.floor(Math.random() * exemplo.length);
  return exemplos[numeroAleatorio];
}

client.on("message_create", async (msg) => {
  try {
    //prettier-ignore
    const {body, id: { remote } } = msg;
    const chat = await msg.getChat();
    const valid = body.startsWith("$bot") && grupos.includes(remote) && chat.isGroup;
    const message = new Message(body)
    if (valid) {
      //bot vai aqui
      const parametros =
        body.split(" ")[1].replace("/", "") ||
        body.split(" ")[1].replace("--", "");
      // prettier-ignore
      if (comandos.hasOwnProperty(parametros) && comandos[parametros] === 'active') {
        if (parametros === 'doc') {
          await msg.reply(`\n Consulte a documentação completa em https://api-gpt.vercel.app/`);

        } else if (parametros === 'exemplo') {
          
          await msg.reply(`\n Exemplo de uso:`);
          await client.sendMessage(remote, exemplo());

        } else if (parametros === 'config') {
          const $1 = body.split(' ')[2];
          const $2 = body.split(' ')[3];
          const $3 = body.split(' ')[4];

        }
        
      }else if (comandos.hasOwnProperty(parametros) === 'inactive') {
        msg.reply('parametro inativo');
      }
       else if (!comandos.hasOwnProperty(parametros) ) {
        await msg.reply(await gpt(body))
        
      }
    } else {
      let {
        id: { remote },
      } = msg;
      console.log(remote);
      /*console.log(
        `Não disponível para mensagens privadas. Para mais informações, contate o administrador do bot @${5562986268745} `
      );*/
    }
  } catch (err) {
    console.error(err);

    console.log("--------------------------------------------------");
  }
});
