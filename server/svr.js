import express from 'express';
import uuid from 'uuid-random';

const app = express();
// serve static files from the client directory with the .html extension
app.use(express.static('../client', { extensions: ['html'] }));

let messages = [
  { id: 'xnshfdsafasd', msg: 'these are three default messages', time: 'an hour ago' },
  { id: 'dskjdshkjhsd', msg: 'delivered from the server', time: 'yesterday' },
  { id: 'vcxbxcvfggzv', msg: 'using a custom route', time: 'last week' },
];

/* Find a message by id */
function findMessage(id) {
  for (const message of messages) {
    if (message.id === id) {
      return message;
    }
  }
  return null;
}

/* Respond to the request with all messages */
function getMessages(req, res) {
  res.json(messages);
}

/* Respond to the request (that contains the id of a message) with a message matching that id */
function getMessage(req, res) {
  const result = findMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

/**
 * Given a request that contains the msg for a new message,
 * create a new message and add it to the list of messages
 */
function postMessage(req, res) {
  const newMessage = {
    id: uuid(),
    time: Date(),
    msg: req.body.msg,
  };
  // messages = [newMessage, ...messages]; // add new message to front of array
  // messages = messages.slice(0, 9); // keep only the first 10 messages
  messages = [newMessage, ...messages.slice(0, 9)];
  res.json(messages);
}

/**
 * Given a request that contains a message object with an id,
 * find the message with that id and update it with the new message
 */
function putMessage(req, res) {
  const updatedMessage = req.body;
  const storedMessage = findMessage(updatedMessage.id);
  if (storedMessage == null) throw new Error('message not found');

  // update old message in place
  storedMessage.time = Date();
  storedMessage.msg = updatedMessage.msg;

  res.json(storedMessage);
}

app.get('/messages', getMessages);
app.get('/messages/:id', getMessage);
app.put('/messages/:id', express.json(), putMessage);
app.post('/messages', express.json(), postMessage);

app.listen(8080);
