'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

export default function ChatRoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { roomId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch messages for this room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/message?roomId=${roomId}`);
        if (res.data?.success) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Send message + trigger AI if needed
  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const newMessage = {
      message: input,
      role: 'user',
      userId: session?.user?.email,
      roomId,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    await axios.post('/api/message', newMessage);

    if (input.includes('@ai')) {
      setIsThinking(true);
      try {
        const aiRes = await axios.post('/api/ai', {
          prompt: input,
          roomId,
          userEmail: session?.user?.email,
        });

        const aiMessage = {
          message: aiRes.data.reply,
          role: 'ai',
          userId: 'ai@openai.com',
          roomId,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        console.error('AI Error:', err);
      }
      setIsThinking(false);
    }
  };

  const getBadge = (msg) => {
    if (msg.role === 'ai') return '🤖 AI';
    if (msg.userId === session?.user?.email) return '🧍 You';
    return '👥 Teammate';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Chat Section */}
        <div className="w-1/2 overflow-y-auto pr-2 space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <div
                className={`rounded-2xl px-4 py-2 max-w-full break-words shadow-sm ${
                  msg.role === 'user'
                    ? msg.userId === session?.user?.email
                      ? 'bg-blue-500 text-white self-end ml-auto'
                      : 'bg-green-200 text-black self-start mr-auto'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white self-start mr-auto'
                }`}
              >
                <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                  {getBadge(msg)}
                </div>
                {msg.message}
              </div>

              {/* Divider after each AI response */}
              {msg.role === 'ai' && (
                <hr className="my-4 border-t-2 border-dashed border-gray-400 dark:border-gray-600" />
              )}
            </div>
          ))}

          {isThinking && (
            <div className="text-sm text-gray-600 italic dark:text-gray-300">
              @ai is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Code Output Section */}
        <div className="w-1/2 overflow-y-auto pl-2 bg-white dark:bg-zinc-800 rounded-xl p-4">
          {messages
            .filter((msg) => msg.role === 'ai')
            .slice(-1)
            .map((msg, idx) => (
              <pre
                key={idx}
                className="text-sm whitespace-pre-wrap font-mono text-black dark:text-green-300"
              >
                {msg.message}
              </pre>
            ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="pt-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isThinking
              ? 'Please wait for AI to respond...'
              : 'Type a message... Use @ai to trigger the bot'
          }
          disabled={isThinking}
          rows={1}
          className="resize-none rounded-2xl w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </div>
    </div>
  );
}
