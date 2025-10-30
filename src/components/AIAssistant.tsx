'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your GHG Emission Calculator AI Assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickQuestions = [
    'Analyze my transportation scenario',
    'Show me recycling factors',
    'Compare baseline vs intervention',
    'Calculate emission reduction potential',
    'Export PDF Laporan Emisi',
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('transport')) {
      return 'Based on your current transportation data, diesel trucks contribute the highest emissions at 2.68 kg CO₂/L. Consider switching 30% of fleet to electric trucks for a 25% reduction in transportation emissions.';
    } else if (lowerQuestion.includes('recycl') || lowerQuestion.includes('factor')) {
      return 'Recycling emission avoidance factors: Paper: 1.74 kg CO₂e/kg, Plastic: 1.75 kg CO₂e/kg, Aluminum: 0.59 kg CO₂e/kg, Steel: 1.53 kg CO₂e/kg, Glass: 0.35 kg CO₂e/kg.';
    } else if (lowerQuestion.includes('compar') || lowerQuestion.includes('scenario')) {
      return 'Comparing scenarios shows Intervention A reduces total emissions by 20% (40 ton CO₂e). Main reductions come from improved landfill management and increased recycling rates.';
    } else if (lowerQuestion.includes('reduction') || lowerQuestion.includes('potential')) {
      return 'Maximum emission reduction potential: 45-60% with full implementation of all interventions (electric fleet, 80% recycling, 50% waste-to-energy, and optimized routing).';
    } else if (lowerQuestion.includes('export') || lowerQuestion.includes('report')) {
      return 'I can help generate comprehensive reports in PDF, CSV, or JSON format. Reports include methodology, emission factors, charts, and recommendations. Would you like me to prepare a report?';
    } else {
      return 'I can help with emission calculations, scenario comparisons, methodology explanations, and report generation. What specific aspect would you like to explore?';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          backgroundColor: '#4CA771',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '384px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#4CA771',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Bot style={{ color: 'white' }} size={20} />
            </div>
            <div style={{ marginLeft: '12px', flex: 1 }}>
              <h3 style={{ fontWeight: '600', color: '#051D40', margin: 0 }}>
                AI Assistant
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                Ask me anything about emissions
              </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((message, index) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    maxWidth: '80%'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: message.sender === 'user' ? '#F3F4F6' : '#4CA771',
                      flexShrink: 0
                    }}
                  >
                    {message.sender === 'user' ? (
                      <User style={{ color: '#374151' }} size={16} />
                    ) : (
                      <Bot style={{ color: 'white' }} size={16} />
                    )}
                  </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: message.sender === 'user' ? '#4CA771' : '#F3F4F6',
                      color: message.sender === 'user' ? 'white' : '#374151'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px' }}>{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 8px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                Quick questions:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleQuickQuestion(question)}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '9999px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about emissions..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4CA771';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              style={{
                padding: '8px 12px',
                backgroundColor: '#4CA771',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                opacity: inputValue.trim() ? 1 : 0.5,
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = '#3A9B5F';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4CA771';
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
