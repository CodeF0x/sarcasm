const telegraf = require('telegraf');
const uuid1 = require('uuid/v1');
const setupServer = require('./server');

bot = new telegraf(process.env.TOKEN);

bot.start(ctx => {
  const message = `Hello, ${ctx.message.from.username}. Use /help for help.`;
  ctx.reply(message);
});

bot.help(ctx => {
  const message = `
    Write me something and I'll send it back to you but in sArCaSm font, so you can copy and paste it.

    Or

    Just type "@sarcybot I want this in sarcasm font" in another chat and I'll do all the things for you.
    `;
  ctx.reply(message);
});

bot.on('message', ctx => {
  const msg = ctx.message.text;
  if (msg === '/start' || msg === '/help') {
    return;
  }

  const sarcasm = makeSarcasm(msg);
  ctx.reply(sarcasm);
});

bot.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  const sarcasmString = makeSarcasm(inlineQuery.query);

  if (!sarcasmString) {
    return;
  }

  const option = {
    type: 'article',
    id: uuid1(),
    title: sarcasmString,
    input_message_content: {
      message_text: sarcasmString
    }
  };

  return answerInlineQuery([option]);
});

bot.on('choosen_inline_result', ({ chosenInlineResult }) => {
  console.log(chosenInlineResult);
});

function makeSarcasm(string) {
  const sarcasm = [];

  for (let i = 0; i < string.length; i++) {
    if (i % 2 === 0) {
      sarcasm.push(string[i].toUpperCase());
    } else {
      sarcasm.push(string[i].toLowerCase());
    }
  }
  return sarcasm.join('');
}

bot.launch();
setupServer();
