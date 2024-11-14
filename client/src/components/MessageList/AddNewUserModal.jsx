import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import defaultImg from "../../images/default.jpeg";
import plusIcon from "../../images/icons/plus.png";
import close from "../../images/icons/close.png";
import * as animationData from "../../lottie/lottie.json";
import axiosInstance from "../../utils/axiosInstance";
import { useAppStore } from "../../store";
export default function AddNewUserModal({ closeModal, displayToggle }) {
  const [search, setSearch] = useState("");
  const [searchedContacts, setSearchContacts] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);

  const searchContactUrl = "http://localhost:5000/api/v1/contact/searchContact";
  const contactListUrl =
    "http://localhost:5000/api/v1/contactList/createContactList";
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  useEffect(() => {
    const searchContacts = async () => {
      try {
        const res = await axiosInstance.post(
          searchContactUrl,
          { search },
          { withCredentials: true }
        );
        if (res.data && res.status === 200) {
          console.log(res.data.users);
          setSearchContacts([...res.data.users]);
        }
      } catch (error) {
        console.log(error?.response?.data?.msg);
      }
    };
    if (search.length > 0) searchContacts();
    else setSearchContacts([]);
  }, [search]);
  const addToContactList = async (contact) => {
    try {
      const res = await axiosInstance.post(contactListUrl, contact, {
        withCredentials: true,
      });
      if (res.data && res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };
  return (
    <div
      className={`absolute ${
        cancelModal ? "hidden" : "flex"
      } w-[420px] h-[430px] bg-black px-14 py-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
     transition ease-in-out delay-200 duration-200 hover:shadow-[0_0px_60px_rgba(0,238,255)] z-[1000]`}
    >
      <div className="flex flex-col w-full items-center">
        <button
          className="w-4 h-4 ml-auto mb-6"
          onClick={() => {
            setCancelModal((prev) => !prev);
            closeModal();
          }}
        >
          <img className="w-full h-full" src={close} alt=""></img>
        </button>
        <div className="w-full">
          <div className="flex">
            <input
              className="flex w-full p-3 rounded-lg outline-none text-black"
              name="adduser"
              placeholder="search contact"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <div
          className={`flex flex-col w-full space-y-4 mt-6  ${
            searchedContacts.length > 0
              ? "overflow-auto max-h-52 scrollbar-hidden scrollbar-hidden::-webkit-scrollbar"
              : ""
          }`}
        >
          {searchedContacts.length > 0 &&
            searchedContacts.map((contact) => {
              return (
                <div key={contact._id} className="flex items-center">
                  <div className="w-10 h-10 mr-4">
                    <img
                      className="w-full h-full object-cover rounded-lg"
                      src={`http://localhost:5000/uploads/profiles/${contact.image}`}
                      alt=""
                    ></img>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">
                      {contact.firstname} {contact.lastname}{" "}
                    </span>
                    <span className="text-xs text-[#00eeff]">
                      {contact.email}
                    </span>
                  </div>
                  <button
                    className="w-6 h-6 flex justify-center ml-auto items-center rounded-md py-1 
                  bg-white/10 border-2 border-solid border-transparent hover:border-[#00eeff]"
                    onClick={() => {
                      console.log(contact);
                      // setChatType("contact");
                      setSelectedChatType("contact");
                      setCancelModal((prev) => !prev);
                      closeModal();
                      addToContactList(contact);
                    }}
                  >
                    <img className="w-4" src={plusIcon} alt=""></img>
                  </button>
                </div>
              );
            })}
          <div
            className={`${
              searchedContacts.length < 1
                ? "opacity-100 transition-opacity ease-in delay-200 duration-150"
                : "opacity-0 hidden"
            } `}
          >
            <div className=" ">
              <Lottie
                options={defaultOptions}
                height={200}
                width={200}
                isClickToPauseDisabled={true}
              />
            </div>
            <div className="w-full justify-center text-xl font-semibold flex mb-3">
              <p>Add a new &nbsp;</p>
              <span className="text-[#00eeff]">direct message</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
