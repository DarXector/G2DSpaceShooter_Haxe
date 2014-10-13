package entities;

/**
 * Enemy Ship entity
 * .
 * @author Marko Ristic
 */

import components.Shoot;
import model.MovementTypes;
import components.EnemyShipComponent;
import com.genome2d.textures.GTexture;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import model.AppModel;
import com.genome2d.node.GNode;

class EnemyShip extends GNode
{
    public var graphics(default, null):GSprite;
    public var movementType(default, null):String;

    public function new(_model:AppModel, texture:GTexture)
    {
        super('enemy_ship');

        // Adding graphic from Sprite Atlas
        graphics = cast GNodeFactory.createNodeWithComponent(GSprite, 'enemy_ship_graphics');
        graphics.texture = texture;
        addChild(graphics.node);

        // Postion the enemy just outside the camera view and at random position along the x axis;
        this.transform.x = (Math.random() * _model.viewRect.width - _model.viewRect.width / 2) * 0.9;
        this.transform.y = -_model.viewRect.height / 2 - 50;

        // Add enemy to the object pool
        _model.addEnemy(this);

        // Deside weather this enemy should have straight or sinusoidal movement
        movementType = Math.round(Math.random()) == 0? MovementTypes.SINUSOIDAL : MovementTypes.STREIGHT;

        // Add shooting ability and movement and interaction component
        this.addComponent(Shoot);
        this.addComponent(EnemyShipComponent);
    }
}
