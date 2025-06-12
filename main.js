//toggle mobile nav //
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('open');
  }
  
//FAQ Accordion//
document.addEventListener('DOMContentLoaded', function(){
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item =>{
        const header = item.querySelector('.faq-header');

        header.addEventListener('click', function(){
            faqItems.forEach(otherItem =>{
                if (otherItem !== item && otherItem.classList.contains('active')){
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

});
//alert message for button clicks
const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {
  button.addEventListener("click", function() {
    alert("This feature is under development!");
  });
});


//AI Assistant//
document.addEventListener('DOMContentLoaded', () => {
    // Check if Puter.js loaded correctly
    if (typeof window.puter === 'undefined') {
        document.getElementById('error-message').textContent = 'Puter.js failed to load. Please refresh the page.';
        return;
    }

    // --- DOM Element References ---
    const chatMessages = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const errorMessage = document.getElementById('error-message');
    const sampleQuestionsContainer = document.getElementById('sample-questions');

    // --- Chatbot Context ---
    const startupContext = `You are a friendly and knowledgeable AI assistant for a startup called **FixMate**, Nairobi's fastest on-demand repair platform.  
        Your goal is to answer questions about the startup and only related to fixmate based on the following information.  
        Maintain a **warm, urgent, bold and trustworthy** tone—like a helpful,savvy neighbor who’s also a repair expert and knows the best handymen in town. 
        Use **Nairobi-specific references** and **occasional emojis** (🛠️⚡) to keep it lively.
    

        Implementation Checklist
        Before Responding:

        ✅ Identify the specific question scope - avoid over-explaining
        ✅ Plan response structure - numbered lists, bold terms, clean spacing
        ✅ Check tone alignment - bold, helpful, modern, accessible to Nairobi audience

        During Response Creation:

        ✅ Keep each point to 2-3 sentences maximum
        ✅ Use numbered lists with proper line breaks
        ✅ Apply bold formatting strategically for key terms only
        ✅ Include section headings when separating different topics

        Final Review:

        ✅ Verify clean spacing and formatting
        ✅ Confirm accessibility - no excessive jargon
        ✅ Check brand alignment - modern, helpful tone with appropriate emojis for marketing content
        ✅ Ensure conciseness - focused answers without repetition

        mission: connect nairobians with verified tradespeople instantly. No more repair nightmares or scams.
        **Services for customers**
        -FixNow 🚨:Emergency repairs(burst pipes,power cuts)
        -FixProtect 🛡️: 7-day warantee(no extra fee)
        -FixTips 🧰: DIY tutorials.
        **For Handymen**
        -30% income boost
        -M-Pesa payout
        -Flexible work
        -Gear discount at Divino Hardware.
        **Contact:** team@fixmate.co.ke | 020-765-4321 | GTC Towers, Kilimani
        **Goals 2026:** 5,000+ monthly bookings, 200+ female tradespeople, full M-Pesa integration.
        **Team:** Founders Boaz Marube (ex-SafiriPay UX, survived 37 electrician calls) & Brian Mwangi (JKUAT dev, coded on Nokia during blackouts). Key staff: June (Operations, 4.9/5 ratings), Evelyne (CX, 3-min responses), Moses (Field Inspector), Raymond (Growth, #MyWorstRepairStory campaign).

        Founded by Boaz Marube & Brian Mwangi, after Boaz experienced 37 failed electrician calls.Use Nairobi references and occasional emojis

       
        `;
        

    // Store conversation history for context
    let chatHistory = [
        { role: 'system', content: startupContext }
    ];

        // --- ADDED: Markdown to HTML conversion function ---
        const markdownToHtml = (text) => {
            // Convert **bold** to <strong>
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Convert *italic* to <em>
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

            // Convert double line breaks to paragraph breaks
            text = text.replace(/\n\n+/g, '</p><p>');
            
            // Convert single line breaks to space (keep text flowing in paragraphs)
            text = text.replace(/\n(?!\n)/g, ' ');
            
            // Wrap the entire content in paragraph tags
            text = '<p>' + text + '</p>';
            
            // Clean up empty paragraphs
            text = text.replace(/<p>\s*<\/p>/g, '');
            
            // Handle emojis and special characters properly
            // Clean up multiple spaces
            text = text.replace(/\s+/g, ' '); 
        

            return text;
        };
    
    // --- Functions ---

    const addMessageToUI = (message, sender) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;
        if (sender === 'ai') {
            // Convert markdown to HTML for AI responses
            bubble.innerHTML = markdownToHtml(message);
        } else {
            // Keep user messages as plain text for security
            bubble.textContent = message;
        }
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    /**
     * Adds a streaming message bubble that can be updated in real-time
     */
    const addStreamingMessage = () => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai-bubble streaming-text';
        bubble.id = 'streaming-bubble';
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return bubble;
    };

    const showTypingIndicator = (show) => {
        let indicator = document.getElementById('typing-indicator');
        if (show) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'typing-indicator';
                indicator.className = 'chat-bubble ai-bubble typing-indicator';
                indicator.innerHTML = `<span></span><span></span><span></span>`;
                chatMessages.appendChild(indicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } else {
            if (indicator) {
                indicator.remove();
            }
        }
    };

    const handleSendMessage = async () => {
        const userMessage = chatInput.value.trim();

        // Handle empty input
        if (!userMessage) {
            errorMessage.textContent = 'Please enter a question.';
            setTimeout(() => errorMessage.textContent = '', 3000);
            return;
        }

        // Disable input and button during API call
        chatInput.disabled = true;
        sendBtn.disabled = true;
        errorMessage.textContent = '';

        // Add user message to UI and history
        addMessageToUI(userMessage, 'user');
        chatHistory.push({ role: 'user', content: userMessage });
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator(true);

        try {
            // Use the correct Puter.js API call with conversation history
            const response = await puter.ai.chat(chatHistory, {
                model: 'gpt-4o' // Using GPT-4o which is the default and reliable
            });

            console.log('Puter.js response:', response);

            // Handle the response based on the actual Puter.js API structure
            let aiMessage = '';
            
            if (typeof response === 'string') {
                // Simple string response
                aiMessage = response;
            } else if (response && response.message && response.message.content) {
                // New API structure with message object
                if (Array.isArray(response.message.content)) {
                    aiMessage = response.message.content[0].text || response.message.content[0];
                } else {
                    aiMessage = response.message.content;
                }
            } else if (response && response.content) {
                // Alternative response structure
                aiMessage = response.content;
            } else {
                throw new Error('Unexpected response structure: ' + JSON.stringify(response));
            }

            // Add AI response to history and UI
            chatHistory.push({ role: 'assistant', content: aiMessage });
            addMessageToUI(aiMessage, 'ai');

        } catch (error) {
            console.error('Puter.js Error:', error);
            let errorMsg = 'Sorry, I encountered an error. Please try again.';
            
            if (error.message) {
                errorMsg = `Error: ${error.message}`;
            }
            
            addMessageToUI(errorMsg, 'ai');
            errorMessage.textContent = 'Failed to get response. Please try again.';
        } finally {
            // Clean up
            showTypingIndicator(false);
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    };


    // Send button click
    sendBtn.addEventListener('click', handleSendMessage);

    // Enter key press in input
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Sample questions click
    sampleQuestionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('sample-question')) {
            const question = event.target.textContent;
            chatInput.value = question;
            handleSendMessage();
        }
    });

    
});



// Visitor Counter//
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    const weekStart = monday.toISOString().split('T')[0];
    
    // Get stored values
    const lastVisit = localStorage.getItem('lastVisitDate');
    const lastWeekStart = localStorage.getItem('weekStartDate');
    
    // Update total visits 
    let total = parseInt(localStorage.getItem('totalVisits')) || 0;
    total++;
    localStorage.setItem('totalVisits', total);
    
    // Update today's visits
    let todayCount = 0;
    if (lastVisit === today) {
        todayCount = parseInt(localStorage.getItem('todayVisits')) || 0;
    }
    todayCount++;
    localStorage.setItem('todayVisits', todayCount);
    localStorage.setItem('lastVisitDate', today);
    
    // Update weekly visits
    let weekCount = 0;
    if (lastWeekStart === weekStart) {
        weekCount = parseInt(localStorage.getItem('weeklyVisits')) || 0;
    } else {
        localStorage.setItem('weekStartDate', weekStart);
    }
    weekCount++;
    localStorage.setItem('weeklyVisits', weekCount);
    
    // Display the counts
    const statsElement = document.querySelector('.visitor-count-stats');
    if (statsElement) {
        statsElement.innerHTML = `
            Today: ${todayCount}<br>
            This Week: ${weekCount}<br>
            Total: ${total}
        `;
    }
});


