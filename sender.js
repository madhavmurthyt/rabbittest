const amqp = require('amqplib');

async function sendMsg() {
  const queue = 'testQueue';
  const msg = 'Hello from Node.js2!';

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(msg));

  console.log(`Sent: ${msg}`);
  setTimeout(() => conn.close(), 500);
}

sendMsg().catch(console.error);
