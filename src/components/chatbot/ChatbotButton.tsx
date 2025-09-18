'use client';

import { Box, Fab, Paper, IconButton, TextField, Typography, CircularProgress, Collapse } from '@mui/material';
import { Chat, Send, Close, Minimize } from '@mui/icons-material';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendChatMessage, ChatbotResponse } from 'lib/services/chatbot-service/chatbotActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

export function ChatbotButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'bot'; message: string }>>([]);
    const { spawn } = useNotificationSpawner();
    const t = useTranslations('components.chatbot');
    const { aas, submodels } = useCurrentAasContext();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Generate a unique session ID based on AAS ID and component instance
    const sessionId = useMemo(() => {
        const aasId = aas?.id || 'unknown';
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        return `${aasId}-${timestamp}-${randomSuffix}`;
    }, [aas?.id]);

    // Clear chat history when AAS changes to maintain separate conversations per AAS
    useEffect(() => {
        setChatHistory([]);
    }, [aas?.id]);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Scroll to bottom whenever chat history or loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isLoading]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
        setMessage('');
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        setIsLoading(true);

        // Add user message to chat history
        setChatHistory((prev) => [...prev, { type: 'user', message: userMessage }]);

        try {
            // Prepare context data - only send actual submodel data, not errors
            const submodelsData = submodels
                ?.filter((sm) => sm.submodel) // Only include submodels that loaded successfully
                .map((sm) => sm.submodel);

            const response = await sendChatMessage(userMessage, sessionId, aas, submodelsData);

            if (response.isSuccess) {
                // Add bot response to chat history
                setChatHistory((prev) => [
                    ...prev,
                    { type: 'bot', message: response.result.output || t('responses.defaultResponse') },
                ]);
            } else {
                // Add error message to chat history
                setChatHistory((prev) => [...prev, { type: 'bot', message: t('responses.errorResponse') }]);
                spawn({
                    title: t('errors.title'),
                    message: response.message || t('errors.unknownError'),
                    severity: 'error',
                });
            }
        } catch (error) {
            setChatHistory((prev) => [...prev, { type: 'bot', message: t('responses.errorResponse') }]);
            spawn({
                title: t('errors.title'),
                message: t('errors.networkError'),
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                }}
                onClick={toggleChat}
                data-testid="chatbot-fab"
            >
                <Chat />
            </Fab>

            {/* Chat Window */}
            <Collapse in={isOpen}>
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 24,
                        width: 400,
                        height: 500,
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 3,
                    }}
                    data-testid="chatbot-window"
                >
                    {/* Chat Header */}
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'grey.300',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                        }}
                    >
                        <Typography variant="h6">{t('title')}</Typography>
                        <IconButton size="small" onClick={closeChat} sx={{ color: 'inherit' }}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Session ID indicator for development */}
                    <Box sx={{ px: 2, py: 1, backgroundColor: 'grey.50' }}>
                        <Typography variant="caption" color="text.secondary">
                            Session: {sessionId}
                        </Typography>
                    </Box>

                    {/* Chat Messages */}
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            backgroundColor: 'grey.50',
                        }}
                    >
                        {chatHistory.length === 0 ? (
                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {t('placeholder')}
                            </Typography>
                        ) : (
                            chatHistory.map((entry, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: entry.type === 'user' ? 'primary.main' : 'secondary.main',
                                        }}
                                    >
                                        {entry.type === 'user' ? t('labels.you') : t('labels.assistant')}:
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            p: 1,
                                            borderRadius: 1,
                                            backgroundColor: entry.type === 'user' ? 'primary.light' : 'grey.200',
                                            color: entry.type === 'user' ? 'primary.contrastText' : 'text.primary',
                                        }}
                                    >
                                        {entry.type === 'user' ? (
                                            <Typography variant="body2">{entry.message}</Typography>
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ children }) => (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ mb: 1, '&:last-child': { mb: 0 } }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    h1: ({ children }) => (
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    h2: ({ children }) => (
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{ fontWeight: 'bold', mb: 1 }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    h3: ({ children }) => (
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{ fontWeight: 'bold', mb: 1 }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    strong: ({ children }) => (
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    em: ({ children }) => (
                                                        <Typography component="span" sx={{ fontStyle: 'italic' }}>
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    code: ({ children }) => (
                                                        <Typography
                                                            component="code"
                                                            sx={{
                                                                backgroundColor: 'grey.100',
                                                                padding: '2px 4px',
                                                                borderRadius: '4px',
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.875em',
                                                            }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    hr: () => (
                                                        <Box
                                                            sx={{
                                                                my: 2,
                                                                borderBottom: '1px solid',
                                                                borderColor: 'grey.300',
                                                            }}
                                                        />
                                                    ),
                                                    table: ({ children }) => (
                                                        <Box
                                                            component="table"
                                                            sx={{
                                                                width: '100%',
                                                                borderCollapse: 'collapse',
                                                                mb: 2,
                                                                border: '1px solid',
                                                                borderColor: 'grey.300',
                                                                backgroundColor: 'background.paper',
                                                            }}
                                                        >
                                                            {children}
                                                        </Box>
                                                    ),
                                                    thead: ({ children }) => (
                                                        <Box
                                                            component="thead"
                                                            sx={{
                                                                backgroundColor: 'grey.100',
                                                            }}
                                                        >
                                                            {children}
                                                        </Box>
                                                    ),
                                                    tbody: ({ children }) => <Box component="tbody">{children}</Box>,
                                                    tr: ({ children }) => (
                                                        <Box
                                                            component="tr"
                                                            sx={{
                                                                borderBottom: '1px solid',
                                                                borderColor: 'grey.200',
                                                                '&:hover': {
                                                                    backgroundColor: 'grey.50',
                                                                },
                                                            }}
                                                        >
                                                            {children}
                                                        </Box>
                                                    ),
                                                    th: ({ children }) => (
                                                        <Typography
                                                            component="th"
                                                            variant="body2"
                                                            sx={{
                                                                p: 1,
                                                                fontWeight: 'bold',
                                                                textAlign: 'left',
                                                                border: '1px solid',
                                                                borderColor: 'grey.300',
                                                            }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                    td: ({ children }) => (
                                                        <Typography
                                                            component="td"
                                                            variant="body2"
                                                            sx={{
                                                                p: 1,
                                                                border: '1px solid',
                                                                borderColor: 'grey.300',
                                                            }}
                                                        >
                                                            {children}
                                                        </Typography>
                                                    ),
                                                }}
                                            >
                                                {entry.message}
                                            </ReactMarkdown>
                                        )}
                                    </Box>
                                </Box>
                            ))
                        )}
                        {isLoading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {t('loading')}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.300', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={t('inputPlaceholder')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            multiline
                            maxRows={3}
                            size="small"
                            data-testid="chatbot-input"
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isLoading}
                            data-testid="chatbot-send-button"
                        >
                            <Send />
                        </IconButton>
                    </Box>
                </Paper>
            </Collapse>
        </>
    );
}
