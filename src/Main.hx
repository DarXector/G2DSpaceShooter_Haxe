/*
 * 	Genome2D - 2D GPU Framework
 * 	http://www.genome2d.com
 *
 *	Copyright 2011-2014 Peter Stefcek. All rights reserved.
 *
 *	License:: ./doc/LICENSE.md (https://github.com/pshtif/Genome2D/blob/master/LICENSE.md)
 */
package;

import states.StartState;
import com.genome2d.context.stats.GStats;
import entities.Background;
import states.GameState;
import com.genome2d.geom.GRectangle;
import model.ModelLocator;
import model.Assets;

#if stage3Donly
import flash.Vector;
#end

import com.genome2d.components.GCameraController;
import com.genome2d.node.factory.GNodeFactory;
import com.genome2d.node.GNode;
import com.genome2d.Genome2D;
import com.genome2d.context.GContextConfig;

class Main
{
    static public function main() {
        var inst = new Main();
    }

/**
        Genome2D singleton instance
     **/
    private var _genome:Genome2D;

    public function new() {
        _initGenome();
    }

/**
        Initialize Genome2D
     **/
    private function _initGenome():Void {
        var config = new GContextConfig(new GRectangle(0, 0, 480, 640));
        #if stage3Donly
        config.profile = Vector.ofArray(["baselineExtended", "baseline"]);
        #end

        _genome = Genome2D.getInstance();
        _genome.onInitialized.addOnce(_initialized);
        _genome.onFailed.addOnce(_failed);
        _genome.init(config);
    }

/**
        Genome2D initialized handler
     **/
    private function _initialized():Void
    {
        trace("G2D is initialized");

        ModelLocator.instance().model.viewRect = cast _genome.getContext().getStageViewRect();
        ModelLocator.instance().assets.assetsLoaded.addOnce(_assetReady);
    }

    private function _assetReady():Void
    {
        trace("Assets ready!");

        var container:GNode = GNodeFactory.createNode("container");
        ModelLocator.instance().model.root = container;

        #if flash
        #else
        container.transform.x = _genome.getContext().getStageViewRect().width / 2;
        container.transform.y = _genome.getContext().getStageViewRect().height / 2;
        #end

        var camera:GCameraController = cast container.addComponent(GCameraController);
        _genome.root.addChild(container);

        var bg:Background = new Background();
        container.addChild(bg);

        ModelLocator.instance().model.changeState(StartState);
    }

    private function _failed(fail:String):Void
    {
        trace("G2D failed");
    }
}
