const messageTemplate = (message, opts = {}) => {
  return Object.assign(message, {
    quick_replies: opts.quickReplies,
    metadata: opts.metadata,
  });
};

const attachmentMessage = (type, payload, opts) => {
  return messageTemplate(
    {
      attachment: {
        type: type,
        payload: payload,
      },
    },
    opts
  );
};

module.exports = {
  textMessage: (text, opts) => messageTemplate({text}, opts),
  buttonMessage: (text, buttons, opts) => {
    return attachmentMessage(
      'template',
      {
        template_type: 'button',
        text,
        buttons,
      },
      opts
    );
  },
  genericTemplate: (elements, opts) => {
    return attachmentMessage(
      'template',
      {
        template_type: 'generic',
        elements,
      },
      opts
    );
  },
  listTemplate: (elements, opts = {}) => {
    return attachmentMessage(
      'template',
      {
        template_type: 'list',
        top_element_style: opts.topElementStyle || 'large',
        elements,
        buttons: opts.buttons || [],
      },
      opts
    );
  },
  imageMessage: (url, opts) => attachmentMessage('image', {url}, opts),
  videoMessage: (url, opts) => attachmentMessage('video', {url}, opts),
  audioMessage: (url, opts) => attachmentMessage('audio', {url}, opts),
  fileMessage: (url, opts) => attachmentMessage('file', {url}, opts),
};
