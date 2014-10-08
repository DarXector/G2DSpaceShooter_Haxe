package entities;

import model.BulletOwner;
import String;
import com.genome2d.textures.GTexture;
import model.AppModel;
import components.BulletComponent;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import com.genome2d.node.GNode;

class Bullet extends GNode
{
    public var graphics(default, null):GSprite;
    public var owner(default, null):String;

    public function new(_owner:String, _model:AppModel, texture:GTexture, _x:Float, _y:Float)
    {
        super('player_bullet');

        this.transform.x = _x;
        this.transform.y = _y;

        owner = _owner;

        graphics = cast GNodeFactory.createNodeWithComponent(GSprite, 'player_bullet_graphic');
        graphics.texture = texture;
        if(owner == BulletOwner.ENEMY)
        {
            graphics.node.transform.rotation = Math.PI;
        }
        addChild(graphics.node);

        _model.addBullet(this);

        this.addComponent(BulletComponent);
    }
}
