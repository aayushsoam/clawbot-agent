import React, { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";

interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
}

const WELCOME_ASCII = `  _____ _                 _           _   
 / ____| |               | |         | |  
| |    | | __ _ _      __| |__   ___ | |_ 
| |    | |/ _\` \\ \\ /\\ / /| '_ \\ / _ \\| __|
| |____| | (_| |\\ V  V / | |_) | (_) | |_ 
 \\_____|_|\\__,_| \\_/\\_/  |_.__/ \\___/ \\__|`;

const QUICK_COMMANDS = [
  { label: "⚙️ Get Help", cmd: "/help" },
  { label: "🗂 Browse Skills", cmd: "/skills" },
  { label: "🤖 Active Model", cmd: "/model" },
  { label: "🩺 Diagnostic Status", cmd: "/status" },
  { label: "🌐 Gateway Configuration", cmd: "/gateway" }
];

export default function ChatPage(): React.JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState<"connecting" | "online" | "simulated">("connecting");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);

  // Guard against SSR hydration mismatches
  useEffect(() => {
    setIsMounted(true);
    
    // Add default initial welcome messages
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: WELCOME_ASCII + "\n\nWelcome to Clawbot Agent CLI Terminal. I am your self-improving AI agent, running in a dual-mode local sandbox.",
        timestamp: time
      },
      {
        id: "welcome-2",
        sender: "system",
        text: "System: Local sandbox active. Try typing `/help` or `/skills` below, or connect to your local clawbot daemon.",
        timestamp: time
      }
    ]);
  }, []);

  // Handle WebSocket Connection
  useEffect(() => {
    if (!isMounted) return;

    const connectWebSocket = () => {
      setStatus("connecting");
      const wsUrl = "ws://127.0.0.1:9119/api/ws";
      
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus("online");
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages(prev => [
            ...prev,
            {
              id: `sys-${Date.now()}`,
              sender: "system",
              text: "⚡ Successfully connected to active Clawbot gateway daemon (ws://127.0.0.1:9119/api/ws). Live CLI interaction is active!",
              timestamp: time
            }
          ]);
        };

        ws.onmessage = (event) => {
          setIsTyping(false);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          try {
            const data = JSON.parse(event.data);
            const textContent = data.text || data.content || JSON.stringify(data);
            setMessages(prev => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: textContent,
                timestamp: time
              }
            ]);
          } catch (e) {
            setMessages(prev => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: event.data,
                timestamp: time
              }
            ]);
          }
        };

        ws.onerror = () => {
          setStatus("simulated");
        };

        ws.onclose = () => {
          setStatus("simulated");
          // Attempt reconnect after 15 seconds
          reconnectTimerRef.current = setTimeout(connectWebSocket, 15000);
        };
      } catch (err) {
        setStatus("simulated");
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [isMounted]);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Custom high-fidelity terminal simulated responses
  const getSimulatedResponse = (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const cleanText = text.trim();
      const lowerText = cleanText.toLowerCase();
      
      // Deliberate delay to simulate typing/processing
      const delay = Math.max(500, Math.min(2000, cleanText.length * 15));

      setTimeout(() => {
        // 1. Slash Command Handlers
        if (cleanText.startsWith("/")) {
          const cmd = cleanText.split(" ")[0].toLowerCase();
          
          switch (cmd) {
            case "/help":
              resolve(
                `🔧 **Clawbot Interactive CLI Shell v0.14.0**\n\n` +
                `Here is a list of active commands you can run in this terminal:\n` +
                `- \`/skills\`   - List active scientific and general tools\n` +
                `- \`/model\`    - Get current model state or change default provider\n` +
                `- \`/status\`   - View system diagnostics and python venv diagnostics\n` +
                `- \`/gateway\`  - Show messaging channel configurations (Telegram, Discord)\n` +
                `- \`/clear\`    - Clear chat history\n\n` +
                `*Tip: You can also chat normally in Hinglish, English, or ask coding questions!*`
              );
              return;

            case "/skills":
              resolve(
                `🗂 **Active Skills & Tool Registry**\n\n` +
                `Clawbot has loaded **36 specialized skills** in this workspace:\n\n` +
                `1. **alphafold-database-fetch-and-analyze** [Built-in]\n` +
                `   - Retrives 3D predicted structures, assesses domain boundaries & pLDDT confidence metrics.\n` +
                `2. **chembl-database** [Built-in]\n` +
                `   - Queries bioactivity data, IC50 values, molecular targets, and approved drugs.\n` +
                `3. **literature-search-openalex** [Built-in]\n` +
                `   - Search 250M+ scholarly papers, resolve DOIs, and aggregate author metrics.\n` +
                `4. **dbsnp-database** [Built-in]\n` +
                `   - Resolves clinical significance and mapping for genomic variants.\n` +
                `5. **reactome-database** [Built-in]\n` +
                `   - Queries biochemical pathways, inputs/outputs, and molecular cascades.\n\n` +
                `*To explore detailed documentation or search all skills, visit the [Skills](/skills) tab in the header.*`
              );
              return;

            case "/model":
              const args = cleanText.split(" ");
              if (args.length > 1) {
                const newModel = args.slice(1).join(" ");
                resolve(`✓ **Success:** Model configuration updated. Configured default provider to \`${newModel}\`.`);
              } else {
                resolve(
                  `🤖 **AI Provider Configuration**\n\n` +
                  `- **Current Active Model:** \`Gemini 3.5 Flash\` (Highly Optimized)\n` +
                  `- **Supported CLI Model Backends:**\n` +
                  `  - \`qwen/qwen-2.5-72b-instruct\`\n` +
                  `  - \`gpt-4o-mini\`\n` +
                  `  - \`gemini-1.5-pro\`\n\n` +
                  `*Change default model locally using command: \`clawbot config set model.default <model_name>\`*`
                );
              }
              return;

            case "/status":
              resolve(
                `🩺 **Clawbot Doctor — Health Check Status**\n\n` +
                `\`\`\`text\n` +
                `◆ Security Advisories: ✓ No active security advisories\n` +
                `◆ Python Environment:  ✓ Python 3.11.15 (Venv Active)\n` +
                `◆ Required Packages:   ✓ OpenAI SDK, Rich UI, python-dotenv, PyYAML, HTTPX\n` +
                `◆ Optional Packages:   ⚠ python-telegram-bot (Not installed), ⚠ discord.py\n` +
                `◆ Web Daemon State:    ✓ Port 9119 (Simulated browser client loopback)\n` +
                `\`\`\``
              );
              return;

            case "/gateway":
              resolve(
                `🌐 **Messaging Gateway Configuration**\n\n` +
                `Clawbot can connect to external messaging apps so you can chat from anywhere:\n` +
                `- **Telegram Bot:** \`Disconnected\` (Configure API token via \`clawbot setup gateway\`)\n` +
                `- **Discord Bot:** \`Disconnected\`\n` +
                `- **Web Console:** \`Connected\` (Simulation Session Active)\n\n` +
                `*Tip: Run \`clawbot setup gateway\` in your computer terminal to sync credentials.*`
              );
              return;

            case "/clear":
              resolve("__CLEAR__");
              return;

            default:
              resolve(`❌ **Error:** Command \`${cmd}\` is not recognized. Type \`/help\` for a list of available actions.`);
              return;
          }
        }

        // 2. Hindi/Urdu/Hinglish Friendly Responses
        if (
          lowerText.includes("kaise") || 
          lowerText.includes("yar") || 
          lowerText.includes("kya") || 
          lowerText.includes("chal") || 
          lowerText.includes("karo") ||
          lowerText.includes("swagat") ||
          lowerText.includes("namaste")
        ) {
          if (lowerText.includes("color") || lowerText.includes("colour") || lowerText.includes("website")) {
            resolve(
              `Arre yar! Meri website ka theme bilkul sleek **"Amber-on-Dark"** terminal look me hai. 😎\n\n` +
              `- Background ka primary color hai deep space black \`#07070d\`.\n` +
              `- Highlights aur prompt symbols ka color hai bright Amber Gold \`#FFD700\`.\n` +
              `- Code boxes and surfaces are deep navy \`#0f0f18\`.\n\n` +
              `Yeh combination perfect futuristic CLI console wala feel deta hai!`
            );
          } else {
            resolve(
              `Aapka swagat hai! Main Clawbot hoon, aapka self-improving AI agent. 🚀\n\n` +
              `Yar, main python scripts run karne, database query karne, literature filter karne, aur complex workflows manage karne me madad kar sakta hoon.\n\n` +
              `Ek baar \`/skills\` ya \`/status\` command chala kar dekhiye ki main browser me kaise perform kar raha hoon!`
            );
          }
          return;
        }

        // 3. Question about color/theme
        if (lowerText.includes("color") || lowerText.includes("colour") || lowerText.includes("theme")) {
          resolve(
            `🎨 **Clawbot Theme Palette Details:**\n\n` +
            `- **Background:** \`#07070d\` (Deep Cosmic Indigo/Black)\n` +
            `- **Surfaces & Cards:** \`#0f0f18\` (High-contrast Navy)\n` +
            `- **Terminal Glow & Prompts:** \`#FFD700\` (Amber Gold, passes readability guidelines)\n` +
            `- **Fonts:** Modern typography utilizing *Inter* for body and *JetBrains Mono* for code/inputs.\n\n` +
            `This premium palette replicates state-of-the-art developer consoles and reduces eye strain during long workflows.`
          );
          return;
        }

        // 4. Code / Agent Trajectory Simulations
        if (lowerText.includes("code") || lowerText.includes("python") || lowerText.includes("script") || lowerText.includes("write")) {
          resolve(
            `🔍 **[Research]** Searching workspace for python routines...\n` +
            `⚙️ **[Executing Tool]** Running python interpreter sandbox...\n\n` +
            `Here is a clean helper code structure for managing Clawbot pipelines:\n` +
            `\`\`\`python\n` +
            `import os\n` +
            `from clawbot.agent import ClawbotAgent\n\n` +
            `# Initialize agent in terminal mode\n` +
            `agent = ClawbotAgent(model="gemini-3.5-flash")\n` +
            `response = agent.run("Verify all active gateway channels")\n` +
            `print(f"Clawbot response: {response}")\n` +
            `\`\`\``
          );
          return;
        }

        // 5. Default General Response
        resolve(
          `Hello! I am Clawbot. I can execute advanced research algorithms, database hooks, and local scripts.\n\n` +
          `Because the web server is currently in **Simulated Mode**, I am executing in your local browser engine. ` +
          `To experience live execution, run the Clawbot daemon locally:\n` +
          `\`\`\`bash\n` +
          `clawbot serve --port 9119\n` +
          `\`\`\`\n` +
          `Type \`/help\` to explore other interactive console tools!`
        );
      }, delay);
    });
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;

    // Add user message to state
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: text,
        timestamp: time
      }
    ]);

    setInputValue("");

    // If live WebSocket is connected
    if (status === "online" && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setIsTyping(true);
      try {
        wsRef.current.send(JSON.stringify({ type: "message", content: text }));
      } catch (e) {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "system",
            text: "System: Error transmitting message to daemon. Falling back to simulation.",
            timestamp: time
          }
        ]);
        setStatus("simulated");
      }
    } else {
      // Offline Simulated Mode
      setIsTyping(true);
      const simulatedRes = await getSimulatedResponse(text);
      setIsTyping(false);

      if (simulatedRes === "__CLEAR__") {
        setMessages([
          {
            id: "welcome-1",
            sender: "bot",
            text: WELCOME_ASCII + "\n\nWelcome to Clawbot Agent CLI Terminal. History cleared successfully.",
            timestamp: time
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: simulatedRes,
            timestamp: time
          }
        ]);
      }
    }
  }, [status]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : "";
        const code = match ? match[2] : part.slice(3, -3);
        return (
          <pre key={index}>
            <code className={lang ? `language-${lang}` : ""}>{code}</code>
          </pre>
        );
      } else if (part.startsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      } else {
        return part.split("\n").map((line, lineIndex) => (
          <p key={`${index}-${lineIndex}`} style={{ margin: "0 0 0.5rem 0" }}>
            {line}
          </p>
        ));
      }
    });
  };

  if (!isMounted) {
    return (
      <Layout title="CLI Terminal Chat" description="Interactive Clawbot Agent Chat Console">
        <div style={{ backgroundColor: "#07070d", minHeight: "80vh" }} />
      </Layout>
    );
  }

  return (
    <Layout title="CLI Terminal Chat" description="Interactive Clawbot Agent Chat Console">
      <main className={styles.page}>
        <div className={styles.glowEffect} />
        
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleArea}>
              <span className={styles.terminalIcon}>⌨_</span>
              <h1 className={styles.title}>Clawbot CLI Terminal</h1>
            </div>
            
            <div className={styles.statusIndicator}>
              <div 
                className={`${styles.statusDot} ${status === "online" ? styles.statusDotOnline : ""}`} 
                style={{ 
                  backgroundColor: status === "online" ? "#10b981" : status === "connecting" ? "#fbbf24" : "#fbbf24",
                  boxShadow: status === "online" ? "0 0 8px #10b981" : "0 0 8px #fbbf24"
                }}
              />
              <span>
                {status === "online" 
                  ? "Connected Live" 
                  : status === "connecting" 
                    ? "Searching Daemon..." 
                    : "Simulated Mode"}
              </span>
            </div>
          </div>

          {/* Main Chat Window */}
          <div className={styles.chatWindow}>
            {/* Messages List Area */}
            <div className={styles.messagesArea}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.message} ${
                    msg.sender === "user" 
                      ? styles.userMessage 
                      : msg.sender === "bot" 
                        ? styles.botMessage 
                        : styles.systemMessage
                  }`}
                >
                  {msg.sender !== "system" && (
                    <div className={styles.messageHeader}>
                      <span className={styles.promptSymbol}>
                        {msg.sender === "user" ? "clawbot-user$" : "clawbot$"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  <div 
                    className={`${styles.messageBubble} ${
                      msg.sender === "user" 
                        ? styles.userBubble 
                        : msg.sender === "bot" 
                          ? styles.botBubble 
                          : ""
                    }`}
                  >
                    {msg.sender === "system" ? (
                      <span style={{ color: "#60a5fa" }}>{msg.text}</span>
                    ) : (
                      formatMessageText(msg.text)
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className={`${styles.message} ${styles.botMessage}`}>
                  <div className={styles.messageHeader}>
                    <span className={styles.promptSymbol}>clawbot$</span>
                    <span>typing...</span>
                  </div>
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Command Chips */}
            <div style={{ padding: "0 1.5rem", background: "#0f0f18" }}>
              <div className={styles.commandList}>
                {QUICK_COMMANDS.map((chip, idx) => (
                  <button 
                    key={idx} 
                    className={styles.commandChip}
                    onClick={() => {
                      if (!isTyping) {
                        setInputValue(chip.cmd);
                        handleSendMessage(chip.cmd);
                      }
                    }}
                    disabled={isTyping}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <div className={styles.inputArea}>
              <div className={`${styles.inputWrapper} ${isFocused ? styles.inputWrapperFocused : ""}`}>
                <span className={styles.inputPrefix}>$</span>
                <textarea
                  className={styles.inputBox}
                  placeholder="Ask a question or enter a slash command (e.g. /help)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isTyping}
                  rows={1}
                />
              </div>

              <button 
                className={`${styles.sendButton} ${(!inputValue.trim() || isTyping) ? styles.sendButtonDisabled : ""}`}
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <span>Run</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Guidelines */}
          <div className={styles.footerHint}>
            Sync CLI with live daemon locally by running <code>clawbot serve</code>.
          </div>
        </div>
      </main>
    </Layout>
  );
}
