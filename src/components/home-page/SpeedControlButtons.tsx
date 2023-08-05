import Button from "../buttons/Button";
import speedUp_img from "../../assets/images/ui/icons/speed-up.png";
import play_img from "../../assets/images/ui/icons/play.png";
import { createSignal } from "solid-js";
import AppAnimation from "../../animations/AppAnimation";

const SpeedControlButtons: Solid.Component = ()=> {
    const [isSpeedUp, setIsSpeedUp] = createSignal<boolean>(false);
    
    const iconImage = ()=> isSpeedUp() ? play_img : speedUp_img;
    
    function onSpeedToggleClick() {
        setIsSpeedUp(old=> !old);

        AppAnimation.timeScale = isSpeedUp() ? 10 : 1;
    }
    
    return (
        <div class="speed-controls row-centered p-2 gap-2">
            <Button onClick={ onSpeedToggleClick }>
                <img src={ iconImage() } />
            </Button>
        </div>
    );
};

export default SpeedControlButtons;