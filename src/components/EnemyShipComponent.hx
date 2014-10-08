package components;

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
        _initX = node.transform.x;
        node.core.onUpdate.add(_update);
    }

    private function _update(deltaTime:Float):Void
    {

        #if flash
        var nodeX = node.transform.x;
        var nodeY = node.transform.y;
        #else
        var nodeX = node.transform.x + _viewRect.width / 2;
        var nodeY = node.transform.y + _viewRect.height / 2;
        #end

        if(!_exploding)
        {
            for(bullet in _model.playerBullets)
            {
                if(bullet.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
                {
                    cast(bullet.getComponent(BulletComponent), BulletComponent).remove();
                    explode();
                }
            }
        }

        if(!_exploding && !_model.playerComponent.exploding
        && _model.player.graphics.hitTestPoint(nodeX, nodeY, false, 20, 20))
        {
            _model.playerComponent.explode();
            explode();
        }

        node.transform.y += _speed * deltaTime;
        if(_parentShip.movementType == MovementTypes.SINUSOIDAL)
        {
            node.transform.x = _initX + Math.sin(node.transform.y * Math.PI / 180) * _amplitude;
            //_amplitude *= 0.95;
        }

        if(_exploding)
        {
            _explodeDelay--;
            if(_explodeDelay <= 0)
            {
                remove();
                return;
            }
        }

        if(node.transform.y > _viewRect.height / 2 + 100)
        {
            remove();
        }
    }

    public function remove():Void
    {
        _model.removeEnemy(cast this.node);

        cast(node.getComponent(Shoot), Shoot).canFire = false;
        node.core.onUpdate.remove(_update);
        node.dispose();
    }

    public function explode():Void
    {
        if(_exploding) return;

        _exploding = true;
        cast(node, EnemyShip).graphics.node.transform.visible = false;
        cast(node.getComponent(Shoot), Shoot).canFire = false;

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
            _explosionEmitter.initialVelocity = 80;
            _explosionEmitter.initialVelocityVariance = 80;
            _explosionEmitter.initialScale = 0.7;
            _explosionEmitter.initialScaleVariance = 0.3;
            _explosionEmitter.endScale = 0.2;
            _explosionEmitter.endScaleVariance = 0.1;
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
