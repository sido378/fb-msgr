const fetch = require('node-fetch');
const queryString = require('query-string');

const BASE_URL = 'https://graph.facebook.com';
const API_VERSION = 'v2.8';

const getAPI = (endpoint, queryParams) => {
  if (!queryParams.accessToken) {
    return Promise.reject({error: 'Missing page access token'});
  }
  return fetch(
    `${BASE_URL}/${API_VERSION}/${endpoint}?` +
      queryString.stringify(queryParams),
    {
      headers: {'Content-Type': 'application/json'},
    }
  )
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        return Promise.reject(json.error);
      } else {
        return json;
      }
    });
};

const postAPI = (endpoint, body, queryParams) => {
  if (!queryParams.accessToken) {
    return Promise.reject({error: 'Missing page access token'});
  }
  return fetch(
    `${BASE_URL}/${API_VERSION}/${endpoint}?` +
      queryString.stringify(queryParams),
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    }
  )
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        return Promise.reject(json.error);
      } else {
        return json;
      }
    });
};

const deleteAPI = (endpoint, body, queryParams) => {
  if (!queryParams.accessToken) {
    return Promise.reject({error: 'Missing page access token'});
  }
  return fetch(
    `${BASE_URL}/${API_VERSION}/${endpoint}?` +
      queryString.stringify(queryParams),
    {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    }
  )
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        return Promise.reject(json.error);
      } else {
        return json;
      }
    });
};

/**
 * Offers wrapper functions for the Facebook Messenger Plattform API
 */
class MessengerApi {
  /**
   * Initialize an instance with a Facebook Page Access Token or pass
   * an access tokens on every function call
   * @param {string} [accessToken] - Pass an Facebook Page Access Token to bind
   *                                 this instance to a specific page
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Sends specified message to user
   * see https://developers.facebook.com/docs/messenger-platform/send-api-reference
   * @param {String} id        - Page scoped user id
   * @param {Object} message   - Message object sent to the user
   * @param {Object} [opts={}] - Object that might contain:
   *                               notificationType - Specify what notification
   *                                                  the user receives
   *                               tag              - Specify a message tag
   *                               accessToken      - Specify the sending page
   *
   * @return {Promise} resolves to json containing recipient_id, message_id
   *                   and optionally attachment_id
   */
  sendMessage(id, message, opts = {}) {
    return postAPI(
      'me/messages',
      {
        recipient: {
          id: id,
        },
        message: message,
        notification_type: opts.notificationType || 'REGULAR',
        tag: opts.tag,
      },
      {
        access_token: opts.accessToken || this.accessToken,
      }
    );
  }

  /**
   * Sends specified sender action to user
   * see https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
   * @param {String} id           - Page scoped user id
   * @param {Object} senderAction - Message object sent to the user
   * @param {Object} [opts={}]    - Object that might contain:
   *                                  accessToken - Specify the sending page
   *
   * @return {Promise} resolves to json containing recipient_id
   */
  sendSenderAction(id, senderAction, opts = {}) {
    return postAPI(
      'me/messages',
      {
        recipient: {
          id: id,
        },
        sender_action: senderAction,
      },
      {
        access_token: opts.accessToken || this.accessToken,
      }
    );
  }

  /**
   * Fetches a users profile
   * see https://developers.facebook.com/docs/messenger-platform/user-profile
   * @param {string} id        - Page scoped user id
   * @param {Object} [opts={}] - Object that might contain:
   *                               accessToken - Specify the sending page
   *
   * @return {Promise} Resolves to user profile json
   */
  getUserProfile(id, opts = {}) {
    return getAPI(id, {
      access_token: opts.accessToken || this.accessToken,
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender,' +
        'is_payment_enabled,last_ad_referral',
    });
  }

  /**
   * Sets the Messenger Profile
   * see https://developers.facebook.com/docs/messenger-platform/messenger-profile
   * @param {Object} profile   - Messenger profile to be set
   * @param {Object} [opts={}] - Object that might contain:
   *                               accessToken - Specify the sending page
   *
   * @return {Promise} Resolves to success json
   */
  setMessengerProfile(profile, opts = {}) {
    return postAPI('me/messenger_profile', profile, {
      access_token: opts.accessToken || this.accessToken,
    });
  }

  /**
   * Fetches the messenger profile
   * see https://developers.facebook.com/docs/messenger-platform/messenger-profile
   * @param {Object} [opts={}] - Object that might contain:
   *                               fields      - String of comma-seperated
   *                                             fields to fetch
   *                               accessToken - Specify the sending page
   *
   * @return {Promise} Resolves to json containing the messenger profile
   */
  getMessengerProfile(opts = {}) {
    return getAPI('me/messenger_profile', {
      fields: opts.fields ||
        'persistent_menu,get_started,greeting,whitelisted_domains,' +
          'account_linking_url,payment_settings,target_audience',
      access_token: opts.accessToken || this.accessToken,
    });
  }

  /**
   * Deletes the messenger profile
   * see https://developers.facebook.com/docs/messenger-platform/messenger-profile
   * @param {Object} [opts={}] - Object that might contain:
   *                               fields      - Array of fields to delete
   *                               accessToken - Specify the sending page
   *
   * @return {Promise} Resolves to success json
   */
  deleteMessengerProfile(opts = {}) {
    return deleteAPI(
      'me/messenger_profile',
      {
        fields: opts.fields || [
          'persistent_menu',
          'get_started',
          'greeting',
          'whitelisted_domains',
          'account_linking_url',
          'payment_settings',
          'target_audience',
        ],
      },
      {
        access_token: opts.accessToken || this.accessToken,
      }
    );
  }

  /**
   * Uploads specified attachment via Upload API and returns Attachment ID
   * see https://developers.facebook.com/docs/messenger-platform/send-api-reference/attachment-upload
   * @param {String} type       - Type of attachment
   * @param {String} url        - Attachment URL
   * @param {Object} [opts={}]  - Object that might contain:
   *                                accessToken - Specify the sending page
   *
   * @return {Promise} resolves to json containing attachment_id
   */
  uploadAttachment(type, url, opts = {}) {
    return postAPI(
      'me/message_attachments',
      {
        message: {
          attachment: {
            type: type,
            payload: {
              url: url,
              is_reusable: true,
            },
          },
        },
      },
      {
        access_token: opts.accessToken || this.accessToken,
      }
    );
  }
}

module.exports = MessengerApi;
