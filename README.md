# MBF-LINE-CONNECT

Microsoft Bot Framework (MBF) helps chatbot developers do cross-communication-platform development. Developers use [BotBuilder](https://github.com/Microsoft/BotBuilder) SDK to build and deploy a bot, then, the [Bot Connector](https://docs.botframework.com/en-us/csharp/builder/sdkreference/gettingstarted.html) helps the bot communicate with vary message platform. However, the Bot Connector hasn't support the LINE platform yet but the Bot Connector provides REST APIs for developers to manually support the unsupported platforms. This project is a showcase for LINE bot developers to leverage the MBF features by using these REST APIs (a.k.a. [Direct Line API](https://docs.botframework.com/en-us/restapi/directline3/)).

# Architecture

The architecture of this workaround can be drawn as this:

```
[Bot using MBF] <-- Direct Line --> [Line Bot] <--> (End User)
```

# Folders

* **botcore**: The bot built with BotBuilder.
* **linebot**: The LINE bot sample. It shows how LINE bots communicate with MBF bot through the [Direct Line API](https://docs.botframework.com/en-us/restapi/directline3/).

# Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.