// --- Chatbot Floating Icon and Window Logic ---

// Get DOM elements
const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotWindow = document.getElementById("chatbot-window");
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");
const chatbotBody = chatbotWindow.querySelector(".chatbot-body");

// Show chatbot window when icon is clicked
chatbotIcon.addEventListener("click", () => {
  chatbotWindow.classList.add("active");
  chatbotBody.style.display = "flex";
  minimizeBtn.style.display = "inline";
});

// Minimize chatbot window
minimizeBtn.addEventListener("click", () => {
  chatbotBody.style.display = "none";
  minimizeBtn.style.display = "none";
});

// Restore chatbot window when header is clicked (if minimized)
chatbotWindow
  .querySelector(".chatbot-header")
  .addEventListener("click", (e) => {
    if (chatbotBody.style.display === "none" && e.target.tagName !== "BUTTON") {
      chatbotBody.style.display = "flex";
      minimizeBtn.style.display = "inline";
    }
  });

// Close chatbot window
closeBtn.addEventListener("click", () => {
  chatbotWindow.classList.remove("active");
  chatbotBody.style.display = "flex";
  minimizeBtn.style.display = "inline";
});

// --- Simple Chatbot Logic ---
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindowDiv = document.getElementById("chatWindow");

// Helper to add a message to the chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "msg " + sender;
  msgDiv.textContent = text;
  chatWindowDiv.appendChild(msgDiv);
  chatWindowDiv.scrollTop = chatWindowDiv.scrollHeight;
}

// Handle form submit
chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";

  // Fetch reply from Cloudflare Worker API
  try {
    // Show a loading message while waiting for the API
    addMessage("...", "ai");
    const response = await fetch(
      "https://loreal-chatbot.za209.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );
    // Remove the loading message
    const loadingMsg = chatWindowDiv.querySelector(".msg.ai:last-child");
    if (loadingMsg && loadingMsg.textContent === "...") {
      chatWindowDiv.removeChild(loadingMsg);
    }
    if (!response.ok) {
      addMessage("Sorry, there was a problem. Please try again later.", "ai");
      return;
    }
    const data = await response.json();
    // Show the API's reply (assume 'reply' property)
    addMessage(data.reply || "Sorry, I didn't understand that.", "ai");
  } catch (error) {
    // Remove the loading message if error
    const loadingMsg = chatWindowDiv.querySelector(".msg.ai:last-child");
    if (loadingMsg && loadingMsg.textContent === "...") {
      chatWindowDiv.removeChild(loadingMsg);
    }
    addMessage("Sorry, there was a problem connecting to the chatbot.", "ai");
  }
});
