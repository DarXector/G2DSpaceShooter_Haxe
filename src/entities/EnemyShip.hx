package entities;

import components.Shoot;
import model.MovementTypes;
import components.EnemyShipComponent;
import com.genome2d.textures.GTexture;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import model.Registry;
import com.genome2d.node.GNode;

class EnemyShip extends GNode
{
    public var graphics(default, null):GSprite;
    public var movementType(default, null):String;

    public function new(registry:Registry, texture:GTexture)
    {
        super('enemy_ship');

        graphics = cast GNodeFactory.createNodeWithComponent(GSprite, 'enemy_ship_graphics');
        graphics.texture = texture;
        addChild(graphics.node);

        this.transform.x = (Math.random() * registry.viewRect.width - registry.viewRect.width / 2) * 0.9;
        this.transform.y = -registry.viewRect.height / 2 - 50;

        registry.gameState.addChild(this);
        registry.enemies.push(this);

        movementType = Math.round(Math.random()) == 0? MovementTypes.SINUSOIDAL : MovementTypes.STREIGHT;

        this.addComponent(Shoot);
        this.addComponent(EnemyShipComponent);
    }
}
