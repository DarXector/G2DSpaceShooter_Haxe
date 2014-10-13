package model;
/**
 * Model class used for handling data manipulation, object pools and some utilities
 * .
 * @author Marko Ristic
 */
import com.genome2d.textures.GTextureFontAtlas;
import com.genome2d.node.GNode;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.text.GTextureText;
import entities.Bullet;
import states.GameState;
import com.genome2d.geom.GRectangle;
import components.PlayerShipComponent;
import entities.Player;
import entities.EnemyShip;

class AppModel
{
    public var viewRect:GRectangle;
    public var root:GNode;
    public var gameState:GameState;

    // Object pools for bullets and entitites
    public var playerBullets(default, null):Array<Bullet>;
    public var enemyBullets(default, null):Array<Bullet>;
    public var enemies(default, null):Array<EnemyShip>;


    public var player(default, null):Player;
    public var playerComponent(default, null):PlayerShipComponent;
    public var currentState(default, null):GNode;

	public function new() 
	{
        playerBullets = new Array<Bullet>();
        enemyBullets = new Array<Bullet>();
        enemies = new Array<EnemyShip>();
	}

    /**
     * Utility method Text creation using Bitmap Fonts.
     * Taken from Genome2D examples and slightly edited
    */
    public function createText(parent:GNode, p_x:Float, p_y:Float, p_textureAtlasId:GTextureFontAtlas, p_text:String, w:Float, h:Float, p_vAlign:Int, p_hAlign:Int, p_tracking:Int = 0, p_lineSpace:Int = 0):GTextureText
    {
        var text:GTextureText = cast GNodeFactory.createNodeWithComponent(GTextureText);
        text.setTextureAtlas(p_textureAtlasId);
        text.autoSize = true;
        text.width = w;
        text.height = h;
        text.text = p_text;
        text.tracking = p_tracking;
        text.lineSpace = p_lineSpace;
        text.vAlign = p_vAlign;
        text.hAlign = p_hAlign;
        text.node.transform.setPosition(p_x, p_y);
        parent.addChild(text.node);

        return text;
    }

    /**
     * Change current screen state
     * @param stateClass Class of the next screen state (GNode)
    */

    public function changeState(stateClass:Class<GNode>):Void
    {
        if(currentState != null && currentState.parent != null && currentState.parent == root)
        {
            root.removeChild(currentState);
            currentState.dispose();
        }

        var state:GNode = Type.createInstance(stateClass,[]);
        root.addChild(state);
        currentState = state;
    }

    /**
     * Set player object. Used for referencing througth the code
     * @param _player Player instance
    */

    public function setPlayer(_player:Player):Void
    {
        player = _player;
        playerComponent = cast _player.getComponent(PlayerShipComponent);
    }

    /**
     * Place enemy instance inside enemies pool
     * @param enemy Enemy instance
    */

    public function addEnemy(enemy:EnemyShip):Void
    {
        gameState.addChild(enemy);
        enemies.push(enemy);
    }

    /**
     * Remove enemy instance from enemies pool
     * @param enemy Enemy instance
    */

    public function removeEnemy(enemy:EnemyShip):Void
    {
        gameState.removeChild(enemy);
        enemies.remove(enemy);
    }

    /**
     * Add bullet instance to bullets (Enemy or Player bullets) pool
     * @param bullet Bullet instance
    */

    public function addBullet(bullet:Bullet):Void
    {
        gameState.addChild(bullet);
        if(bullet.owner == BulletOwner.PLAYER)
        {
            playerBullets.push(bullet);
        } else if(bullet.owner == BulletOwner.ENEMY)
        {
            enemyBullets.push(bullet);
        }
    }

    /**
     * Remove bullet instance from bullets pool
     * @param bullet Bullet instance
    */

    public function removeBullet(bullet:Bullet):Void
    {
        gameState.removeChild(bullet);
        if(bullet.owner == BulletOwner.PLAYER)
        {
            playerBullets.remove(bullet);
        } else if(bullet.owner == BulletOwner.ENEMY)
        {
            enemyBullets.remove(bullet);
        }
    }
}