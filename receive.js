const amqp = require('amqplib');

async function receiveMsg(queue) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  // Specify queue type based on queue name
  const queueOptions = queue === 'quorum_queue' ? { arguments: { 'x-queue-type': 'quorum' } } : {};
  await channel.assertQueue(queue, queueOptions);
  console.log(`Waiting for messages in ${queue}...`);

  channel.consume(queue, msg => {
    console.log(`Received: ${msg.content.toString()}`);
    channel.ack(msg);
  });
}

(async () => {
  await receiveMsg('classic_queue');
  await receiveMsg('quorum_queue');
})();


