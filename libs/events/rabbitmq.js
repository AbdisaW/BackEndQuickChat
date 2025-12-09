const amqp = require('amqplib');

let connection;
let channel;

async function connect() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected successfully!');
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
  }
}

async function publish(queue, message) {
  if (!channel) await connect();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

async function consume(queue, callback) {
  if (!channel) await connect();
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
}

module.exports = { connect, publish, consume };
