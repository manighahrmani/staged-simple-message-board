const el = {};

/* Remove all contents from a given element */
function removeContentFrom(what) {
  what.textContent = '';
}

/* Add an array of messages to the page */
function showMessages(messages) {
  for (const message of messages) {
    const li = document.createElement('li');
    li.textContent = message.msg;

    const edit = document.createElement('a');
    edit.textContent = 'edit me';
    // takes the user to the edit page for the message (message.html)
    edit.href = `/message#${message.id}`;
    li.append(' (', edit, ')');

    el.messagelist.append(li);
  }
}

/** Use fetch to get a JSON message from the server */
async function loadMessages() {
  const response = await fetch('messages');
  let messages;
  if (response.ok) {
    messages = await response.json();
  } else {
    messages = [{ msg: 'failed to load messages :-(' }];
  }
  removeContentFrom(el.messagelist);
  showMessages(messages);
}

/** Use fetch to post a JSON message to the server */
async function sendMessage() {
  const payload = { msg: el.message.value };

  const response = await fetch('messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    el.message.value = '';
    const updatedMessages = await response.json();
    removeContentFrom(el.messagelist);
    showMessages(updatedMessages);
  } else {
    console.log('failed to send message', response);
  }
}

/**
 * Page elements used in the program are
 * setup here for convenience.
 */
function prepareHandles() {
  el.messagelist = document.querySelector('#messagelist');
  el.message = document.querySelector('#message');
  el.send = document.querySelector('#send');
}

function pageLoaded() {
  prepareHandles();
  el.send.addEventListener('click', sendMessage);
  loadMessages();
}

pageLoaded();
