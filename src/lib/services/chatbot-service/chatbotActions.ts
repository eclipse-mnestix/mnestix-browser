'use server';

import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { ApiResultStatus } from 'lib/util/apiResponseWrapper/apiResultStatus';
import { createRequestLogger, logInfo } from 'lib/util/Logger';
import { headers } from 'next/headers';

export type ChatbotResponse = {
    output: string;
    status?: string;
};

export async function sendChatMessage(
    chatInput: string,
    sessionId: string,
    aasContext?: any,
    submodelsContext?: any[],
): Promise<ApiResponseWrapper<ChatbotResponse>> {
    const logger = createRequestLogger(await headers());
    logInfo(logger, 'sendChatMessage', 'Sending message to chatbot', {
        messageLength: chatInput.length,
        sessionId,
        hasAasContext: !!aasContext,
        submodelsCount: submodelsContext?.length || 0,
    });

    try {
        const requestBody: any = {
            chatInput,
            sessionId,
        };

        // Add context data if available
        if (aasContext || submodelsContext) {
            requestBody.contextString = JSON.stringify({
                aas: aasContext,
                submodels: submodelsContext,
            });
        }

        const response = await fetch('https://n8n.demo.xitaso.es/webhook/mnestix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        logger.debug(
            {
                Request_Url: 'https://n8n.demo.xitaso.es/webhook/mnestix',
                Http_Status: response?.status,
                Http_Message: response?.statusText,
            },
            'Chatbot API response received',
        );

        if (!response.ok) {
            return wrapErrorCode(
                ApiResultStatus.UNKNOWN_ERROR,
                `Chatbot API responded with status ${response.status}: ${response.statusText}`,
                response.status,
            );
        }

        const result = await response.json();
        return wrapSuccess(result, response.status);
    } catch (error) {
        logger.error({ error }, 'Failed to send message to chatbot');
        return wrapErrorCode(
            ApiResultStatus.UNKNOWN_ERROR,
            error instanceof Error ? error.message : 'Unknown error occurred while contacting chatbot',
        );
    }
}
