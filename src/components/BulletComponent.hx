package components;

/**
 * Component controlling bullet movement
 * .
 * @author Marko Ristic
 */


import model.BulletOwner;
import entities.Bullet;
import com.genome2d.geom.GRectangle;
import model.AppModel;
import model.ModelLocator;
import com.genome2d.components.GComponent;

class BulletComponent extends GComponent
{
    private var _speed:Float = 1;
    private var _viewRect:GRectangle;
    private var _model:AppModel;
    private var _owner:String;

    public function new()
    {
        super();

        _model = ModelLocator.instance().model;
        _viewRect = _model.viewRect;
    }

    override public function init():Void
    {
        _owner = cast(node, Bullet).owner;

        node.core.onUpdate.add(_update);
    }

    /**
    * Moving the bullet along the Y axes.
    * If player shot, upward
    * If Enemy shot, downward
    * @param deltaTime elapsed from the last frame
    */

    private function _update(deltaTime:Float):Void
    {
        if(node == null) return;
        if(_owner == BulletOwner.PLAYER)
        {
            node.transform.y -= _speed * deltaTime; // speed times delta time to make a smooth movement regardless od FPS

            // When the bullet exits the camera view remove it from the stage and pool.
            if(node.transform.y < -_viewRect.height / 2 - 50)
            {
                remove();
            }
        } else
        {
            node.transform.y += _speed * deltaTime;
            if(node.transform.y > _viewRect.height / 2)
            {
                remove();
            }
        }
    }

    public function remove():Void
    {
        _model.removeBullet(cast this.node);

        // Kill the update method. can create issues if this is not removed.
        node.core.onUpdate.remove(_update);
        node.dispose();
    }
}
