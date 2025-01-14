import axios from "axios";
import config from "@config/index.js";

class WhatsappService {
  async sendMessage(to, body, messageId) {
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to,
          text: { body }
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async markAsRead(messageId) {
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }

  async sendInteractiveButtons(to, bodyText, buttons) {
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: bodyText
            },
            action: {
              buttons
            }
          }
        },
      });
    } catch (error) {
      console.error(`Error ocurred render the buttons: ${error}`);
    }
  }

  async sendMediaMessage(to, type, mediaUrl, caption) {
    try {
      const mediaObject = {};

      switch(type) {
        case 'image':
          mediaObject.image = {
            link: mediaUrl,
            caption
          };
          break;
        case 'audio':
          mediaObject.audio = {
            link: mediaUrl
          };
          break;
        case 'video':
          mediaObject.video = {
            link: mediaUrl,
            caption
          };
          break;
        case 'document':
          mediaObject.document = {
            link: mediaUrl,
            caption,
            filename: 'medpet.pdf'
          };
          break;
        default:
          throw new Error('Invalid media type');
      }

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to,
          type,
          ...mediaObject
        },
      });
    }
    catch(error) {
      console.error(`Error ocurred sending media message: ${error}`);
    }
  }

  async sendContactMessage(to, contact) {
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to,
          type: 'contacts',
          contacts: [contact]
        },
      });
    }
    catch(error) {
      console.error(`Error ocurred sending contact message: ${error}`);
    }
  }
}

export default new WhatsappService();
