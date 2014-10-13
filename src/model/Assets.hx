package model;

/**
 * Model class used for handling assets
 * .
 * @author Marko Ristic
 */

import com.genome2d.textures.GTextureFontAtlas;
import msignal.Signal.Signal0;
import com.genome2d.textures.factories.GTextureAtlasFactory;
import com.genome2d.textures.GTextureAtlas;
import com.genome2d.assets.GAssetManager;

class Assets
{
    private var _assetManager:GAssetManager;

    public var atlas(default, null):GTextureAtlas;
    public var font(default, null):GTextureFontAtlas;

    public var assetsLoaded(default, null):Signal0 = new Signal0();

    public function new()
    {
        // add aseets to Genome2D asset manager
        _assetManager = new GAssetManager();
        _assetManager.addUrl("atlas_gfx", "assets/Atlas.png"); // add sprite atlas png to assets
        _assetManager.addUrl("atlas_xml", "assets/Atlas.xml"); // add sprite atlas xml to assets
        _assetManager.addUrl("font_gfx", "assets/font.png"); // add bitmap font atlas png to assets
        _assetManager.addUrl("font_xml", "assets/font.fnt"); // add bitmap font atlas xml to assets
        _assetManager.onAllLoaded.add(_assetsInitializedHandler); // wait until the assets are loaded
        _assetManager.load(); // Load assets
    }

    private function _assetsInitializedHandler():Void
    {
        // referencing the sprites from sprite atlas and font from this model class
        atlas = GTextureAtlasFactory.createFromAssets("atlas", cast _assetManager.getAssetById("atlas_gfx"), cast _assetManager.getAssetById("atlas_xml"));
        font = cast GTextureAtlasFactory.createFontFromAssets("font", cast _assetManager.getAssetById("font_gfx"), cast _assetManager.getAssetById("font_xml"));
        assetsLoaded.dispatch();
    }
}
