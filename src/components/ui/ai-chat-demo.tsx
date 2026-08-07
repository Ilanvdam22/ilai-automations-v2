"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  from: "user" | "ai";
  text: string;
};

const conversation: Message[] = [
  { id: 1, from: "user", text: "Hoi! Ik wil graag meer weten over jullie diensten 👋" },
  { id: 2, from: "ai", text: "Hey! Leuk dat je interesse hebt 🙌 Waarvoor zoek je vooral een oplossing?" },
  { id: 3, from: "user", text: "We missen veel leads door trage opvolging" },
  { id: 4, from: "ai", text: "Helder! Ik kan je inplannen voor een gratis gesprek. Past donderdag 14:00 of vrijdag 10:00?" },
  { id: 5, from: "user", text: "Donderdag 14:00 graag!" },
  { id: 6, from: "ai", text: "✅ Geregeld! Je gesprek staat op donderdag 14:00. Je ontvangt een bevestiging via e-mail. Tot dan!" },
];

// Time between messages (ms)
const delays = [0, 1400, 3200, 4800, 6000, 7400];
const LOOP_DELAY = 10500;

export default function AIChatDemo() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setVisible([]);
      setTyping(false);

      conversation.forEach((msg, i) => {
        const showAt = delays[i];

        if (msg.from === "ai") {
          // Show typing indicator 900ms before the message
          timers.push(
            setTimeout(() => setTyping(true), showAt - 900 < 0 ? 0 : showAt - 900)
          );
        }

        timers.push(
          setTimeout(() => {
            setTyping(false);
            setVisible((prev) => [...prev, msg.id]);
          }, showAt)
        );
      });

      timers.push(setTimeout(run, LOOP_DELAY));
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="relative rounded-3xl border border-[#00d4ff]/25 bg-[#0a0a12] shadow-[0_0_40px_rgba(0,212,255,0.08)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0f0f1a] border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 flex items-center justify-center text-xs font-bold text-[#00d4ff]">
            AI
          </div>
          <div>
            <p className="text-white text-xs font-semibold">ILAI Assistent</p>
            <p className="text-emerald-400 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online • reageert direct
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="px-3 py-4 space-y-2 min-h-[280px]">
          <AnimatePresence>
            {conversation.map((msg) =>
              visible.includes(msg.id) ? (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.from === "user"
                        ? "bg-[#00d4ff] text-black font-medium rounded-br-sm"
                        : "bg-[#1a1a2e] text-slate-200 border border-white/5 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ) : null
            )}

            {/* Typing indicator */}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <span className="bg-[#1a1a2e] border border-white/5 px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-3 py-3 bg-[#0f0f1a] border-t border-white/5">
          <div className="flex-1 bg-white/5 rounded-full px-3 py-1.5 text-slate-500 text-xs">
            Typ een bericht...
          </div>
          <div className="w-7 h-7 rounded-full bg-[#00d4ff] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-xs text-slate-500 font-mono mt-3 tracking-wider">
        ↑ Live AI-assistent simulatie
      </p>
    </div>
  );
}
