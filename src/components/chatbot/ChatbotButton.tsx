'use client';

import { Box, Button, Dialog, DialogContent, IconButton, TextField, Typography, CircularProgress } from '@mui/material';
import { Chat, Send, Close } from '@mui/icons-material';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DialogCloseButton } from 'components/basics/DialogCloseButton';
import { sendChatMessage, ChatbotResponse } from 'lib/services/chatbot-service/chatbotActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

export function ChatbotButton() {
    const [dialogOpen, setDialogOpen] = useState(false);
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

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setMessage('');
        // Optionally clear chat history when closing to maintain session per dialog opening
        // setChatHistory([]);
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
            <Button
                variant="contained"
                sx={{
                    whiteSpace: 'nowrap',
                    ml: 2,
                    minWidth: 'auto',
                    padding: '6px 16px',
                }}
                onClick={openDialog}
                startIcon={<Chat />}
                data-testid="chatbot-button"
            >
                {t('button')}
            </Button>

            <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth data-testid="chatbot-dialog">
                <DialogCloseButton handleClose={closeDialog} dataTestId="chatbot-dialog-close" />

                <DialogContent sx={{ pb: 3 }}>
                    <Typography variant="h2" sx={{ mb: 3, pt: 2 }} color="primary">
                        {t('title')}
                    </Typography>

                    {/* Session ID indicator for development */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Session: {sessionId}
                    </Typography>

                    {/* Chat History */}
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            height: '300px',
                            overflowY: 'auto',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 1,
                            p: 2,
                            mb: 2,
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                </DialogContent>
            </Dialog>
        </>
    );
}
