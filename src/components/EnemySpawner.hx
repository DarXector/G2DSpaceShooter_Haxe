package components;

/**
 * Component spwning enemy entities
 * .
 * @author Marko Ristic
 */

import com.genome2d.textures.GTexture;
import model.AppModel;
import model.ModelLocator;
import entities.EnemyShip;
import com.genome2d.components.GComponent;

class EnemySpawner extends GComponent
{
    private var _enemySpawnInterval:Int = 60;
    private var _enemySpawnCounter:Int;
    private var _model:AppModel;
    private var _texture:GTexture;

    public function new()
    {
        super();

        _model = ModelLocator.instance().model;
        _texture = ModelLocator.instance().assets.atlas.getSubTexture('EnemySpaceship');
    }

    override public function init():Void
    {
        _enemySpawnCounter = _enemySpawnInterval;
        node.core.onUpdate.add(_update);
    }


    /**
    * when the counter reaches 0 spawn enemy.
    * @param deltaTime elapsed from the last frame
    */
    private function _update(deltaTime:Float):Void
    {
        if(_enemySpawnCounter <= 0)
        {
            _spawnEnemy();
            _enemySpawnInterval--;
            if(_enemySpawnInterval < 15) _enemySpawnInterval = 15; // Spawn interval should not go under 15

            _enemySpawnCounter = _enemySpawnInterval;
        }
        else
        {
            _enemySpawnCounter--;
        }
    }

    /**
    * Instantiate enemy.
    */
    private function _spawnEnemy():Void
    {
        var e = new EnemyShip(_model, _texture); // Instantiate enemy
    }
}
