package components;

/**
 * Component controlling Enemy ship movement and interaction with other elements
 * .
 * @author Marko Ristic
 */

import model.MovementTypes;
import com.genome2d.geom.GRectangle;
import model.Assets;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.particles.GSimpleParticleSystem;
import com.genome2d.components.renderables.GSprite;
import entities.EnemyShip;
import model.ModelLocator;
import model.AppModel;
import com.genome2d.components.GComponent;

class EnemyShipComponent extends GComponent
{
    private var _speed:Float = 0.2;
    private var _model:AppModel;
    private var _assets:Assets;
    private var _viewRect:GRectangle;
    private var _shipGraphic:GSprite;
    private var _exploding:Bool = false;
    private var _explodeDelay:Float = 120;
    private var _explosionEmitter:GSimpleParticleSystem;
    private var _amplitude:Float = 100;
    private var _initX:Float;
    private var _parentShip:EnemyShip;

    public function new()
    {
        super();

        _model = ModelLocator.instance().model;
        _assets = ModelLocator.instance().assets;
        _viewRect = _model.viewRect;
    }

    override public function init():Void
    {
        _parentShip = cast node;
        _initX = node.transform.x; // cache the initial value of the Enemy x position
        node.core.onUpdate.add(_update);
    }

    /**
    * Moving the Enemy and checking for interactions with other game elements.
    * @param deltaTime elapsed from the last frame
    */
    private function _update(deltaTime:Float):Void
    {

        // Due to a strange issue with HTML5 target where the initial stage is not centered like in Flash target
        // we need to adjust the position of this node when checking for Hit Testing when targeting HTML5

        #if flash
        var nodeX = node.transform.x;
        var nodeY = node.transform.y;
        #else
        var nodeX = node.transform.x + _viewRect.width / 2;
        var nodeY = node.transform.y + _viewRect.height / 2;
        #end

        if(!_exploding) // don't check collisions if the enemy is already hit
        {
            for(bullet in _model.playerBullets) // check for all the active bullet
            {
                // if bullet is colliding with an improvised box collider if enemy (nodeX, nodeY, false, 20, 20)
                if(bullet.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
                {
                    cast(bullet.getComponent(BulletComponent), BulletComponent).remove(); // remove the bullet
                    explode(); // explode the enemy
                }
            }
        }

        // Check player collision with improvised box collider if enemy (nodeX, nodeY, false, 20, 20)
        // Ignore if the player or enemy are already hit
        if(!_exploding && !_model.playerComponent.exploding
        && _model.player.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
        {
            _model.playerComponent.explode(); // explode the player
            explode(); // explode the enemy
        }

        // Moevement either straight or sinusoidal
        // TODO: Move both streight and sinusoidal movements to seperate components
        node.transform.y += _speed * deltaTime;
        if(_parentShip.movementType == MovementTypes.SINUSOIDAL)
        {
            node.transform.x = _initX + Math.sin(node.transform.y * Math.PI / 180) * _amplitude;
            //_amplitude *= 0.95;
        }

        // If exploding wait for it to finish and remove the enemy
        if(_exploding)
        {
            _explodeDelay--;
            if(_explodeDelay <= 0)
            {
                remove();
                return;
            }
        }

        // Remove enemy when it leaves camera view
        if(node.transform.y > _viewRect.height / 2 + 100)
        {
            remove();
        }
    }

    public function remove():Void
    {
        _model.removeEnemy(cast this.node);

        cast(node.getComponent(Shoot), Shoot).canFire = false; // Dead enemies can't shoot
        node.core.onUpdate.remove(_update);
        node.dispose();
    }

    /**
    * Explosion logic. Adding a simple Particle emitter that simulates explosion
    */

    public function explode():Void
    {
        if(_exploding) return;

        _exploding = true;
        cast(node, EnemyShip).graphics.node.transform.visible = false; // Hide enemy graphic
        cast(node.getComponent(Shoot), Shoot).canFire = false; // Dead enemies can't shoot

        if(_explosionEmitter == null)
        {
            _explosionEmitter = cast GNodeFactory.createNodeWithComponent(GSimpleParticleSystem, 'explosion_emitter');
            _explosionEmitter.texture = _assets.atlas.getSubTexture("Particle");
            _explosionEmitter.burst = true;
            _explosionEmitter.emit = true;
            _explosionEmitter.useWorldSpace = true;

            // Just setting some emission properties.
            // Just play around with the values untli it looks right
            _explosionEmitter.emission = 64;
            _explosionEmitter.energy = 0.5;
            _explosionEmitter.energyVariance = 0.2;
            _explosionEmitter.dispersionAngleVariance = Math.PI*2; // Particles are emitted in a 360 deg angle
            _explosionEmitter.initialVelocity = 80;
            _explosionEmitter.initialVelocityVariance = 80;
            _explosionEmitter.initialScale = 0.7;
            _explosionEmitter.initialScaleVariance = 0.3;
            _explosionEmitter.endScale = 0.2;
            _explosionEmitter.endScaleVariance = 0.1;

            // Changing colors from emission to death
            _explosionEmitter.initialAlpha = 1;
            _explosionEmitter.initialBlue = 4;
            _explosionEmitter.initialGreen = 1;
            _explosionEmitter.initialRed = 3;
            _explosionEmitter.endAlpha = 0;
            _explosionEmitter.endBlue = 5;
            _explosionEmitter.endGreen = 2;
            _explosionEmitter.endRed = 3;

            node.addChild(_explosionEmitter.node);
        }
    }
}
