package model;

import com.genome2d.textures.GTextureFontAtlas;
import msignal.Signal.Signal0;
import com.genome2d.textures.factories.GTextureAtlasFactory;
import com.genome2d.textures.GTextureAtlas;
import com.genome2d.assets.GAssetManager;

class Assets
{
    private var _assetManager:GAssetManager;

    public var atlas:GTextureAtlas;
    public var font:GTextureFontAtlas;

    public var assetsLoaded(default, null):Signal0 = new Signal0();

    public function new()
    {
        _assetManager = new GAssetManager();
        _assetManager.addUrl("atlas_gfx", "assets/Atlas.png");
        _assetManager.addUrl("atlas_xml", "assets/Atlas.xml");
        _assetManager.addUrl("font_gfx", "assets/font.png");
        _assetManager.addUrl("font_xml", "assets/font.fnt");
        _assetManager.onAllLoaded.add(_assetsInitializedHandler);
        _assetManager.load();

        trace('load assets');
    }

    private function _assetsInitializedHandler():Void
    {
        trace('assets loaded');
        atlas = GTextureAtlasFactory.createFromAssets("atlas", cast _assetManager.getAssetById("atlas_gfx"), cast _assetManager.getAssetById("atlas_xml"));
        font = cast GTextureAtlasFactory.createFontFromAssets("font", cast _assetManager.getAssetById("font_gfx"), cast _assetManager.getAssetById("font_xml"));
        assetsLoaded.dispatch();
    }
}
