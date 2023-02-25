const el = {};

/** Add a message to the page (in #message input element) */
function showMessage(message) {
  el.message.value = message.msg;
}

/** Get the message id from the URL */
function getMessageId() {
  return window.location.hash.substring(1);
}

/** Use fetch to get a JSON message from the server */
async function loadMessage() {
  const id = getMessageId();
  // fetch the message from the server
  const response = await fetch(`messages/${id}`);
  let message;
  if (response.ok) {
    message = await response.json();
  } else {
    message = { msg: 'failed to load messages :-(' };
  }
  showMessage(message);
}

/** Use fetch to put a JSON message to the server */
async function sendMessage() {
  const id = getMessageId();
  const payload = { id, msg: el.message.value };

  const response = await fetch(`messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    el.message.value = '';
    const updatedMessages = await response.json();
    showMessage(updatedMessages);
  } else {
    showMessage({ msg: 'failed to send message :-(' });
  }
}

/**
 * Page elements used in the program are
 * setup here for convenience.
 */
function prepareHandles() {
  el.message = document.querySelector('#message');
  el.send = document.querySelector('#send');
}

function pageLoaded() {
  prepareHandles();
  el.send.addEventListener('click', sendMessage);
  loadMessage();
}

pageLoaded();
