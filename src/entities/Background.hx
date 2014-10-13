package entities;

/**
 * Background node
 * .
 * @author Marko Ristic
 */

import components.BackgroundMovement;
import model.ModelLocator;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import com.genome2d.node.GNode;

class Background extends GNode
{
    public var graphics1:GSprite;
    public var graphics2:GSprite;

    public function new()
    {
        super('background_stars');

        var assets = ModelLocator.instance().assets;
        var model = ModelLocator.instance().model;

        // Adding graphic from Sprite Atlas
        // Using two same graphic in order to fake endless scrolling
        graphics1 = cast GNodeFactory.createNodeWithComponent(GSprite, 'bg_graphics');
        graphics1.texture = assets.atlas.getSubTexture('Background');
        addChild(graphics1.node);

        graphics2 = cast GNodeFactory.createNodeWithComponent(GSprite, 'bg_graphics');
        graphics2.texture = assets.atlas.getSubTexture('Background');
        addChild(graphics2.node);

        graphics2.node.transform.y = -model.viewRect.height;

        // Add component for controling background movememnt
        addComponent(BackgroundMovement);
    }
}
