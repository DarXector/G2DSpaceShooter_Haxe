package states;

/**
 * Game screen state
 * .
 * @author Marko Ristic
 */

import components.EnemySpawner;
import model.ModelLocator;
import entities.Player;
import com.genome2d.node.GNode;

class GameState extends GNode
{
    private var _player:Player;

    public function new()
    {
        super('game_state');

        // Reference Game state inside app model
        ModelLocator.instance().model.gameState = this;

        // Instantiate Player Ship
        _player = new Player('player');
        addChild(_player);

        // Add Component that controls enemy instantiation
        this.addComponent(EnemySpawner);
    }
}
