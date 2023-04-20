import { useAtom } from "jotai";
import { inviteModalAtom } from "../../components/atom/ModalAtom";
import { PressKey } from "../../event/pressKey";

import "../../styles/RoomInviteModal.css";

export default function RoomInviteModal() {
  const [inviteModal, setInviteModal] = useAtom(inviteModalAtom);

  PressKey(["Escape"], () => { setInviteModal(false); });

  return (
    <>
      <div className="RoomInviteModalBG"></div>
      <div className="RoomInviteModal">
        <div className="InviteForm">
          <label htmlFor="Invite">NickName</label>
          <input id="Invite" type="text"></input>
        </div>
        <button className="Invite">Invite</button>
        <button className="InviteCancel" onClick={() => setInviteModal(false)}>
          Cancel
        </button>
      </div>
    </>
  );
}
