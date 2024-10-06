import React, { useState, useCallback, useMemo } from "react";
import GenerateIcon from "@/assets/generateIcon.svg";
import ReloadIcon from "@/assets/reloadIcon.svg";
import ArrowDownIcon from "@/assets/arrowDown.svg";

interface Prompt {
    role: "user" | "ai";
    message: string;
}

const PromptModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    // State for storing prompt history and current user input
    const [promptHistory, setPromptHistory] = useState<Prompt[]>([]);
    const [currentUserInput, setCurrentUserInput] = useState<string>("");

    // Handle generating a response
    const handleGenerateResponse = useCallback(() => {
        if (currentUserInput.trim()) {
            setPromptHistory(previousHistory => [
                ...previousHistory,
                { role: "user", message: currentUserInput },
                { role: "ai", message: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask." }
            ]);
            setCurrentUserInput("");
        }
    }, [currentUserInput]);

    // Handle inserting the response into the LinkedIn message input field
    const handleInsertResponse = useCallback(() => {
        const messageInputField = document.querySelector(".msg-form__contenteditable") as HTMLElement;
        if (messageInputField && promptHistory.length > 0) {
            // Remove placeholder if it exists
            document.querySelector(".msg-form__placeholder")?.remove();
            
            // Create and insert the response
            const paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = promptHistory[promptHistory.length - 1].message;
            messageInputField.innerHTML = '';
            messageInputField.appendChild(paragraphElement);

            // Set cursor to the end of the inserted text
            const textRange = document.createRange();
            textRange.selectNodeContents(messageInputField);
            textRange.collapse(false);
            const textSelection = window.getSelection();
            textSelection?.removeAllRanges();
            textSelection?.addRange(textRange);
        }
        // Reset states and close modal
        setCurrentUserInput("");
        setPromptHistory([]);
        onClose();
    }, [promptHistory, onClose]);

    // Memoized modal content to prevent unnecessary re-renders
    const modalContent = useMemo(() => (
        <div className="fixed inset-0 flex items-center justify-center z-50 top-32">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="w-1/3 flex flex-col z-10 max-h-[80vh] overflow-y-auto rounded-[15px] p-[26px] bg-[#F9FAFB] shadow-[0px_10px_15px_-3px_#0000001A,0px_4px_6px_-4px_#0000001A]">
                {promptHistory.map((prompt, index) => (
                    <div
                        key={index}
                        className={`mb-[16px] text-2xl font-normal text-[#666D80] p-4 rounded-xl max-w-[77%] ${
                            prompt.role === "user" ? "self-end bg-[#DFE1E7]" : "self-start bg-[#DBEAFE]"
                        }`}
                    >
                        {prompt.message}
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Your prompt"
                    value={currentUserInput}
                    onChange={(e) => setCurrentUserInput(e.target.value)}
                    className="text-2xl !p-[16px] font-medium rounded-lg mb-2 !border !border-solid !border-[#C1C7D0] focus:outline-none focus:ring-0 bg-white !shadow-none !text-[#A4ACB9] active:!outline-none active:!shadow-none"
                />

                {promptHistory.length === 0 ? (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleGenerateResponse}
                            className="bg-[#3B82F6] text-white text-2xl font-semibold rounded-lg px-6 py-3 !mt-[16px] flex items-center justify-center cursor-pointer"
                        >
                            <img src={GenerateIcon} alt="Generate icon" className="w-6 mr-[10px]" />
                            <span>Generate</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleInsertResponse}
                            className="text-[#666D80] !border-2 !border-l-2 !border-solid !border-[#666D80] font-semibold rounded-lg px-6 py-3 !mt-[16px] flex items-center justify-center cursor-pointer mr-6"
                        >
                            <img src={ArrowDownIcon} alt="Insert icon" className="w-4 mr-[10px]" />
                            <span className="text-2xl">Insert</span>
                        </button>
                        <button
                            type="button"
                            className="bg-[#3B82F6] text-white text-2xl font-semibold rounded-lg px-6 py-3 !mt-[16px] flex items-center justify-center cursor-pointer"
                        >
                            <img src={ReloadIcon} alt="Regenerate icon" className="w-4 mr-[10px]" />
                            <span className="text-2xl">Regenerate</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    ), [promptHistory, currentUserInput, handleGenerateResponse, handleInsertResponse, onClose]);

    if (!isOpen) return null;

    return (
        <div className="ai-popup">
            {modalContent}
        </div>
    );
};

export default PromptModal;