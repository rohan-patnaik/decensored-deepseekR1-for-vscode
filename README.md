
# Decensored DeepseekR1 for VSCode

Download the extension here: [Link](https://marketplace.visualstudio.com/items?itemName=rohan-patnaik.decensored-deepseekr1-for-vscode)

Decensored DeepseekR1 for VSCode transforms Visual Studio Code into our personal, local AI-powered chat assistant. This open-source extension leverages Deepseek R1-1776 from perplexity.ai, Ollama’s streaming API, and the flexibility to use custom GGUF models downloaded from Hugging Face. Now we can create and run our own local AI models right from the editor!

---

## Features

- **Interactive Chat Panel:** Launch a chat interface using the `Open Deepseek Chat` command.
- **Local AI Integration:** Interact with our custom AI models running locally via Ollama.
- **Custom Model Support:** Easily download GGUF models from Hugging Face, register them with Ollama, and use them as our personal AI assistant.
- **Real-Time Responses:** See our AI assistant’s responses update live as we type.

---

## Requirements

- **Visual Studio Code:** Version 1.84.2 (or later, if we upgrade).
- **Ollama:** Installed and configured on our system.
- **Node.js:** Installed on our system.
- Downloaded **Deepseek GGUF Model:**\
Download the GGUF model and save it as deepseek-r1_decensor_v1-gguf in Ollama for the extension to work properly.

---

You can get the guide from https://medium.com/@rohanpatnaik1997/how-to-run-a-hugging-face-gguf-model-locally-ollama-on-our-windows-machine-1c79b45e483a
on how to download a custom GGUF model from Hugging Face and integrate it with Ollama so we can use it in our VSCode extension.\
Just remember to save your gguf model as 'deepseek-r1_decensor_v1-gguf' for now in ollama for this extension to work properly.

---

## Using the VSCode Extension

Once our custom model is registered and running, we can use the extension as follows:

1. **Install the Extension:**  
   Download or install via the VSCode Marketplace.

2. **Launch the Chat Panel:**  
   Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the command **Open Deepseek Chat**.  
   The chat interface will open in a new panel.

3. **Start Chatting:**  
   Type a prompt into the input field and click **Submit** to receive a streaming response from our locally running custom model.

---

Enjoy the freedom of decensored open-source AI directly in your code editor! 

Take a look at the sample screen output below to see how the conversation interface looks like ->

![image](https://github.com/user-attachments/assets/4787d6b9-2cfb-465c-a47a-1299a518bc87)

---
