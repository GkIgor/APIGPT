const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const grupos = ['120363092460966035@g.us', '555195660801-1424668624@g.us'];

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
    headless: true,
  }
});
const qrcode = require('qrcode-terminal');
const gpt = require('./gpt.js');

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", () => {
  console.log('Mensagem recebida');
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

client.initialize()
  .then(() => console.log('Cliente inicializado com sucesso!'))
  .catch((err) => console.error('Erro ao inicializar o cliente:', err));


client.on('message_create', async (msg) => {
  try {
    const { body, id: {remote} } = msg;
    const chat = await msg.getChat();
    const valid = body.startsWith('$bot') && grupos.includes(remote) && chat.isGroup;

    if (valid) {
     //bot vai aqui

    } else {
      console.log(`Não disponível para mensagens privadas. Para mais informações, contate o administrador do bot @${5562986268745} `)
    }

  } catch (err) {
    await msg.reply(`Um erro inesperado aconteceu, contate o administrador do bot @${5562986268745}`)
    console.error(err)





    console.log('--------------------------------------------------')
    //console.log(body)
  }

  //console.log(body)
  //
  // const { groupMetadata: { id: { _serialized } } } = await msg.getChat();
  // console.log(_serialized);




  //console.log(msg)
  // 

  //console.log('--------------------------------------------------------')
  //console.log(valid)
  // console.log(grupos.includes(chatId))
  //console.log(msg.toString().trim().startsWith('$bot'))

  /* if (valid) {
     
     msg.reply(`Funcionando! \n\n ${chatId}`)
   } */


  // await client.sendMessage(chatID, `Funcionando! \n\n Chat ID:, ${chatID} \n\n Chat NAME:${msg.getChat().name}`);

});
