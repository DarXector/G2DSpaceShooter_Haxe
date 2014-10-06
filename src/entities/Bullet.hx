package entities;

import model.BulletOwner;
import String;
import com.genome2d.textures.GTexture;
import model.Registry;
import components.BulletComponent;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import com.genome2d.node.GNode;

class Bullet extends GNode
{
    public var graphics(default, null):GSprite;
    public var owner(default, null):String;

    public function new(_owner:String, registry:Registry, texture:GTexture, _x:Float, _y:Float)
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

        this.addComponent(BulletComponent);

        registry.gameState.addChild(this);
        if(owner == BulletOwner.PLAYER)
        {
            registry.playerBullets.push(this);
        } else
        {
            registry.enemyBullets.push(this);
        }
    }
}
