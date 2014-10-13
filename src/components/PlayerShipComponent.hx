package components;

/**
 * Component controlling Player ship interaction with other entities
 * .
 * @author Marko Ristic
 */

import model.AppModel;
import model.ModelLocator;
import model.Assets;
import com.genome2d.components.renderables.particles.GSimpleParticleSystem;
import com.genome2d.node.factory.GNodeFactory;
import entities.Player;
import com.genome2d.components.GComponent;

class PlayerShipComponent extends GComponent
{
    private var _explosionTimer:Int = 120;
    private var _explosionDelay:Int = 120;
    public var exploding:Bool;
    private var _explosionEmitter:GSimpleParticleSystem;
    private var _assets:Assets;
    private var _model:AppModel;
    private var _shootComponent:Shoot;

    private var _invulnerableTimer:Int = 120;

    public function new()
    {
        super();

        _assets = ModelLocator.instance().assets;
        _model = ModelLocator.instance().model;
    }

    override public function init():Void
    {
        _shootComponent = cast(node.getComponent(Shoot), Shoot);
        node.core.onUpdate.add(_update);
    }

    /**
    * Checking for interactions with other game elements.
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
        var nodeX = node.transform.x + _model.viewRect.width / 2;
        var nodeY = node.transform.y + _model.viewRect.height / 2;
        #end

        // Checking for collision with bullets
        // Don't check if player is already hit
        if(!exploding)
        {
            for(bullet in _model.enemyBullets)
            {
                // if bullet is colliding with an improvised box collider if enemy (nodeX, nodeY, false, 20, 20)
                if(bullet.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
                {
                    cast(bullet.getComponent(BulletComponent), BulletComponent).remove(); // remove bullet
                    explode(); // explode player ship
                }
            }
        }

        // if exploading wait for the exploade to finish and respawn the player ship
        if(exploding)
        {
            _explosionDelay--;
            if(_explosionDelay <= 0)
            {
                _explosionDelay = _explosionTimer;
                _respawn();
            }
        }

        // when player is respawned it is invulnerable for a certain period of time
        if(_invulnerableTimer > 0)
        {
            _invulnerableTimer--;
        }
    }

    /**
    * Respawning the player ship
    */

    private function _respawn():Void
    {
        _model.player.booster.forceBurst(); // restart engines
        exploding = false;
        _shootComponent.canFire = true;
        _model.player.graphics.node.transform.visible = true; // show graphic
        _model.player.booster.node.transform.visible = true; // show engine exhaust
        _model.player.booster.emit = true; // restart engines

        _invulnerableTimer = 120;
    }

    /**
    * Exploding the player ship if it is not already exploading
    * And if it is not invulnerable
    */

    public function explode():Void
    {
        if(exploding || _invulnerableTimer > 0) return;

        exploding = true;
        _model.player.graphics.node.transform.visible = false; // hide ship graphic
        _model.player.booster.node.transform.visible = false; // hide engine exhaust
        _shootComponent.canFire = false;

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
            _explosionEmitter.initialVelocity = 100;
            _explosionEmitter.initialVelocityVariance = 100;
            _explosionEmitter.initialScale = 0.7;
            _explosionEmitter.initialScaleVariance = 0.3;
            _explosionEmitter.endScale = 0.2;
            _explosionEmitter.endScaleVariance = 0.1;

            // Changing particle color from emission to death
            _explosionEmitter.initialAlpha = 1;
            _explosionEmitter.initialBlue = 2;
            _explosionEmitter.initialGreen = 1;
            _explosionEmitter.initialRed = 4;
            _explosionEmitter.endAlpha = 0;
            _explosionEmitter.endBlue = 1;
            _explosionEmitter.endGreen = 2;
            _explosionEmitter.endRed = 4;
            node.addChild(_explosionEmitter.node);
        } else
        {
            _explosionEmitter.forceBurst(); // if the explosion emitter is already instantiated just restart the emitter
        }
    }
}
