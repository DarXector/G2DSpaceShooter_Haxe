package components;

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
        #if flash
        node.core.onUpdate.add(_update);
        #else
        Genome2D.getInstance().getContext().onMouseSignal.add(_onMouse);
        #end

    }

    private function _update(dt:Float)
    {
        node.transform.x = _stage.mouseX - _viewRect.width / 2;
        node.transform.y = _stage.mouseY - _viewRect.height / 2;
    }


    private function _onMouse(e:GMouseSignal):Void
    {
        if(e.type == GMouseSignalType.MOUSE_MOVE)
        {
            node.transform.x = e.x - _viewRect.width / 2;
            node.transform.y = e.y - _viewRect.height / 2;
        }
    }
}
