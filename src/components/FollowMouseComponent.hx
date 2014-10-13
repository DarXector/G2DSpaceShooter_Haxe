package components;

/**
 * Component controlling entities that need to follow the mouse
 * .
 * @author Marko Ristic
 */

import com.genome2d.signals.GMouseSignalType;
import com.genome2d.signals.GMouseSignal;
import com.genome2d.geom.GRectangle;
import com.genome2d.Genome2D;
import model.ModelLocator;
import com.genome2d.Genome2D;
import com.genome2d.components.GComponent;

class FollowMouseComponent extends GComponent
{
    private var _viewRect:GRectangle;
    private var _stage:Dynamic;

    public function new()
    {
        super();
        _viewRect = ModelLocator.instance().model.viewRect;
        _stage = Genome2D.getInstance().getContext().getNativeStage();
    }

    override public function init():Void
    {
        // When targetting HTML5 we can't access the Mouse position through update signal
        // So we need to listen for mouse move signal

        #if flash
        node.core.onUpdate.add(_update);
        #else
        Genome2D.getInstance().getContext().onMouseSignal.add(_onMouse);
        #end

    }


    /**
    * Moving the Enemy and checking for interactions with other game elements.
    * @param deltaTime elapsed from the last frame
    */

    //TODO: Should probably integrate delta time in this logic for smoother movement with easing
    private function _update(deltaTime:Float)
    {
        node.transform.x = _stage.mouseX - _viewRect.width / 2;
        node.transform.y = _stage.mouseY - _viewRect.height / 2;
    }

    /**
    * \On mouse interaction
    * @param e GMouseSignal ony check for MouseMove event
    */
    private function _onMouse(e:GMouseSignal):Void
    {
        if(e.type == GMouseSignalType.MOUSE_MOVE)
        {
            node.transform.x = e.x - _viewRect.width / 2;
            node.transform.y = e.y - _viewRect.height / 2;
        }
    }
}
