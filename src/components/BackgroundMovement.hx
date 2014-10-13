package components;

/**
 * Component controlling background Node continuous scroll
 * .
 * @author Marko Ristic
 */

import com.genome2d.geom.GRectangle;
import model.AppModel;
import model.ModelLocator;
import com.genome2d.components.GComponent;

class BackgroundMovement extends GComponent
{
    private var _speed:Float = 0.1;
    private var _viewRect:GRectangle;

    public function new()
    {
        super();

        _viewRect =  ModelLocator.instance().model.viewRect;

    }
    override public function init():Void
    {
        node.core.onUpdate.add(_update);
    }

    /**
     * Changing y postiion of the background node. When the node reaches the upper edge it is scrolled back up, faking the continuous motion
     * @param deltaTime elapsed from the last frame
    */

    private function _update(deltaTime:Float):Void
    {
        node.transform.y += _speed * deltaTime;
        if(node.transform.y >= _viewRect.height)
        {
            node.transform.y = 0;
        }
    }
}
