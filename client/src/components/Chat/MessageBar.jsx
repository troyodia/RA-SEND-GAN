import { useState } from "react";
import picIcon from "../../images/icons/picture.png";
import cameraFooterIcon from "../../images/icons/camerafooter.png";
import microphoneIcon from "../../images/icons/microphone.png";
import emojiIcon from "../../images/icons/emoji.png";
import Picker from "emoji-picker-react";
import { useAppStore } from "../../store";
import { useSocket } from "../../use-contexts/socketContext";

export default function MessageBar({ isSmall, isTablet }) {
  const [display, setDisplay] = useState(false);
  const [message, setMessage] = useState("");
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const handleSendMessage = () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        recipient: selectedChatData.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };
  return (
    <>
      <div className="flex mt-auto h-32 border-0 w-full items-center bg-[#0E0E10]">
        <div className="flex mr-auto space-x-3 ml-4">
          <button className="w-8 pt-1">
            <img src={picIcon} alt=""></img>
          </button>
          <button className="w-6 pt-1">
            <img src={cameraFooterIcon} alt=""></img>
          </button>
          <button className="w-7 pt-1">
            <img src={microphoneIcon} alt=""></img>
          </button>
        </div>
        <input
          type="text"
          value={message}
          className="ml-8 flex-1 py-4 pl-4 bg-white/10 rounded-md outline-none text-lg 
          focus:outline focus:outline-dashed focus:outline-white/30 min-w-2"
          placeholder="Type a message"
          id="input"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <button
          className="mx-7 w-8 pt-1"
          onClick={() => {
            setDisplay((prev) => !prev);
          }}
        >
          <img src={emojiIcon} alt=""></img>
        </button>
        <button
          className={`flex text-black ml-auto mr-4 bg-[#00eeff] justify-center rounded ${
            isSmall
              ? "text-lg px-5 py-2"
              : isTablet
              ? "text-lg px-6 py-3"
              : "text-xl px-7 py-4"
          } 
          font-bold hover:opacity-80  active:outline-dashed active:outline-2 active:outline-offset-2 active:outline-cyan-500`}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <div className="absolute bottom-24 right-32">
        <Picker
          open={display}
          onEmojiClick={(emojiData, event) => {
            let pos = document.getElementById("input").selectionStart;
            setMessage(
              (prev) => prev.slice(0, pos) + emojiData.emoji + prev.slice(pos)
            );
            setDisplay(!display);
          }}
        ></Picker>
      </div>
    </>
  );
}
