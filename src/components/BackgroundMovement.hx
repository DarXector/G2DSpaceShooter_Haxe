package components;
import com.genome2d.geom.GRectangle;
import model.Registry;
import model.ModelLocator;
import com.genome2d.components.GComponent;

class BackgroundMovement extends GComponent
{
    private var _speed:Float = 0.1;
    private var _viewRect:GRectangle;

    public function new()
    {
        super();

        _viewRect =  ModelLocator.instance().registry.viewRect;

    }
    override public function init():Void
    {
        node.core.onUpdate.add(_update);
    }

    private function _update(deltaTime:Float):Void
    {
        node.transform.y += _speed * deltaTime;
        if(node.transform.y >= _viewRect.height)
        {
            node.transform.y = 0;
        }
    }
}
