import React, { useEffect, useState, useRef, useCallback } from "react";
import Icon from "@/assets/icon.svg";
import PromptModal from "./PromptModal";

const PromptIcon: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Refs to store DOM elements and track icon click state
  const aiIconRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<Element | null>(null);
  const wasIconClickedRef = useRef(false);

  // Function to find and store the message input element
  const findMessageInput = useCallback(() => {
    const inputElement = document.querySelector(".msg-form__contenteditable");
    if (inputElement) {
      messageInputRef.current = inputElement;
      return true;
    }
    return false;
  }, []);

  // Function to create and set up the AI icon
  const createAiIcon = useCallback(() => {
    if (aiIconRef.current) return;

    const iconElement = document.createElement('div');
    iconElement.className = 'ai-icon';
    iconElement.style.cssText = `
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      padding: 8px;
      background-color: #fff;
      border-radius: 100%;
      box-shadow: 0px 2px 4px -2px #0000001A;
      cursor: pointer;
      display: none;
      z-index: 1000;
    `;
    iconElement.innerHTML = `<img src="${Icon}" alt="ai-icon" style="width: 100%; height: 100%;" />`;

    // Add event listeners to handle icon interactions
    iconElement.addEventListener('mousedown', () => {
      wasIconClickedRef.current = true;
    });

    iconElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsModalVisible(true);
      if (aiIconRef.current) {
        aiIconRef.current.style.display = 'block';
      }
    });

    aiIconRef.current = iconElement;
  }, []);

  // Function to show the AI icon
  const showAiIcon = useCallback(() => {
    if (aiIconRef.current) {
      aiIconRef.current.style.display = 'block';
    }
  }, []);

  // Function to hide the AI icon
  const hideAiIcon = useCallback(() => {
    if (aiIconRef.current && !wasIconClickedRef.current) {
      aiIconRef.current.style.display = 'none';
    }
    wasIconClickedRef.current = false;
  }, []);

  // Function to append the AI icon to the message input
  const appendAiIconToMessageInput = useCallback(() => {
    if (messageInputRef.current && !aiIconRef.current) {
      (messageInputRef.current as HTMLElement).style.position = 'relative';
      createAiIcon();
      if (aiIconRef.current) {
        messageInputRef.current.insertAdjacentElement('afterend', aiIconRef.current);
      }
    }
  }, [createAiIcon]);

  // Function to set up event listeners for the message input
  const setupMessageInputListeners = useCallback(() => {
    if (messageInputRef.current) {
      appendAiIconToMessageInput();
      messageInputRef.current.addEventListener("focus", showAiIcon);
      messageInputRef.current.addEventListener("blur", () => {
        setTimeout(hideAiIcon, 150);
      });
    }
  }, [appendAiIconToMessageInput, showAiIcon, hideAiIcon]);

  // Function to clean up event listeners
  const cleanupListeners = useCallback(() => {
    if (messageInputRef.current) {
      messageInputRef.current.removeEventListener("focus", showAiIcon);
      messageInputRef.current.removeEventListener("blur", hideAiIcon);
      aiIconRef.current?.remove();
      aiIconRef.current = null;
    }
  }, [showAiIcon, hideAiIcon]);

  // Effect to initialize the component and set up observers
  useEffect(() => {
    const initializeComponent = () => {
      if (findMessageInput()) {
        setupMessageInputListeners();
      } else {
        // If message input is not found, observe DOM changes
        const domObserver = new MutationObserver(() => {
          if (findMessageInput()) {
            setupMessageInputListeners();
            domObserver.disconnect();
          }
        });

        domObserver.observe(document.body, { childList: true, subtree: true });
        return domObserver;
      }
    };

    const domObserver = initializeComponent();

    // Cleanup function
    return () => {
      cleanupListeners();
      domObserver?.disconnect();
    };
  }, [findMessageInput, setupMessageInputListeners, cleanupListeners]);

  // Render the PromptModal component
  return (
    <div>
      <PromptModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default PromptIcon;