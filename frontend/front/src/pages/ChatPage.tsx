import BackGround from "../components/BackGround";
import TopBar from "../components/TopBar";
import ChatRoomList from "../components/ChatPage/ChatRoomList";
import ChatUserList from "../components/ChatPage/ChatUserList";
import ChatArea from "../components/ChatPage/ChatArea";
import ChatRoomUserList from "../components/ChatPage/ChatRoomUserList";

import { useAtom } from "jotai";
import { userInfoModalAtom } from "../components/atom/ModalAtom";
import { inviteModalAtom } from "../components/atom/ModalAtom";
import { roomModalAtom } from "../components/atom/ModalAtom";

import UserInfoModal from "../components/ChatPage/UserInfoModal";
import RoomModal from "../components/ChatPage/RoomModal";
import RoomInviteModal from "../components/ChatPage/RoomInviteModal";

import { useEffect, useState } from 'react';
import * as socket from "../socket/socket";
import * as chatAtom from '../components/atom/SocketAtom';
import type * as chatType from '../socket/chatting.dto';

export default function ChatPage() {
  const [userInfoModal, setUserInfoModal] = useAtom(userInfoModalAtom);
  const [roomModal, setRoomModal] = useAtom(roomModalAtom);
  const [inviteModal, setInviteModal] = useAtom(inviteModalAtom);

  const [isFirstLogin, setIsFirstLogin] = useAtom(chatAtom.isFirstLoginAtom);
  const [userList, setUserList] = useAtom(chatAtom.userListAtom);
  const [userHistory, setUserHistory] = useAtom(chatAtom.userHistoryAtom);
  const [roomList, setRoomList] = useAtom(chatAtom.roomListAtom);
  const [focusRoom, setFocusRoom] = useAtom(chatAtom.focusRoomAtom);


  if (isFirstLogin) { // socket init info stage
    // call init event
    setIsFirstLogin(false);
  }

  return (
    <BackGround>
      <TopBar />
      {userInfoModal ? <UserInfoModal /> : null}
      {roomModal ? <RoomModal /> : null}
      {inviteModal ? <RoomInviteModal /> : null}
      <ChatRoomList />
      <ChatUserList />
      <ChatArea />
      <ChatRoomUserList />
    </BackGround>
  );
}
