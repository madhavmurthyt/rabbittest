const amqp = require('amqplib');

async function testQueues(queue, messageCount=1000) {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    
    // Set appropriate queue options based on queue type
    const queueOptions = queue === 'quorum_queue' 
        ? { durable: true, arguments: { 'x-queue-type': 'quorum' } }
        : { durable: true };
        
    await channel.assertQueue(queue, queueOptions);
    console.log(`Waiting for messages in ${queue}...`);

    const start = Date.now();

    for (let i = 0; i < messageCount; i++) {
        const msg = `Message ${i} Dummy`;
        channel.sendToQueue(queue, Buffer.from(msg));
    }

    const end = Date.now();
    const duration = (end - start) / 1000;
    const rate = messageCount / duration;

    console.log(`Sent ${messageCount} messages to ${queue} in ${duration} seconds (${rate} messages/second)`);
    await channel.close();
    await conn.close();
}

(async () => {
    await testQueues('classic_queue');
    await testQueues('quorum_queue');
})();