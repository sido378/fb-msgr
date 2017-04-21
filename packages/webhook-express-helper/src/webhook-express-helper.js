const crypto = require('crypto');

/**
 * Offers helper function for handling and verifying incoming requests
 * via the express web framework
 */
class WebhookHelperExpress {
  /**
   * Creates an instance of WebhookHelperExpress
   * @param {string} appSecret Facebook App Secret used to verify incoming
   *   webhook requests
   * @param {string} verifyToken used to verify Webhook setup()
  */
  constructor(appSecret, verifyToken) {
    this.appSecret = appSecret;
    this.verifyToken = verifyToken;

    this.verifyWebhookSetup = this.verifyWebhookSetup.bind(this);
    this.verifyWebhookRequest = this.verifyWebhookRequest.bind(this);
    this.handleWebhookEvent = this.handleWebhookEvent.bind(this);
  }

  /**
   * Verify that GET request contains specified verifyToken
   * and responds with sent challenge
   * @param {object} req
   * @param {object} res
   * @param {string} verifyToken
   */
  verifyWebhookSetup(req, res, verifyToken) {
    if (
      req.query['hub.verify_token'] === (verifyToken || this.verifyToken) &&
      req.query['hub.mode'] === 'subscribe'
    ) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
  }

  /**
   * Verify if POST request really comes from Facebook.
   * The x-hub-signature header should contain a hash matching
   * a sha1 Hash created from the body with the Facebook App Secret as key
   * @param {object} req
   * @param {object} res
   * @param {buffer} buffer
   * @param {string} encoding
   */
  verifyWebhookRequest(req, res, buffer, encoding) {
    if (!this.appSecret) {
      return;
    } else {
      let expected = crypto
        .createHmac('sha1', this.appSecret)
        .update(buffer)
        .digest('hex');

      let received = req.headers['x-hub-signature'].split('sha1=')[1];
      if (crypto.timingSafeEqual(new Buffer(received), new Buffer(expected))) {
        throw new Error('Failed verifying webhook request');
      }
    }
  }

  /**
   * Iterates over every entry and every message event in the request body and
   * dispatches the messageEventHandler for every message event
   * @param {object} req
   * @param {object} res
   * @param {function} messageEventHandler
   */
  handleWebhookEvent(req, res, messageEventHandler) {
    res.sendStatus(200);
    if (req.body.entry) {
      req.body.entry.forEach(entry => {
        if (entry.messaging) {
          entry.messaging.forEach(messagingEvent => {
            messageEventHandler(messagingEvent);
          });
        }
      });
    }
  }
}

module.exports = WebhookHelperExpress;
