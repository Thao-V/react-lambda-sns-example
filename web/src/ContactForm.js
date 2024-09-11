import { useState } from "react";
import axios from "axios";
export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const onSendMessage = async () => {
    try {
      const url =
        "https://ak0j8kembh.execute-api.us-east-1.amazonaws.com/dev/messages";
      const res = await axios.post(
        url,
        {
          email,
          content: message
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(res.status);
    } catch (error) {
      alert("Something is wrong. Please try again later.");
    }
  };
  return (
    <div className="flex flex-col space-y-1 items-center text-base">
      <h3>Contact Me</h3>
      <input
        className="border border-black rounded px-2 py-2"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <textarea
        rows={5}
        className="border border-black rounded px-2 py-2"
        placeholder="Enter your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        onClick={onSendMessage}
        className="border inline-block border-black rounded"
      >
        Send
      </button>
    </div>
  );
}
