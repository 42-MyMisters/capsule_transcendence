import { io } from 'socket.io-client';
import { useAtom } from "jotai";
import * as chatAtom from '../components/atom/ChatAtom';
import * as userAtom from '../components/atom/UserAtom';
import type * as chatType from './chat.dto';

const URL = "http://localhost:4000";
const NameSpace = "/sock";

export const socket = io(`${URL}${NameSpace}`, {
	auth: (cb) => {
		cb({ token: localStorage.getItem("refreshToken") });
	},
	autoConnect: false,
	transports: ["websocket"],
	// reconnectionDelay: 1000, // defaults to 1000
	// reconnectionDelayMax: 10000, // defaults to 5000
	// withCredentials: true,
	// path: "/socket.io",
});

export function emitRoomCreate(
	roomName: string,
	roomCheck: boolean = false,
	roomPass: string = ''
) {
	const roomType = roomCheck
		? 'private'
		: roomPass
			? 'protected'
			: 'open';
	socket.emit("room-create", {
		roomName,
		roomType,
		roomPass,
	}, ({
		status,
	}: {
		status: 'ok' | 'ko',
	}) => {
		switch (status) {
			case 'ok': {
				console.log("room-create success");
				break;
			}
			case 'ko': {
				console.log("room-create fail");
				alert(`${roomName} room-create fail`);
				break;
			}
		};
	});
}

export function emitRoomJoin(
	{
		roomList,
		setRoomList,
		focusRoom,
		setFocusRoom
	}: {
		roomList: chatType.roomListDto,
		setRoomList: React.Dispatch<React.SetStateAction<chatType.roomListDto>>,
		focusRoom: number,
		setFocusRoom: React.Dispatch<React.SetStateAction<number>>,
	},
	roomId: number,
	roomPass?: string,
) {
	socket.emit("room-join", {
		roomId,
		roomPass,
	}, ({
		status,
		payload
	}: {
		status: 'ok' | 'ko';
		payload?: string;
	}) => {
		switch (status) {
			case 'ok': {
				console.log(`${roomList[roomId].roomName} room-join success`);
				break;
			}
			case 'ko': {
				alert(`room-join fail: \n\n${payload}`);
				break;
			}
		}
	});
}

export function emitRoomLeave(
	{
		roomList,
		setRoomList,
		focusRoom,
		setFocusRoom
	}: {
		roomList: chatType.roomListDto,
		setRoomList: React.Dispatch<React.SetStateAction<chatType.roomListDto>>,
		focusRoom: number,
		setFocusRoom: React.Dispatch<React.SetStateAction<number>>,
	},
	roomId: number,
	ban: boolean = false
) {
	socket.emit("room-leave", {
		roomId
	}, ({
		status,
	}: {
		status: 'leave' | 'delete',
	}) => {
		if (status === 'leave') {
			console.log(`callback: room leaved: ${roomList[roomId].roomName}`);
			const newRoomList: chatType.roomListDto = {};
			newRoomList[roomId] = {
				roomName: roomList[roomId].roomName,
				roomType: roomList[roomId].roomType,
				isJoined: false,
			}
			setRoomList({ ...roomList, ...newRoomList });
			if (focusRoom === roomId) {
				setFocusRoom(-1);
			}
		} else {
			console.log(`callback: room delete: ${roomList[roomId].roomName}`);
		}
	});
}

export function emitRoomInAction(
	{
		roomList,
		setRoomList,
	}: {
		roomList: chatType.roomListDto,
		setRoomList: React.Dispatch<React.SetStateAction<chatType.roomListDto>>,
	},
	roomId: number,
	action: 'ban' | 'kick' | 'mute' | 'admin',
	targetId: number,
) {
	socket.emit("room-in-action", {
		roomId,
		action,
		targetId,
	}, ({
		status,
		payload,
	}: {
		status: 'ok' | 'ko',
		payload?: string,
	}) => {
		switch (status) {
			case 'ok': {
				console.log(`room - inaction in ${roomId} to ${targetId} with ${action} OK`);
				break;
			}
			case 'ko': {
				console.log(`room - inaction in ${roomId} to ${targetId} with ${action} failed: ${payload} `);
				alert(`Room in Action [${action}] is faild: ${payload}`);
				break;
			}
		}
	});
}

export function emitUserBlock(
	{
		userBlockList,
		setUserBlockList,
	}: {
		userBlockList: chatType.userSimpleDto,
		setUserBlockList: React.Dispatch<React.SetStateAction<chatType.userSimpleDto>>,
	},
	targetId: number,
) {
	// TODO: API call
	socket.emit("user-block", {
		targetId
	}, ({
		status,
		payload
	}: {
		status: 'on' | 'off' | 'ko',
		payload?: string,
	}) => {
		switch (status) {
			case 'on': {
				const newBlockUser: chatType.userSimpleDto = {};
				newBlockUser[targetId] = {
					blocked: true
				}
				setUserBlockList({ ...userBlockList, ...newBlockUser });
				break;
			}
			case 'off': {
				const newBlockList: chatType.userSimpleDto = { ...userBlockList };
				delete newBlockList[targetId];
				setUserBlockList({ ...newBlockList });
				break;
			}
			case 'ko': {
				console.log(`user - block failed: ${payload} `);
				alert(`block failed: ${payload}`);
				break;
			}
		}
	});
}

export function emitMessage(
	{
		roomList,
	}: {
		roomList: chatType.roomListDto,
	},
	roomId: number,
	message: string,
) {
	if (roomList[roomId]?.detail?.myRoomStatus === 'mute') {
		alert('You are muted for 10 sec in this room');
		return;
	}
	socket.emit("message", {
		roomId,
		message
	}, ({
		status,
		payload,
	}: {
		status: 'ok' | 'ko',
		payload?: 'string'
	}) => {
		switch (status) {
			case 'ok': {
				console.log(`message to ${roomList[roomId].roomName} is sended: ${message} `);
				break;
			}
			case 'ko': {
				console.log(`message to ${roomId} is failed: \n\n${payload} `);
				alert(`message failed: ${payload}`);
				break;
			}
		}
	});
}

export function setNewDetailToNewRoom({
	roomList,
	setRoomList,
	roomId,
	newUserList,
}: {
	roomList: chatType.roomListDto,
	setRoomList: React.Dispatch<React.SetStateAction<chatType.roomListDto>>,
	roomId: number,
	newUserList: chatType.userInRoomListDto
}, status?: chatType.userRoomStatus,
	power?: chatType.userRoomPower) {
	const newRoomList: chatType.roomListDto = {}
	newRoomList[roomId] = {
		roomName: roomList[roomId].roomName,
		roomType: roomList[roomId].roomType,
		isJoined: roomList[roomId].isJoined,
		detail: {
			userList: { ...newUserList },
			messageList: roomList[roomId].detail?.messageList || [],
			myRoomStatus: status || roomList[roomId].detail?.myRoomStatus || 'normal',
			myRoomPower: power || roomList[roomId].detail?.myRoomPower || 'member'
		}
	};
	console.log(`newRoomList: ${JSON.stringify(newRoomList)}`);
	console.log(`\n newUser list: ${JSON.stringify(newUserList)}`);
	setRoomList({ ...roomList, ...newRoomList });
}
