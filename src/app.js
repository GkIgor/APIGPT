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
  { allstack: "120363029900825529@g.us" },
  { teste: "555195660801-1424668624@g.us" },
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
  bot: "inactive",
  doc: "active",
  exemplo: "active",
  config: "inactive",
};

class Bot {
  constructor(param = "") {
    this.param;
  }
  doc() {
    const documentation = Object.entries(comandos)
      .map(([command, status]) => `${command}: ${status}`)
      .join("\n");

    return `Consulte a documentação completa em https://api-gpt.vercel.app/\nComandos:\n${documentation}`;
  }

  exemplo() {
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
    const numeroAleatorio = Math.floor(Math.random() * exemplos.length);
    return exemplos[numeroAleatorio];
  }

  config() {
    const $1 = body.split(" ")[2];
    const $2 = body.split(" ")[3];
    const $3 = body.split(" ")[4];
  }

  async gpt(
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
}

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

client.on("message_create", async (msg) => {
  try {
    const {
      body,
      id: { remote },
    } = msg;

    console.log(body);
    console.log(remote);

    const chat = await msg.getChat();
    const valid =
      body.startsWith("$bot") &&
      grupos.some((grupo) => Object.values(grupo).includes(remote)) &&
      chat.isGroup;

    const message = new Message(body);

    console.log(valid);

    if (valid) {
      msg.reply("bot");
      //bot vai aqui
      const parametros =
        body.split(" ")[1].replace("/", "") ||
        body.split(" ")[1].replace("--", "");

      const commandBot = body.startsWith("$bot");

      if (commandBot) {
        const bot = new Bot();

        switch (parametros) {
          case "doc":
            await msg.reply(bot.doc);
            break;
            default:
               // msg.reply(bot.gpt());
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});
