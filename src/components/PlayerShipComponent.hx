package components;

import model.Registry;
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
    private var _registry:Registry;
    private var _shootComponent:Shoot;

    private var _invulnerableTimer:Int = 120;

    public function new()
    {
        super();

        _assets = ModelLocator.instance().assets;
        _registry = ModelLocator.instance().registry;
        _registry.playerComponent = this;
    }

    override public function init():Void
    {
        _shootComponent = cast(node.getComponent(Shoot), Shoot);
        node.core.onUpdate.add(_update);
    }

    private function _update(deltaTime:Float):Void
    {
        #if flash
        var nodeX = node.transform.x;
        var nodeY = node.transform.y;
        #else
        var nodeX = node.transform.x + _registry.viewRect.width / 2;
        var nodeY = node.transform.y + _registry.viewRect.height / 2;
        #end

        if(!exploding)
        {
            for(bullet in _registry.enemyBullets)
            {
                if(bullet.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
                {
                    cast(bullet.getComponent(BulletComponent), BulletComponent).remove();
                    explode();
                }
            }
        }

        if(exploding)
        {
            _explosionDelay--;
            if(_explosionDelay <= 0)
            {
                _explosionDelay = _explosionTimer;
                _respawn();
            }
        }

        if(_invulnerableTimer > 0)
        {
            _invulnerableTimer--;
        }
    }

    private function _respawn():Void
    {
        _registry.player.booster.forceBurst();
        exploding = false;
        _shootComponent.canFire = true;
        _registry.player.graphics.node.transform.visible = true;
        _registry.player.booster.node.transform.visible = true;
        _registry.player.booster.emit = true;

        _invulnerableTimer = 120;
    }


    public function explode():Void
    {
        if(exploding || _invulnerableTimer > 0) return;

        exploding = true;
        _registry.player.graphics.node.transform.visible = false;
        _registry.player.booster.node.transform.visible = false;
        _shootComponent.canFire = false;

        if(_explosionEmitter == null)
        {
            _explosionEmitter = cast GNodeFactory.createNodeWithComponent(GSimpleParticleSystem, 'explosion_emitter');
            _explosionEmitter.texture = _assets.atlas.getSubTexture("Particle");
            _explosionEmitter.burst = true;
            _explosionEmitter.emit = true;
            _explosionEmitter.useWorldSpace = true;

            _explosionEmitter.emission = 64;
            _explosionEmitter.energy = 0.5;
            _explosionEmitter.energyVariance = 0.2;
            _explosionEmitter.dispersionAngleVariance = Math.PI*2;
            _explosionEmitter.initialVelocity = 100;
            _explosionEmitter.initialVelocityVariance = 100;
            _explosionEmitter.initialScale = 0.7;
            _explosionEmitter.initialScaleVariance = 0.3;
            _explosionEmitter.endScale = 0.2;
            _explosionEmitter.endScaleVariance = 0.1;
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
            _explosionEmitter.forceBurst();
        }
    }
}
