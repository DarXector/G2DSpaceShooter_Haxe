package entities;

/**
 * Player Ship entity
 * .
 * @author Marko Ristic
 */

import components.Shoot;
import components.PlayerShipComponent;
import model.ModelLocator;
import model.Assets;
import com.genome2d.context.GBlendMode;
import com.genome2d.components.renderables.particles.GSimpleParticleSystem;
import com.genome2d.textures.GTexture;
import components.FollowMouseComponent;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.components.renderables.GSprite;
import com.genome2d.node.GNode;

class Player extends GNode
{
    public var graphics(default, null):GSprite;
    public var booster(default, null):GSimpleParticleSystem;

    public function new(id:String)
    {
        super(id);

        var assets = ModelLocator.instance().assets;

        // Create the particle emmiter taht will represent our engine exhaust
        booster = cast GNodeFactory.createNodeWithComponent(GSimpleParticleSystem, 'booster_emitter');
        booster.texture = assets.atlas.getSubTexture("Particle");
        booster.emit = true;
        booster.useWorldSpace = true;
        booster.blendMode = GBlendMode.ADD;

        booster.emission = 32;
        booster.energy = 0.3;
        booster.dispersionAngle = Math.PI / 2;
        booster.initialVelocity = 400;
        booster.initialVelocityVariance = 100;
        booster.initialScale = 0.9;
        booster.initialScaleVariance = 0.2;
        booster.endScale = 0.9;
        booster.endScaleVariance = 0.2;
        booster.initialAlpha = 1;
        booster.initialBlue = 2;
        booster.initialGreen = 1;
        booster.initialRed = 4;
        booster.endAlpha = 0;
        booster.endBlue = 1;
        booster.endGreen = 2;
        booster.endRed = 4;

        booster.node.transform.setPosition(0,30); // move it to back of the ship

        addChild(booster.node);

        // add player ship graphic
        graphics = cast GNodeFactory.createNodeWithComponent(GSprite, 'player_graphics');
        graphics.texture = assets.atlas.getSubTexture('PlayerSpaceship');
        addChild(graphics.node);

        this.addComponent(FollowMouseComponent); // Player ship should be able to follow the mouse
        this.addComponent(Shoot); // Should be able to shoot
        this.addComponent(PlayerShipComponent); // Adding component that controls interaxtion with other entities

        // Reference the player ship inside our app model
        ModelLocator.instance().model.setPlayer(this);
    }
}
