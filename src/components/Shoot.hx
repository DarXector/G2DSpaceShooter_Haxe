package components;

/**
* Component controlling Player and Enemy shooting
* .
* @author Marko Ristic
*/

import entities.Bullet;
import model.BulletOwner;
import entities.Player;
import com.genome2d.signals.GMouseSignalType;
import com.genome2d.signals.GMouseSignal;
import com.genome2d.Genome2D;
import com.genome2d.textures.GTexture;
import model.AppModel;
import model.ModelLocator;
import com.genome2d.components.GComponent;

class Shoot extends GComponent
{
    private var _intervalTime:Int = 10;
    private var _delay:Int;
    private var _mouseDown:Bool;
    private var _model:AppModel;
    private var _texture:GTexture;
    private var _owner:String;
    public var canFire:Bool;

    public function new()
    {
        super();

        _model = ModelLocator.instance().model;

        Genome2D.getInstance().getContext().onMouseSignal.add(_onMouse);
    }

    override public function init():Void
    {

        // Get weather the node this component is attached to is Player or Enemy
        // And set shot interval and delay properties depending on that
        if(Type.getClass(node) == Player)
        {
            _owner = BulletOwner.PLAYER;
            _delay = _intervalTime = 10;
        } else
        {
            _owner = BulletOwner.ENEMY;
            _intervalTime = 100;
            _delay = Math.round(Math.random() * 100);
        }

        _texture = ModelLocator.instance().assets.atlas.getSubTexture('PlayerBullet');

        canFire = true;

        node.core.onUpdate.add(_update);
    }

    /**
    * Check when the player has pressed or released the mouse button
    * @param e GMouseSignal
    * When mouse is down Shoot.
    */

    private function _onMouse(e:GMouseSignal):Void
    {
        switch e.type
        {
            case GMouseSignalType.MOUSE_DOWN:
                _mouseDown = true;
            case GMouseSignalType.MOUSE_UP:
                _mouseDown = false;
        }
    }

    /**
    * When the delay time between shots has passed shoot
    * @param deltaTime elapsed from the last frame
    */

    private function _update(deltaTime:Float):Void
    {
        if(_delay >0)
        {
            _delay--;
        }
        else
        {
            // Check weather the entity is enemy. If not it is the player. Then check if the mous is down.
            // Make shure that this entity can shoot
            if((_owner == BulletOwner.ENEMY || _mouseDown) && canFire)
            {
                _shoot();
            }
        }
    }

    private function _shoot():Void
    {
        // REset the timer
        _delay = _intervalTime;

        // Instantiate bullets
        var b = new Bullet(_owner, _model, _texture, this.node.transform.x - 10, this.node.transform.y);
        var c = new Bullet(_owner, _model, _texture, this.node.transform.x + 14, this.node.transform.y);
    }


    /*private function _onDestroyed():Void
    {
        canFire = false;
        node.core.onUpdate.remove(_update);
    }*/
}
