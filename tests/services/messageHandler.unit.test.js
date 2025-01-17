import { faker } from "@faker-js/faker";
import whatsappService from "@services/whatsappService";
import messageHandler from "@services/messageHandler";
import googleSheetsService from "@services/googleSheetsService";
import MessageBuilder from "@builders/messageBuilder";
import TextBuilder from "@builders/textBuilder";
import SenderInfoBuilder from "@builders/senderInfoBuilder";
import ProfileBuilder from "@builders/profileBuilder";
import config from "@config";

jest.mock("@services/openAIService", () => {
  return jest.fn().mockImplementation(() => {
    return "What is your pet's name?";
  });
});

describe("Unit test suite for messageHandler", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  test("Should handle incoming message and mark as read", async () => {
    const messageMock = new MessageBuilder().build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    const sendWelcomeMenuSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).toHaveBeenCalled();
    expect(sendMessageSpyOn).toHaveBeenCalled();
    expect(sendWelcomeMenuSpyOn).toHaveBeenCalled();
  });

  test("Should handle incoming message and mark as read", async () => {
    const messageMock = new MessageBuilder().build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    const sendWelcomeMenuSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).toHaveBeenCalled();
    expect(sendMessageSpyOn).toHaveBeenCalled();
    expect(sendWelcomeMenuSpyOn).toHaveBeenCalled();
  });

  test("Should handle incoming different to a message type text and not doing nothing", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "is-not-text")
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    const sendWelcomeMenuSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).not.toHaveBeenCalled();
    expect(sendMessageSpyOn).not.toHaveBeenCalled();
    expect(sendWelcomeMenuSpyOn).not.toHaveBeenCalled();
  });

  test("Should handle incoming message different to a greeting", async () => {
    const messageText = faker.lorem.sentence();
    const messageMock = new MessageBuilder()
      .withParam(
        "text",
        new TextBuilder().withParam("body", messageText).build()
      )
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    const sendWelcomeMenuSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).toHaveBeenCalled();
    expect(sendWelcomeMenuSpyOn).not.toHaveBeenCalled();
  });

  test("Should send a greeting message without a name if it is not defined", async () => {
    const expectedArgs = [
      "user",
      "Hello 12345678, Welcome to Medpet, your online Pet Shop 🐕🐈🦜. How can I help you, today?",
      "1",
    ];
    const messageMock = new MessageBuilder().build();
    const senderInfoMock = new SenderInfoBuilder()
      .withParam(
        "profile",
        new ProfileBuilder().withParam("name", undefined).build()
      )
      .build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    const sendWelcomeMenuSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).toHaveBeenCalled();
    expect(sendMessageSpyOn).toHaveBeenCalledWith(...expectedArgs);
    expect(sendWelcomeMenuSpyOn).toHaveBeenCalled();
  });

  test("Should process a message type interactive", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          title: "option_1",
        },
      })
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const handleMenuOptionSpyOn = jest
      .spyOn(messageHandler, "handleMenuOption")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(markAsReadSpyOn).toHaveBeenCalled();
    expect(handleMenuOptionSpyOn).toHaveBeenCalled();
  });

  test("Should process an interactive request for schedule appointment", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          id: "option_1",
          title: "sheduled ✅",
        },
      })
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "Please, could you type your name?"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an interactive request for a request", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          id: "option_2",
          title: "request 🤔",
        },
      })
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "What is your request?"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an interactive request for a location", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          id: "option_3",
          title: "location 📍",
        },
      })
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "This is our location"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an interactive request for a emergency", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          id: "option_6",
          title: "emergency 🚨",
        },
      })
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "If this is an emergency, we invite you to call our attention line"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an interactive request with an error when is a incorrect option", async () => {
    const messageMock = new MessageBuilder()
      .withParam("type", "interactive")
      .withParam("interactive", {
        button_reply: {
          title: "fake option",
        },
      })
      .build();
    const consoleLogWarnSpyOn = jest.spyOn(console, "warn");
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      null
    );
    expect(consoleLogWarnSpyOn).toHaveBeenCalledWith("Sorry, we didn't understand that option");
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process a media request and return an audio media", async () => {
    const sendMediaSpyOn = jest
      .spyOn(whatsappService, "sendMediaMessage")
      .mockResolvedValue(true);
    jest
      .spyOn(googleSheetsService, "appendToSheet")
      .mockResolvedValue("Data added successfully");
    const messageMock = new MessageBuilder()
      .withParam("text", new TextBuilder().withParam("body", "audio").build())
      .build();
    const argsExpected = [
      messageMock.from,
      "audio",
      `${config.CDN_BASE_URL}/medpet-audio.aac`,
      "Welcome 🔉",
    ];
    const senderInfoMock = new SenderInfoBuilder().build();

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMediaSpyOn).toHaveBeenCalledWith(...argsExpected);
  });

  test("Should process an appointment flow to get the name for schedule", async () => {
    const messageMock = new MessageBuilder()
      .withParam("text", new TextBuilder().withParam("body", "name").build())
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.appointmentState = {
      [messageMock.from]: {
        step: "name",
      },
    };
    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "What is your pet's name?"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an appointment flow to get the step petName", async () => {
    const messageMock = new MessageBuilder()
      .withParam("text", new TextBuilder().withParam("body", "name").build())
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.appointmentState = {
      [messageMock.from]: {
        step: "petName",
      },
    };
    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "What type of pet do you have? for example: dog, cat, bird"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an appointment flow to get the step petType", async () => {
    const messageMock = new MessageBuilder()
      .withParam("text", new TextBuilder().withParam("body", "name").build())
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.appointmentState = {
      [messageMock.from]: {
        step: "petType",
      },
    };

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "Which is the reason for your request?"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an appointment flow to get the step name", async () => {
    const messageMock = new MessageBuilder()
      .withParam("text", new TextBuilder().withParam("body", "name").build())
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.appointmentState = {
      [messageMock.from]: {
        step: "name",
      },
    };

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalledWith(
      messageMock.from,
      "What is your pet's name?"
    );
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an appointment flow to get the step reason", async () => {
    const messageMock = new MessageBuilder()
      .withParam(
        "text",
        new TextBuilder().withParam("body", faker.lorem.sentence()).build()
      )
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const markAsReadSpyOn = jest
      .spyOn(whatsappService, "markAsRead")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.appointmentState = {
      [messageMock.from]: {
        step: "reason",
      },
    };

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalled();
    expect(markAsReadSpyOn).toHaveBeenCalled();
  });

  test("Should process an assistant flow to get the step question", async () => {
    const messageMock = new MessageBuilder()
      .withParam(
        "text",
        new TextBuilder().withParam("body", faker.lorem.sentence()).build()
      )
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const sendInteractiveButtonSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.assistantState = {
      [messageMock.from]: {
        step: "question",
      },
    };

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalled();
    expect(sendInteractiveButtonSpyOn).toHaveBeenCalled();
  });

  test("Should process an assistant flow to without any step", async () => {
    const messageMock = new MessageBuilder()
      .withParam(
        "text",
        new TextBuilder().withParam("body", faker.lorem.sentence()).build()
      )
      .build();
    const senderInfoMock = new SenderInfoBuilder().build();
    const sendInteractiveButtonSpyOn = jest
      .spyOn(whatsappService, "sendInteractiveButtons")
      .mockResolvedValue(true);
    const sendMessageSpyOn = jest
      .spyOn(whatsappService, "sendMessage")
      .mockResolvedValue(true);
    messageHandler.assistantState = {
      [messageMock.from]: {
        step: undefined,
      },
    };

    await messageHandler.handleIncomingMessage(messageMock, senderInfoMock);

    expect(sendMessageSpyOn).toHaveBeenCalled();
    expect(sendInteractiveButtonSpyOn).toHaveBeenCalled();
  });
});
