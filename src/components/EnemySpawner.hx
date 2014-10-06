package components;

import com.genome2d.textures.GTexture;
import model.Registry;
import model.ModelLocator;
import entities.EnemyShip;
import com.genome2d.components.GComponent;

class EnemySpawner extends GComponent
{
    private var _enemySpawnInterval:Int = 60;
    private var _enemySpawnCounter:Int = 60;
    private var _registry:Registry;
    private var _texture:GTexture;

    public function new()
    {
        super();

        _registry = ModelLocator.instance().registry;
        _texture = ModelLocator.instance().assets.atlas.getSubTexture('EnemySpaceship');
    }

    override public function init():Void
    {
        node.core.onUpdate.add(_update);
    }

    private function _update(deltaTime:Float):Void
    {
        if(_enemySpawnCounter <= 0)
        {
            _spawnEnemy();
            _enemySpawnInterval--;
            if(_enemySpawnInterval < 15) _enemySpawnInterval = 15;

            _enemySpawnCounter = _enemySpawnInterval;
        }
        else
        {
            _enemySpawnCounter--;
        }
    }

    private function _spawnEnemy():Void
    {
        var e = new EnemyShip(_registry, _texture);
    }
}
