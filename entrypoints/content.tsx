import { defineContentScript } from 'wxt/sandbox';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import frameSvg from '../assets/icon.svg';
import '../entrypoints/popup/style.css'; 

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  runAt: 'document_idle',
  main() {
    function injectAIIcon(messageInputContainer: HTMLElement) {
      // Check if the AI icon already exists in this container
      if (messageInputContainer.querySelector('.ai-icon')) return;

      const messageInput = messageInputContainer.querySelector('.msg-form__contenteditable[contenteditable="true"]') as HTMLElement;
      const placeholderDiv = messageInputContainer.querySelector('.msg-form__placeholder') as HTMLElement;

      if (messageInput) {
        // Create AI Icon button
        const aiIcon = document.createElement('button');
        const img = document.createElement('img');
        img.src = frameSvg;
        img.alt = 'AI Icon';
        img.className = 'w-11 h-11 rounded-full ai-icon';

        aiIcon.appendChild(img);
        aiIcon.className = 'absolute right-5 bottom-4 cursor-pointer ai-icon';
        aiIcon.style.display = 'none'; // Initially hide the AI icon
        messageInputContainer.style.position = 'relative';
        messageInputContainer.appendChild(aiIcon);

        // Show AI icon when the input field is focused
        messageInput.addEventListener('focus', () => {
          aiIcon.style.display = 'inline-block';
        });

        messageInput.addEventListener('blur', (event) => {
          setTimeout(() => {
            if (!document.activeElement?.closest('.ai-icon')) {
              aiIcon.style.display = 'none';
            }
          }, 100);
        });

        // Prevent hiding the icon when it's clicked
        aiIcon.addEventListener('mousedown', (event) => {
          event.preventDefault(); // Prevent the blur effect when clicking the icon
        });

        // Modal logic
        aiIcon.addEventListener('click', (event) => {
          event.stopPropagation();

          if (document.querySelector('.ai-modal')) return;

          const modalContainer = document.createElement('div');
          modalContainer.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ai-modal'; 

          const modalBox = document.createElement('div');
          modalBox.className = 'bg-white p-6 rounded-lg max-w-xl w-full shadow-xl text-center'; 

          modalContainer.appendChild(modalBox);
          document.body.appendChild(modalContainer);

          const ModalComponent: React.FC = () => {
            const [input, setInput] = useState<string>('');
            const [response, setResponse] = useState<string>('');

            const handleClose = () => {
              modalContainer.remove();
            };

            const generateResponse = () => {
              setResponse('Thank you for the opportunity! If you have any more questions or if there’s anything else I can help you with, feel free to ask.');
            };

            const insertResponse = () => {
              if (messageInput) {
                messageInput.innerHTML = `<p>${response}</p>`;
                messageInput.focus();

                // Trigger an input event to enable the Send button
                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                messageInput.dispatchEvent(inputEvent);

                // Hide the placeholder
                if (placeholderDiv) {
                  placeholderDiv.style.display = 'none';
                }

                handleClose();
              }
            };

            useEffect(() => {
              // Close modal when clicking outside of the modal box
              const handleClickOutside = (e: MouseEvent) => {
                if (e.target === modalContainer) {
                  handleClose();
                }
              };

              document.addEventListener('click', handleClickOutside);
              return () => document.removeEventListener('click', handleClickOutside);
            }, []);

            return (
              <div id="app-root">
                <h2 className="text-2xl font-semibold mb-5">ChatGPT Writer</h2>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Your prompt"
                  className="w-full p-4 mb-5 rounded-md border border-gray-300 text-base"
                />
                
                {!response && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md w-full text-lg mb-4"
                    onClick={generateResponse}
                  >
                    Generate
                  </button>
                )}

                {response && (
                  <>
                    <div
                      className="bg-blue-50 p-4 mb-5 rounded-md border border-blue-200 text-left text-base text-gray-700"
                    >
                      <p>{response}</p>
                    </div>
                    
                    <div className="flex justify-between gap-4">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-md w-1/2 text-lg"
                        onClick={insertResponse}
                      >
                        Insert
                      </button>

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md w-1/2 text-lg"
                      >
                        Regenerate
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          };

          const root = ReactDOM.createRoot(modalBox);
          root.render(<ModalComponent />);
        });
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches('.msg-form__msg-content-container')) {
              injectAIIcon(node);
            } else {
              const messageInputContainers = node.querySelectorAll('.msg-form__msg-content-container');
              messageInputContainers.forEach((container) => {
                injectAIIcon(container as HTMLElement);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const initialMessageInputContainers = document.querySelectorAll('.msg-form__msg-content-container');
    initialMessageInputContainers.forEach((container) => {
      injectAIIcon(container as HTMLElement);
    });
  },
});
