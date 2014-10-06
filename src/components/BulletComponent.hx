package components;

import model.BulletOwner;
import entities.Bullet;
import com.genome2d.geom.GRectangle;
import model.Registry;
import model.ModelLocator;
import com.genome2d.components.GComponent;

class BulletComponent extends GComponent
{
    private var _speed:Float = 1;
    private var _viewRect:GRectangle;
    private var _registry:Registry;
    private var _bullets:Array<Bullet>;
    private var _owner:String;

    public function new()
    {
        super();

        _registry = ModelLocator.instance().registry;
        _viewRect = _registry.viewRect;
    }

    override public function init():Void
    {
        _owner = cast(node, Bullet).owner;
        if(_owner == BulletOwner.PLAYER)
        {
            _bullets = _registry.playerBullets;
        } else
        {
            _bullets = _registry.enemyBullets;
        }

        node.core.onUpdate.add(_update);
    }

    private function _update(deltaTime:Float):Void
    {
        if(node == null) return;
        if(_owner == BulletOwner.PLAYER)
        {
            node.transform.y -= _speed * deltaTime;
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
        _registry.gameState.removeChild(this.node);

        for(bullet in _bullets)
        {
            if(bullet == this.node)
            {
                _bullets.remove(bullet);
                break;
            }
        }

        node.core.onUpdate.remove(_update);
        node.dispose();
    }
}
