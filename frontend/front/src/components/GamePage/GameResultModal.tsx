import { useAtom } from "jotai";
import "../../styles/GameResultModal.css";
import { gameResultModalAtom } from "../atom/ModalAtom";
import { useNavigate } from "react-router-dom";

export default function GameResultModal({
  result,
  leftScore,
  rightScore,
}: {
  result: boolean;
  leftScore: number;
  rightScore: number;
}) {
  const [, setGameResultModal] = useAtom(gameResultModalAtom);
  const navigate = useNavigate();

  return (
    <>
      <div className="GameResultModalBG" />
      <div className="GameResultModal">
        <div className="GameResultModalTxt">{result ? "You Win!" : "You Lose"}</div>
        <div className="GameResultModalScore">{`${leftScore} : ${rightScore}`}</div>
        <button
          className="GameResultModalBtn"
          onClick={() => {
            setGameResultModal(false);
            navigate("/chat");
          }}
        >
          OK
        </button>
      </div>
    </>
  );
}
