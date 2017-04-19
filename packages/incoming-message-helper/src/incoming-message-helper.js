module.exports = {
  isTextMessage: messagingEvent => {
    return messagingEvent.message !== undefined &&
      !messagingEvent.message.is_echo &&
      !messagingEvent.message.quick_reply &&
      !messagingEvent.message.attachments &&
      messagingEvent.message.text;
  },
  isQuickReply: messagingEvent => {
    return messagingEvent.message !== undefined &&
      messagingEvent.message.quick_reply;
  },
  isAttachment: messagingEvent => {
    return messagingEvent.message !== undefined &&
      messagingEvent.message.attachments;
  },
  isEcho: messagingEvent => {
    return messagingEvent.message !== undefined &&
      messagingEvent.message.is_echo;
  },
  isReferral: messagingEvent => {
    return messagingEvent.referral !== undefined;
  },
  isPostback: messagingEvent => {
    return messagingEvent.postback !== undefined;
  },
  isOptin: messagingEvent => {
    return messagingEvent.optin !== undefined;
  },
  isAccountLinking: messagingEvent => {
    return messagingEvent.account_linking !== undefined;
  },
  isReadConfirmation: messagingEvent => {
    return messagingEvent.read !== undefined;
  },
  isDeliveryConfirmation: messagingEvent => {
    return messagingEvent.delivery !== undefined;
  },
};
