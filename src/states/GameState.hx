package states;
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

        var registry = ModelLocator.instance().registry;

        registry.gameState = this;


        _player = new Player('player');
        addChild(_player);

        this.addComponent(EnemySpawner);
    }
}
