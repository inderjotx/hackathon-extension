console.log('Content script loaded');


export interface MessageRequest {
    action: 'getPageContent';
}

export interface PageContent {
    title: string;
    url: string;
    content: string;
}

// Function to extract webpage content
function extractPageContent(): PageContent {

    const title = document.title;
    const url = window.location.href;
    const bodyContent = (document.body as HTMLElement).innerText || (document.body as HTMLElement).textContent || '';

    return {
        title,
        url,
        content: bodyContent.trim(),
    };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request: MessageRequest, _, sendResponse) => {
    if (request.action === 'getPageContent') {
        const pageContent = extractPageContent();
        sendResponse(pageContent);
    }
    return true; // Keep message channel open for async response
});
