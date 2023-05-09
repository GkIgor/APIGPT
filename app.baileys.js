const { WAConnection, MessageType } = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const Piii = require("piii");
//OpenAI requires
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
    let numeroAleatorio = Math.floor(Math.random() * exemplos.length);
    return exemplos[numeroAleatorio];
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

const conn = new WAConnection();
conn.on("open", () => {
    console.log("Connected successfully!");
});

conn.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

conn.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

conn.on("chat-update", async (chat) => {
    if (chat.hasNewMessage) {
        const message = chat.messages.all()[0];
        let mensagem = new Message(message.body);

        if (mensagem.texto.slice(0, 4) === "$bot") {
            if (mensagem.isValid()) {
                let comando = mensagem.texto.split(" ")[1];

                switch (comando) {
                    case "/doc":
                        await conn.sendMessage(message.jid, `\nConsulte a documentação completa em https://api-gpt.vercel.app/`, MessageType.text);
                        break;

                    case "/exemplo":
                        await conn.sendMessage(message.jid, `\nExemplo de uso:`, MessageType.text);
                        await conn.sendMessage(message.jid, exemplo(), MessageType.text);
                        break;

                    case "--config":
                        // Lógica para configuração
                        break;
                }

                let response = await gpt(mensagem.texto);
                await conn.sendMessage(message.jid, `GPT:\n${response}`, MessageType.text);
            } else {
                await conn.sendMessage(
                    message.jid,
                    `Desculpe, sua mensagem está fora do escopo de resposta.\nVerifique com os administradores do sistema ou consulte a documentação em https://api-gpt.vercel.app/. @5562986268745`,
                    MessageType.text
                );
            }
        }
    }
});

conn.connect();
