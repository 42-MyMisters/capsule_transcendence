import BackGround from "../components/BackGround";
import ProfilePageBG from "../components/ProfilePage/ProfilePageBG";
import ProfileNick from "../components/ProfilePage/ProfileNick";
import ProfileOptions from "../components/ProfilePage/ProfileOptions";
import TopBar from "../components/TopBar";
import ProfileImage from "../components/ProfilePage/ProfileImage";
import ProfileFriend from "../components/ProfilePage/ProfileFriend";
import ProfileMatchHistory from "../components/ProfilePage/ProfileMatchHistory";
import ChangeNameModal from "../components/ProfilePage/ChangeNameModal";
import ChangeImageModal from "../components/ProfilePage/ChangeImageModal";

import { useAtom } from "jotai";
import { changeNameModalAtom } from "../components/atom/ModalAtom";
import { changeImageModalAtom } from "../components/atom/ModalAtom";
import { UserAtom } from "../components/atom/UserAtom";

export default function ProfilePage() {
  const [changeNameModal, setchangeNameModal] = useAtom(changeNameModalAtom);
  const [changeImageModal, setchangeImageModal] = useAtom(changeImageModalAtom);
  const [userInfo, setUserInfo] = useAtom(UserAtom);

  return (
    <BackGround>
      <TopBar />
      {changeNameModal ? <ChangeNameModal /> : null}
      {changeImageModal ? <ChangeImageModal /> : null}
      <ProfilePageBG>
        <ProfileImage imgUrl={userInfo?.profileUrl ?? "/src/assets/smile.png"} />
        <ProfileNick nickName={userInfo?.nickname ?? "NickName"} />
        <ProfileOptions />
        <ProfileFriend />
        <ProfileMatchHistory />
      </ProfilePageBG>
    </BackGround>
  );
}
