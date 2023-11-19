const {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} = require("@aws-sdk/client-lex-runtime-v2");

exports.handler = async function (event) {
  console.log(event);

  const response = {
    sessionState: {
      sessionAttributes: {
        key: "hi",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content:
          "Welcome to our Table Reservation Service! How can I assist you today?",
      },
    ],
  };

  const lexClient = new LexRuntimeV2Client({ region: "us-east-1" });
  const params = {
    botAliasId: "TSTALIASID",
    botId: "GALF77JWIJ",
    localeId: "en_US",
    sessionId: event.sessionId,
    messages: response.messages,
  };

  try {
    const command = new RecognizeTextCommand(params);
    await lexClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Lex response sent successfully." }),
    };
  } catch (error) {
    console.error("Error sending Lex response:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
