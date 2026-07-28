import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, Sparkles, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Terminal, Webhook, Cpu,
  KeyRound, CheckCircle2, ExternalLink, Copy, Check
} from 'lucide-react';
import { ENV } from '../../config/env';

// n8n webhook — proxied through Vite to avoid CORS (see vite.config.js)
// The real URL is read from VITE_N8N_WEBHOOK_URL in .env
const N8N_CHAT_WEBHOOK = ENV.N8N_WEBHOOK_URL || null;
const isN8nConnected = !!N8N_CHAT_WEBHOOK && !N8N_CHAT_WEBHOOK.includes('placeholder');
// Use Vite proxy path in dev; direct URL in production
const N8N_FETCH_URL = import.meta.env.DEV ? '/api/n8n' : N8N_CHAT_WEBHOOK;

/* ── Setup steps data ── */
const setupSteps = [
  {
    num: '01',
    icon: Terminal,
    title: 'Install & Start n8n',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    commands: [
      'npm install -g n8n',
      'n8n start',
    ],
    note: 'Opens n8n editor at http://localhost:5678',
  },
  {
    num: '02',
    icon: Webhook,
    title: 'Import the AI Workflow',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    description: 'In n8n → Workflows → Import from file',
    file: 'n8n/workflows/ask-ai-chat.json',
    note: 'Workflow: Webhook → OpenAI → Respond to Webhook',
  },
  {
    num: '03',
    icon: KeyRound,
    title: 'Add your OpenAI API Key',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    description: 'In n8n → Settings → Credentials → New → OpenAI API',
    link: 'https://platform.openai.com/api-keys',
    linkLabel: 'Get API key →',
    note: 'Supports GPT-4o-mini, GPT-4o, GPT-3.5-turbo',
  },
  {
    num: '04',
    icon: Cpu,
    title: 'Connect to MediBook',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    envLine: 'VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ask-ai',
    commands: ['# In your .env file:', 'VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ask-ai'],
    note: 'Then restart: npm run dev',
  },
];

/* ── Copy-to-clipboard helper ── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: copied ? '#10b981' : 'rgba(255,255,255,0.5)',
      display: 'flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem',
      transition: 'color 0.2s',
    }}>
      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
    </button>
  );
};

/* ── Setup Guide Panel ── */
const SetupGuide = () => {
  const [open, setOpen] = useState(!isN8nConnected);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${isN8nConnected ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '1.5rem',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          borderBottom: open ? '1px solid var(--border-color)' : 'none',
        }}
      >
        <span style={{
          width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
          background: isN8nConnected ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isN8nConnected
            ? <CheckCircle2 size={18} color="#10b981" />
            : <AlertCircle size={18} color="#f59e0b" />}
        </span>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)',
          }}>
            {isN8nConnected ? '✅ n8n AI is connected' : '⚙️ Setup Guide — Connect AI via n8n'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {isN8nConnected
              ? `Webhook: ${N8N_CHAT_WEBHOOK}`
              : 'Follow these 4 steps to power this chat with a real AI model'}
          </div>
        </div>

        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Expandable steps */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {setupSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      background: step.bg,
                      border: `1px solid ${step.color}25`,
                      borderRadius: '14px',
                      padding: '1rem 1.1rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Step number + icon */}
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '11px',
                        background: step.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 14px ${step.color}50`,
                      }}>
                        <Icon size={18} color="white" />
                      </div>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 900, color: step.color,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: '0.05em',
                      }}>
                        STEP {step.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, fontSize: '0.88rem',
                        color: 'var(--text-primary)', marginBottom: '0.4rem',
                      }}>
                        {step.title}
                      </div>

                      {step.description && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                          {step.description}
                        </p>
                      )}

                      {step.commands && (
                        <div style={{
                          background: '#0f1117', borderRadius: '10px',
                          padding: '0.65rem 0.85rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          marginBottom: '0.5rem',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {step.commands.map((cmd, ci) => (
                                <code key={ci} style={{
                                  fontSize: '0.78rem', color: cmd.startsWith('#') ? '#6b7280' : '#a3e635',
                                  display: 'block',
                                }}>
                                  {!cmd.startsWith('#') && <span style={{ color: '#60a5fa' }}>$ </span>}
                                  {cmd}
                                </code>
                              ))}
                            </div>
                            <CopyButton text={step.commands.filter(c => !c.startsWith('#')).join('\n')} />
                          </div>
                        </div>
                      )}

                      {step.file && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                          borderRadius: '8px', padding: '0.3rem 0.7rem', marginBottom: '0.5rem',
                        }}>
                          <code style={{ fontSize: '0.75rem', color: '#06b6d4' }}>{step.file}</code>
                          <CopyButton text={step.file} />
                        </div>
                      )}

                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.75rem', fontWeight: 700, color: step.color,
                            marginBottom: '0.4rem', textDecoration: 'none',
                          }}
                        >
                          {step.linkLabel} <ExternalLink size={11} />
                        </a>
                      )}

                      {step.note && (
                        <div style={{
                          fontSize: '0.72rem', color: 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                        }}>
                          <span style={{ color: step.color }}>→</span> {step.note}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* n8n Workflow diagram */}
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: '12px',
                padding: '0.85rem 1rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                  Workflow Architecture
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', flexWrap: 'wrap',
                }}>
                  {['🔗 Webhook', '→', '🤖 OpenAI GPT', '→', '💬 Respond to Chat'].map((item, i) => (
                    <span key={i} style={{
                      fontSize: item === '→' ? '1rem' : '0.8rem',
                      color: item === '→' ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontWeight: item === '→' ? 400 : 700,
                      background: item === '→' ? 'none' : 'var(--bg-card)',
                      padding: item === '→' ? 0 : '0.3rem 0.75rem',
                      borderRadius: item === '→' ? 0 : '100px',
                      border: item === '→' ? 'none' : '1px solid var(--border-color)',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const AskAIPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: isN8nConnected
        ? 'Hello! I am your AI Health Assistant. How can I help you today?'
        : 'Hello! I am your AI Health Assistant. n8n is not connected yet — follow the setup guide above to enable real AI responses.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setIsTyping(true);

    if (!isN8nConnected) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1, type: 'ai',
          text: '⚠️ n8n is not connected. Follow the setup guide above (click "Setup Guide") to connect a real AI model in 4 steps.',
        }]);
        setIsTyping(false);
      }, 700);
      return;
    }

    try {
      const response = await fetch(N8N_FETCH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // n8n Chat Trigger node expects 'chatInput'
          // Regular Webhook node expects 'message'
          chatInput: question,
          message: question,
          sessionId: `medibook-${Date.now()}`,
          context: 'healthcare-assistant',
        }),
      });
      if (!response.ok) throw new Error(`n8n error: ${response.status}`);
      const data = await response.json();

      // Handles multiple n8n response formats:
      // - Chat Trigger node:   data[0].output  or  data.output
      // - Regular Webhook:     data.reply / data.text / data.message
      // - OpenAI passthrough:  data.choices[0].message.content
      const reply =
        (Array.isArray(data) ? data[0]?.output : null) ||
        data?.output ||
        data?.reply ||
        data?.text ||
        data?.message ||
        data?.answer ||
        data?.response ||
        data?.choices?.[0]?.message?.content ||
        'Got your message! (Check the n8n node — make sure it returns a JSON field named output, reply, or text)';
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: reply }]);
    } catch (err) {
      console.error('[AskAI]', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, type: 'ai',
        text: '❌ Could not reach n8n. Make sure n8n is running on port 5678 and the webhook is active.',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>

      {/* ── Header ── */}
      <div style={{ background: 'var(--brand-500)', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1rem' }}
        >
          <Sparkles size={18} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Powered by AI</span>
        </motion.div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Ask AI Assistant
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
          Get instant answers to your healthcare questions, find the right specialists, and learn more about our services.
        </p>
      </div>

      {/* ── Main Container ── */}
      <div style={{ flex: 1, maxWidth: '860px', margin: '0 auto', width: '100%', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>

        {/* Chat Card */}
        <div style={{
          flex: 1,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '420px',
        }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: '1rem', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: msg.type === 'user' ? 'var(--brand-500)' : 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                  }}>
                    {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div style={{
                    background: msg.type === 'user' ? 'var(--brand-500)' : 'var(--bg-secondary)',
                    color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '1rem', borderRadius: '12px',
                    borderTopRightRadius: msg.type === 'user' ? '4px' : '12px',
                    borderTopLeftRadius: msg.type === 'ai' ? '4px' : '12px',
                    maxWidth: '80%', lineHeight: 1.6, fontSize: '0.95rem',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: '1rem' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Bot size={18} />
                  </div>
                  <div style={{
                    background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', borderTopLeftRadius: '4px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }} style={{ display: 'flex' }}>
                      <Loader2 size={16} />
                    </motion.div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isN8nConnected ? 'Ask your health question...' : 'Connect n8n to enable AI responses...'}
                style={{
                  flex: 1, padding: '0.85rem 1.25rem', borderRadius: '99px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || isTyping}
                style={{
                  width: '46px', height: '46px', borderRadius: '50%', border: 'none',
                  background: input.trim() && !isTyping ? 'var(--brand-500)' : 'var(--bg-secondary)',
                  color: input.trim() && !isTyping ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AskAIPage;
