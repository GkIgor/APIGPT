const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
const qrcode = require('qrcode-terminal');
const gpt = require('./gpt.js');

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", () => {
    console.log('Mensagem recebida');
});

client.on('message_create', async (message) => {
    const { chat, body } = message;

    if (chat && chat.id && chat.id._serialized === '120363092460966035@g.us' && body.startsWith('$bot')) {
        console.log('enviando mensagem');
        await client.sendMessage(chat.id._serialized, 'Funcionando!');
    }
    
});


client.on("ready", () => {
  console.log("Logado!");
});

process.on('SIGINT', () => {
    console.log('Encerrando conexão com WhatsApp...');
    gpt.destroy();
    wwebConnection.destroy();
    process.exit();
  });

client.initialize();
