package states;

/**
 * Start screen state
 * .
 * @author Marko Ristic
 */

import model.AppModel;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import msignal.Signal.Signal1;
import com.genome2d.signals.GNodeMouseSignal;
import com.genome2d.node.GNode;
import model.ModelLocator;
import com.genome2d.textures.GTextureFontAtlas;
import model.Assets;
import com.genome2d.utils.GHAlignType;
import com.genome2d.utils.GVAlignType;
import com.genome2d.components.renderables.text.GTextureText;
import com.genome2d.node.GNode;

class StartState extends GNode
{
    private var _onPlay:Signal1<GNode>;
    private var _model:AppModel;

    public function new()
    {
        super('start_state');

        var assets = ModelLocator.instance().assets;
        _model = ModelLocator.instance().model;

        // Add Game title
        _model.createText(this, -50, -260, assets.font, "Genome2D \nSpace-Shooter Tutorial \nHAXE", _model.viewRect.width, 200, GVAlignType.MIDDLE, GHAlignType.CENTER, 0);

        // Add player ship graphic that will represent game start button
        var play:GSprite = cast GNodeFactory.createNodeWithComponent(GSprite);
        play.texture = assets.atlas.getSubTexture('PlayerSpaceship');
        play.node.transform.setPosition(0, 0); // Center the button
        play.node.mouseEnabled = true;
        play.node.onMouseClick.addOnce(_onPlayClick); // Listen for mouse click interaction
        addChild(play.node);
    }

    /**
     * On click change the screen state to Game Screen
     * @param e GNodeMouseSignal
     */

    private function _onPlayClick(e:GNodeMouseSignal):Void
    {
        _model.changeState(GameState);
    }
}
