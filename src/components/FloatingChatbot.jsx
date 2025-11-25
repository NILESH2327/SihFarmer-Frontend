import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatbotPanel from "./ChatbotPanel";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const chatRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggle = () => {
    if (!open) {
      const authed = isAuthenticated();
      if (!authed) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-20 right-4 z-40"
        >
          <ChatbotPanel />
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
