import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Rocket,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  User,
  Bot,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface Interview {
  id: string;
  role_type: string;
  difficulty: string;
  job_description: string | null;
  status: string;
  started_at: string;
}

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        toast({
          title: 'Interview not found',
          description: 'Redirecting to dashboard',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setInterview(data);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('interview_messages')
        .select('*')
        .eq('interview_id', id)
        .order('created_at', { ascending: true });

      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData.map(m => ({ ...m, role: m.role as Message['role'] })));
      } else {
        // Start the interview with AI greeting
        await startInterview(data);
      }

      setLoading(false);
    };

    fetchInterview();
  }, [id, user, navigate, toast]);

  const startInterview = async (interviewData: Interview) => {
    setSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            interviewId: interviewData.id,
            roleType: interviewData.role_type,
            difficulty: interviewData.difficulty,
            jobDescription: interviewData.job_description,
            messages: [],
            action: 'start',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const data = await response.json();
      
      // Save and display the AI greeting
      const { data: savedMessage } = await supabase
        .from('interview_messages')
        .insert({
          interview_id: interviewData.id,
          role: 'assistant',
          content: data.message,
        })
        .select()
        .single();

      if (savedMessage) {
        setMessages([{ ...savedMessage, role: savedMessage.role as Message['role'] }]);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Failed to start interview',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending || !interview) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      // Save user message
      await supabase.from('interview_messages').insert({
        interview_id: interview.id,
        role: 'user',
        content: userMessage,
      });

      // Get AI response
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            interviewId: interview.id,
            roleType: interview.role_type,
            difficulty: interview.difficulty,
            jobDescription: interview.job_description,
            messages: [...messages.filter((m) => m.id !== tempUserMessage.id), { role: 'user', content: userMessage }],
            action: 'respond',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast({
            title: 'Rate limited',
            description: 'Please wait a moment before sending another message',
            variant: 'destructive',
          });
          return;
        }
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Save AI response
      const { data: savedMessage } = await supabase
        .from('interview_messages')
        .insert({
          interview_id: interview.id,
          role: 'assistant',
          content: data.message,
        })
        .select()
        .single();

      if (savedMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id),
          { ...tempUserMessage, id: `user-${Date.now()}` },
          { ...savedMessage, role: savedMessage.role as Message['role'] },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again',
        variant: 'destructive',
      });
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setSending(false);
    }
  };

  const endInterview = async () => {
    if (!interview) return;
    setEnding(true);

    try {
      // Get feedback from AI
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            interviewId: interview.id,
            roleType: interview.role_type,
            difficulty: interview.difficulty,
            messages,
            action: 'end',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to end interview');

      const feedback = await response.json();

      // Update interview with feedback
      await supabase
        .from('interviews')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          overall_score: feedback.overallScore,
          feedback_summary: feedback.summary,
          skill_ratings: feedback.skillRatings,
          improvement_plan: feedback.improvementPlan,
        })
        .eq('id', interview.id);

      toast({
        title: 'Interview completed!',
        description: 'View your feedback and report',
      });

      navigate(`/interview/${interview.id}/report`);
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: 'Failed to end interview',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading interview...
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    devops: 'DevOps Engineer',
    cloud: 'Cloud Engineer',
    software: 'Software Engineer',
    data: 'Data Engineer',
    fullstack: 'Full Stack Developer',
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">
                  {roleLabels[interview?.role_type || ''] || 'Interview'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Clock className="w-3 h-3" />
                <span className="capitalize">{interview?.difficulty}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={endInterview}
            disabled={ending || messages.length < 4}
          >
            {ending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Ending...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                End Interview
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={
                  message.role === 'user'
                    ? 'chat-bubble-user'
                    : 'chat-bubble-assistant'
                }
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-muted text-muted-foreground">
                <Bot className="w-4 h-4" />
              </div>
              <div className="chat-bubble-assistant">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Textarea
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            size="lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
