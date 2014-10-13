package entities;

/**
 * Background entity
 * .
 * @author Marko Ristic
 */

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

    /**
    * Constructer of the bullet
    * @_owner who shot the bullet
    * @_model just passing the main model. A samll optimisation action
    * @texture also passing the texture for optimisation
    * @_x start x position of the bullet
    * @_y start y position of the bullet
    */

    public function new(_owner:String, _model:AppModel, texture:GTexture, _x:Float, _y:Float)
    {
        super('player_bullet');

        this.transform.x = _x;
        this.transform.y = _y;

        owner = _owner;

        // Adding graphic from Sprite Atlas
        graphics = cast GNodeFactory.createNodeWithComponent(GSprite, 'player_bullet_graphic');
        graphics.texture = texture;

        // If the enemy is shooting rotate the by 180deg
        if(owner == BulletOwner.ENEMY)
        {
            graphics.node.transform.rotation = Math.PI;
        }
        addChild(graphics.node);

        // Add Bullet to object pool
        _model.addBullet(this);

        // add component controlling bullet movement and interaction
        this.addComponent(BulletComponent);
    }
}
