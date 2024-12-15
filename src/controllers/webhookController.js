import config from "@config/index.js";

class WebhookController {
    async handleIncoming(req, res) {
        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        if (message) {
            await messageHandler.handleIncomingMessage(message);
        }

        res.sendStatus(200);
    }

    async verifyWebhook(req, res) {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
            res.status(200).send(challenge);
            console.log('Webhook verified successfully!');
        } else {
            res.sendStatus(403);
        }
    }
}

export default new WebhookController();