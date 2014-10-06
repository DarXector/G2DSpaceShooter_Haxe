package model;
/**
 * ...
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

class Registry
{
    public var viewRect:GRectangle;
    public var root:GNode;
    public var gameState:GameState;
    public var playerBullets:Array<Bullet> = new Array<Bullet>();
    public var enemyBullets:Array<Bullet> = new Array<Bullet>();
    public var enemies:Array<EnemyShip> = new Array<EnemyShip>();
    public var player:Player;
    public var playerComponent:PlayerShipComponent;

    public var currentState(default, null):GNode;

	public function new() 
	{

	}

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
}