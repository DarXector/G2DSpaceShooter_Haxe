(function () { "use strict";
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	iterator: function() {
		return new _List.ListIterator(this.h);
	}
	,__class__: List
};
var _List = {};
_List.ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
$hxClasses["_List.ListIterator"] = _List.ListIterator;
_List.ListIterator.__name__ = ["_List","ListIterator"];
_List.ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _List.ListIterator
};
var Main = function() {
	this._initGenome();
};
$hxClasses["Main"] = Main;
Main.__name__ = ["Main"];
Main.main = function() {
	var inst = new Main();
};
Main.prototype = {
	_initGenome: function() {
		var config = new com.genome2d.context.GContextConfig(new com.genome2d.geom.GRectangle(0,0,480,640));
		this._genome = com.genome2d.Genome2D.getInstance();
		this._genome.g2d_onInitialized.addOnce($bind(this,this._initialized));
		this._genome.g2d_onFailed.addOnce($bind(this,this._failed));
		this._genome.init(config);
	}
	,_initialized: function() {
		console.log("G2D is initialized");
		model.ModelLocator.initialize().registry.viewRect = this._genome.g2d_context.g2d_stageViewRect;
		model.ModelLocator.initialize().assets.assetsLoaded.addOnce($bind(this,this._assetReady));
	}
	,_assetReady: function() {
		console.log("Assets ready!");
		var container = com.genome2d.node.factory.GNodeFactory.createNode("container");
		container.g2d_transform.set_x(this._genome.g2d_context.g2d_stageViewRect.width / 2);
		container.g2d_transform.set_y(this._genome.g2d_context.g2d_stageViewRect.height / 2);
		var camera = container.addComponent(com.genome2d.components.GCameraController);
		this._genome.g2d_root.addChild(container);
		var bg = new entities.Background();
		container.addChild(bg);
		var gameState = new states.GameState("game_state");
		container.addChild(gameState);
	}
	,_failed: function(fail) {
		console.log("G2D failed");
	}
	,__class__: Main
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return js.Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
$hxClasses["Xml"] = Xml;
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n1 = this.x[k1];
				k1++;
				if(n1.nodeType == Xml.Element && n1._nodeName == name) {
					this.cur = k1;
					return n1;
				}
			}
			return null;
		}};
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
	,__properties__: {set_nodeValue:"set_nodeValue",set_nodeName:"set_nodeName",get_nodeName:"get_nodeName"}
};
var com = {};
com.genome2d = {};
com.genome2d.Genome2D = function() {
	this.g2d_renderMatrixIndex = 0;
	this.g2d_runTime = 0;
	this.g2d_currentFrameId = 0;
	this.autoUpdateAndRender = true;
	if(!com.genome2d.Genome2D.g2d_instantiable) new com.genome2d.error.GError("Can't instantiate singleton directly");
	com.genome2d.Genome2D.g2d_instance = this;
	this.g2d_onInitialized = new msignal.Signal0();
	this.g2d_onFailed = new msignal.Signal1();
	this.g2d_onInvalidated = new msignal.Signal0();
	this.g2d_onUpdate = new msignal.Signal1();
	this.g2d_onPreRender = new msignal.Signal0();
	this.g2d_onPostRender = new msignal.Signal0();
	this.g2d_onKeySignal = new msignal.Signal1();
};
$hxClasses["com.genome2d.Genome2D"] = com.genome2d.Genome2D;
com.genome2d.Genome2D.__name__ = ["com","genome2d","Genome2D"];
com.genome2d.Genome2D.getInstance = function() {
	com.genome2d.Genome2D.g2d_instantiable = true;
	if(com.genome2d.Genome2D.g2d_instance == null) new com.genome2d.Genome2D();
	com.genome2d.Genome2D.g2d_instantiable = false;
	return com.genome2d.Genome2D.g2d_instance;
};
com.genome2d.Genome2D.prototype = {
	get_onInitialized: function() {
		return this.g2d_onInitialized;
	}
	,get_onFailed: function() {
		return this.g2d_onFailed;
	}
	,get_onInvalidated: function() {
		return this.g2d_onInvalidated;
	}
	,get_onUpdate: function() {
		return this.g2d_onUpdate;
	}
	,get_onPreRender: function() {
		return this.g2d_onPreRender;
	}
	,get_onPostRender: function() {
		return this.g2d_onPostRender;
	}
	,get_onKeySignal: function() {
		return this.g2d_onKeySignal;
	}
	,getCurrentFrameId: function() {
		return this.g2d_currentFrameId;
	}
	,getRunTime: function() {
		return this.g2d_runTime;
	}
	,getCurrentFrameDeltaTime: function() {
		return this.g2d_currentFrameDeltaTime;
	}
	,get_root: function() {
		return this.g2d_root;
	}
	,getContext: function() {
		return this.g2d_context;
	}
	,init: function(p_config) {
		if(this.g2d_root != null) this.g2d_root.dispose();
		this.g2d_root = new com.genome2d.node.GNode("root");
		this.g2d_cameras = new Array();
		this.g2d_renderMatrix = new com.genome2d.geom.GMatrix();
		this.g2d_renderMatrixIndex = 0;
		this.g2d_renderMatrixArray = new Array();
		if(this.g2d_context != null) this.g2d_context.dispose();
		this.g2d_contextConfig = p_config;
		this.g2d_context = Type.createInstance(p_config.contextClass,[this.g2d_contextConfig]);
		this.g2d_context.onInitialized.add($bind(this,this.g2d_contextInitializedHandler));
		this.g2d_context.onFailed.add($bind(this,this.g2d_contextFailedHandler));
		this.g2d_context.onInvalidated.add($bind(this,this.g2d_contextInvalidatedHandler));
		this.g2d_context.init();
	}
	,update: function(p_deltaTime) {
		this.g2d_currentFrameDeltaTime = p_deltaTime;
		this.g2d_onUpdate.dispatch(this.g2d_currentFrameDeltaTime);
	}
	,render: function(p_camera) {
		var cameraCount = this.g2d_cameras.length;
		this.g2d_context.begin();
		this.g2d_onPreRender.dispatch();
		if(this.g2d_root.g2d_transform.g2d_localUseMatrix > 0) {
			this.g2d_renderMatrix.identity();
			this.g2d_renderMatrixArray = [];
		}
		if(p_camera != null) p_camera.render(); else if(cameraCount == 0) this.g2d_root.render(false,false,this.g2d_context.getDefaultCamera(),false,false); else {
			var _g = 0;
			while(_g < cameraCount) {
				var i = _g++;
				this.g2d_cameras[i].render();
			}
		}
		if(this.g2d_onPostRender.get_numListeners() > 0) {
			this.g2d_context.setCamera(this.g2d_context.getDefaultCamera());
			this.g2d_context.setRenderTarget(null);
			this.g2d_onPostRender.dispatch();
		}
		this.g2d_context.end();
	}
	,dispose: function() {
		if(this.g2d_root != null) this.g2d_root.dispose();
		this.g2d_root = null;
		this.g2d_onInitialized.removeAll();
		this.g2d_onFailed.removeAll();
		this.g2d_onPostRender.removeAll();
		this.g2d_onPreRender.removeAll();
		this.g2d_onUpdate.removeAll();
		this.g2d_onInvalidated.removeAll();
		this.g2d_onKeySignal.removeAll();
		this.g2d_context.dispose();
		this.g2d_context = null;
	}
	,g2d_contextInitializedHandler: function() {
		com.genome2d.textures.factories.GTextureFactory.g2d_context = com.genome2d.textures.factories.GTextureAtlasFactory.g2d_context = this.g2d_context;
		this.g2d_context.onFrame.add($bind(this,this.g2d_frameHandler));
		this.g2d_context.onMouseSignal.add($bind(this,this.g2d_contextMouseSignalHandler));
		this.g2d_context.onKeyboardSignal.add($bind(this,this.g2d_contextKeySignalHandler));
		this.g2d_onInitialized.dispatch();
	}
	,g2d_contextFailedHandler: function(p_error) {
		if(this.g2d_contextConfig.fallbackContextClass != null) {
			this.g2d_context = Type.createInstance(this.g2d_contextConfig.fallbackContextClass,[this.g2d_contextConfig]);
			this.g2d_context.onInitialized.add($bind(this,this.g2d_contextInitializedHandler));
			this.g2d_context.onFailed.add($bind(this,this.g2d_contextFailedHandler));
			this.g2d_context.init();
		}
		this.g2d_onFailed.dispatch(p_error);
	}
	,g2d_contextInvalidatedHandler: function() {
		this.g2d_onInvalidated.dispatch();
	}
	,g2d_frameHandler: function(p_deltaTime) {
		if(this.autoUpdateAndRender) {
			this.g2d_currentFrameId++;
			this.g2d_runTime += p_deltaTime;
			this.update(p_deltaTime);
			this.render();
		}
	}
	,g2d_addCameraController: function(p_camera) {
		var _g1 = 0;
		var _g = this.g2d_cameras.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.g2d_cameras[i] == p_camera) return;
		}
		this.g2d_cameras.push(p_camera);
	}
	,g2d_removeCameraController: function(p_camera) {
		var _g1 = 0;
		var _g = this.g2d_cameras.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.g2d_cameras[i] == p_camera) this.g2d_cameras.splice(i,1);
		}
	}
	,g2d_contextMouseSignalHandler: function(p_signal) {
		if(this.g2d_cameras.length == 0) this.g2d_root.processContextMouseSignal(p_signal.nativeCaptured,p_signal.x,p_signal.y,p_signal,null); else {
			var _g1 = 0;
			var _g = this.g2d_cameras.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.g2d_cameras[i].g2d_capturedThisFrame = false;
			}
			var _g11 = 0;
			var _g2 = this.g2d_cameras.length;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.g2d_cameras[i1].captureMouseEvent(this.g2d_context,p_signal.nativeCaptured,p_signal);
			}
		}
	}
	,g2d_contextKeySignalHandler: function(p_signal) {
		this.g2d_onKeySignal.dispatch(p_signal);
	}
	,__class__: com.genome2d.Genome2D
	,__properties__: {get_root:"get_root",get_onKeySignal:"get_onKeySignal",get_onPostRender:"get_onPostRender",get_onPreRender:"get_onPreRender",get_onUpdate:"get_onUpdate",get_onInvalidated:"get_onInvalidated",get_onFailed:"get_onFailed",get_onInitialized:"get_onInitialized"}
};
com.genome2d.assets = {};
com.genome2d.assets.GAsset = function() {
	this.g2d_loaded = false;
	this.onLoaded = new msignal.Signal1(com.genome2d.assets.GAsset);
};
$hxClasses["com.genome2d.assets.GAsset"] = com.genome2d.assets.GAsset;
com.genome2d.assets.GAsset.__name__ = ["com","genome2d","assets","GAsset"];
com.genome2d.assets.GAsset.prototype = {
	isLoaded: function() {
		return this.g2d_loaded;
	}
	,initUrl: function(p_id,p_url) {
		this.id = p_id;
		this.g2d_url = p_url;
	}
	,load: function() {
	}
	,__class__: com.genome2d.assets.GAsset
};
com.genome2d.assets.GAssetManager = function() {
	this.g2d_assetsQueue = new Array();
	this.g2d_assets = new Array();
	this.g2d_onAllLoaded = new msignal.Signal0();
};
$hxClasses["com.genome2d.assets.GAssetManager"] = com.genome2d.assets.GAssetManager;
com.genome2d.assets.GAssetManager.__name__ = ["com","genome2d","assets","GAssetManager"];
com.genome2d.assets.GAssetManager.prototype = {
	get_onAllLoaded: function() {
		return this.g2d_onAllLoaded;
	}
	,getAssetById: function(p_id) {
		var _g1 = 0;
		var _g = this.g2d_assets.length;
		while(_g1 < _g) {
			var i = _g1++;
			var asset = this.g2d_assets[i];
			if(asset.id == p_id) return asset;
		}
		return null;
	}
	,getXmlAssetById: function(p_id) {
		var asset = this.getAssetById(p_id);
		if(js.Boot.__instanceof(asset,com.genome2d.assets.GXmlAsset)) return asset;
		return null;
	}
	,getImageAssetById: function(p_id) {
		var asset = this.getAssetById(p_id);
		if(js.Boot.__instanceof(asset,com.genome2d.assets.GImageAsset)) return asset;
		return null;
	}
	,add: function(p_asset) {
		if(p_asset.isLoaded()) this.g2d_assets.push(p_asset); else this.g2d_assetsQueue.push(p_asset);
	}
	,addUrl: function(p_id,p_url) {
		var asset = null;
		var _g;
		com.genome2d.assets.GAssetManager.PATH_REGEX.match(p_url);
		_g = com.genome2d.assets.GAssetManager.PATH_REGEX.matched(2);
		switch(_g) {
		case "jpg":case "jpeg":case "png":
			asset = new com.genome2d.assets.GImageAsset();
			break;
		case "atf":
			asset = new com.genome2d.assets.GImageAsset();
			break;
		case "xml":case "fnt":
			asset = new com.genome2d.assets.GXmlAsset();
			break;
		}
		if(asset != null) asset.initUrl(p_id,p_url);
		this.add(asset);
	}
	,load: function() {
		if(this.g2d_loading) return;
		this.g2d_loadNext();
	}
	,g2d_loadNext: function() {
		if(this.g2d_assetsQueue.length == 0) {
			this.g2d_loading = false;
			this.g2d_onAllLoaded.dispatch();
		} else {
			this.g2d_loading = true;
			var asset = this.g2d_assetsQueue.shift();
			asset.onLoaded.addOnce($bind(this,this.g2d_hasAssetLoaded));
			asset.load();
		}
	}
	,getName: function(p_path) {
		com.genome2d.assets.GAssetManager.PATH_REGEX.match(p_path);
		return com.genome2d.assets.GAssetManager.PATH_REGEX.matched(1);
	}
	,getExtension: function(p_path) {
		com.genome2d.assets.GAssetManager.PATH_REGEX.match(p_path);
		return com.genome2d.assets.GAssetManager.PATH_REGEX.matched(2);
	}
	,g2d_hasAssetLoaded: function(p_asset) {
		this.g2d_assets.push(p_asset);
		this.g2d_loadNext();
	}
	,__class__: com.genome2d.assets.GAssetManager
	,__properties__: {get_onAllLoaded:"get_onAllLoaded"}
};
com.genome2d.assets.GImageAsset = function() {
	com.genome2d.assets.GAsset.call(this);
};
$hxClasses["com.genome2d.assets.GImageAsset"] = com.genome2d.assets.GImageAsset;
com.genome2d.assets.GImageAsset.__name__ = ["com","genome2d","assets","GImageAsset"];
com.genome2d.assets.GImageAsset.__super__ = com.genome2d.assets.GAsset;
com.genome2d.assets.GImageAsset.prototype = $extend(com.genome2d.assets.GAsset.prototype,{
	load: function() {
		var _this = window.document;
		this.g2d_nativeImage = _this.createElement("img");
		this.g2d_nativeImage.onload = $bind(this,this.loadedHandler);
		this.g2d_nativeImage.src = this.g2d_url;
	}
	,loadedHandler: function(event) {
		this.g2d_loaded = true;
		this.onLoaded.dispatch(this);
	}
	,__class__: com.genome2d.assets.GImageAsset
});
com.genome2d.assets.GXmlAsset = function() {
	com.genome2d.assets.GAsset.call(this);
};
$hxClasses["com.genome2d.assets.GXmlAsset"] = com.genome2d.assets.GXmlAsset;
com.genome2d.assets.GXmlAsset.__name__ = ["com","genome2d","assets","GXmlAsset"];
com.genome2d.assets.GXmlAsset.__super__ = com.genome2d.assets.GAsset;
com.genome2d.assets.GXmlAsset.prototype = $extend(com.genome2d.assets.GAsset.prototype,{
	load: function() {
		var http = new haxe.Http(this.g2d_url);
		http.onData = $bind(this,this.loadedHandler);
		http.onError = $bind(this,this.errorHandler);
		http.request();
	}
	,loadedHandler: function(p_data) {
		this.g2d_loaded = true;
		this.xml = Xml.parse(p_data);
		this.onLoaded.dispatch(this);
	}
	,errorHandler: function(p_error) {
		new com.genome2d.error.GError(p_error);
	}
	,__class__: com.genome2d.assets.GXmlAsset
});
com.genome2d.components = {};
com.genome2d.components.IGPrototypable = function() { };
$hxClasses["com.genome2d.components.IGPrototypable"] = com.genome2d.components.IGPrototypable;
com.genome2d.components.IGPrototypable.__name__ = ["com","genome2d","components","IGPrototypable"];
com.genome2d.components.IGPrototypable.prototype = {
	__class__: com.genome2d.components.IGPrototypable
};
com.genome2d.components.GComponent = function() {
	this.id = "";
	this.g2d_active = true;
};
$hxClasses["com.genome2d.components.GComponent"] = com.genome2d.components.GComponent;
com.genome2d.components.GComponent.__name__ = ["com","genome2d","components","GComponent"];
com.genome2d.components.GComponent.__interfaces__ = [com.genome2d.components.IGPrototypable];
com.genome2d.components.GComponent.prototype = {
	isActive: function() {
		return this.g2d_active;
	}
	,setActive: function(p_value) {
		this.g2d_active = p_value;
	}
	,get_node: function() {
		return this.g2d_node;
	}
	,getPrototype: function() {
		var prototypeXml = Xml.parse("<component/>").firstElement();
		prototypeXml.set("id",this.id);
		prototypeXml.set("componentClass",Type.getClassName(Type.getClass(this)));
		prototypeXml.set("componentLookupClass",Type.getClassName(this.g2d_lookupClass));
		var propertiesXml = Xml.parse("<properties/>").firstElement();
		var properties = Reflect.field(Type.getClass(this),"PROTOTYPE_PROPERTIES");
		if(properties != null) {
			var _g1 = 0;
			var _g = properties.length;
			while(_g1 < _g) {
				var i = _g1++;
				var property = properties[i].split("|");
				this.g2d_addPrototypeProperty(property[0],property.length > 1?property[1]:"",propertiesXml);
			}
		}
		prototypeXml.addChild(propertiesXml);
		return prototypeXml;
	}
	,g2d_addPrototypeProperty: function(p_name,p_type,p_propertiesXml) {
		var propertyXml = Xml.parse("<property/>").firstElement();
		propertyXml.set("name",p_name);
		propertyXml.set("type",p_type);
		if(p_type != "Int" && p_type != "Bool" && p_type != "Float" && p_type != "String") {
			propertyXml.set("value","xml");
			propertyXml.addChild((js.Boot.__cast(Reflect.getProperty(this,p_name) , com.genome2d.components.IGPrototypable)).getPrototype());
		} else propertyXml.set("value",Std.string(Reflect.getProperty(this,p_name)));
		p_propertiesXml.addChild(propertyXml);
	}
	,init: function() {
	}
	,processContextMouseSignal: function(p_captured,p_cameraX,p_cameraY,p_contextSignal) {
		return false;
	}
	,dispose: function() {
	}
	,initPrototype: function(p_prototypeXml) {
		this.id = p_prototypeXml.get("id");
		var propertiesXml = p_prototypeXml.firstElement();
		var it = propertiesXml.elements();
		while(it.hasNext()) this.g2d_initPrototypeProperty(it.next());
	}
	,g2d_initPrototypeProperty: function(p_propertyXml) {
		var value = null;
		var type = p_propertyXml.get("type").split(":");
		var _g = type[0];
		switch(_g) {
		case "Bool":
			if(p_propertyXml.get("value") == "false") value = false; else value = true;
			break;
		case "Int":
			value = Std.parseInt(p_propertyXml.get("value"));
			break;
		case "Float":
			value = Std.parseFloat(p_propertyXml.get("value"));
			break;
		case "String":
			value = p_propertyXml.get("value");
			break;
		default:
			var property = p_propertyXml.get("value");
			if(value != "null") {
				var c = Type.resolveClass(type[0]);
				value = Type.createInstance(c,[]);
				value.initPrototype(Xml.parse(property));
			}
		}
		try {
			Reflect.setProperty(this,p_propertyXml.get("name"),value);
		} catch( e ) {
		}
	}
	,g2d_dispose: function() {
		this.dispose();
		this.g2d_active = false;
		this.g2d_node = null;
		this.g2d_next = null;
		this.g2d_previous = null;
	}
	,__class__: com.genome2d.components.GComponent
	,__properties__: {get_node:"get_node"}
};
com.genome2d.components.GCameraController = function() {
	this.renderTarget = null;
	this.backgroundAlpha = 0;
	this.backgroundBlue = 0;
	this.backgroundGreen = 0;
	this.backgroundRed = 0;
	this.g2d_capturedThisFrame = false;
	com.genome2d.components.GComponent.call(this);
};
$hxClasses["com.genome2d.components.GCameraController"] = com.genome2d.components.GCameraController;
com.genome2d.components.GCameraController.__name__ = ["com","genome2d","components","GCameraController"];
com.genome2d.components.GCameraController.__super__ = com.genome2d.components.GComponent;
com.genome2d.components.GCameraController.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	getBackgroundColor: function() {
		var alpha = (this.backgroundAlpha * 255 | 0) << 24;
		var red = (this.backgroundRed * 255 | 0) << 16;
		var green = (this.backgroundGreen * 255 | 0) << 8;
		var blue = this.backgroundBlue * 255 | 0;
		return alpha + red + green + blue;
	}
	,get_contextCamera: function() {
		return this.g2d_contextCamera;
	}
	,setView: function(p_normalizedX,p_normalizedY,p_normalizedWidth,p_normalizedHeight) {
		this.g2d_contextCamera.normalizedViewX = p_normalizedX;
		this.g2d_contextCamera.normalizedViewY = p_normalizedY;
		this.g2d_contextCamera.normalizedViewWidth = p_normalizedWidth;
		this.g2d_contextCamera.normalizedViewHeight = p_normalizedHeight;
	}
	,get_zoom: function() {
		return this.g2d_contextCamera.scaleX;
	}
	,set_zoom: function(p_value) {
		return this.g2d_contextCamera.scaleX = this.g2d_contextCamera.scaleY = p_value;
	}
	,init: function() {
		this.g2d_contextCamera = new com.genome2d.context.GContextCamera();
		this.g2d_viewRectangle = new com.genome2d.geom.GRectangle();
		if(this.g2d_node != ((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root() && this.g2d_node.isOnStage()) ((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).g2d_addCameraController(this);
		this.g2d_node.get_onAddedToStage().add($bind(this,this.g2d_onAddedToStage));
		this.g2d_node.get_onRemovedFromStage().add($bind(this,this.g2d_onRemovedFromStage));
	}
	,render: function() {
		if(!this.g2d_node.g2d_active) return;
		this.g2d_renderedNodesCount = 0;
		this.g2d_contextCamera.x = this.g2d_node.g2d_transform.g2d_worldX;
		this.g2d_contextCamera.y = this.g2d_node.g2d_transform.g2d_worldY;
		this.g2d_contextCamera.rotation = this.g2d_node.g2d_transform.g2d_worldRotation;
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).getContext().setCamera(this.g2d_contextCamera);
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).getContext().setRenderTarget(this.renderTarget);
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root().render(false,false,this.g2d_contextCamera,false,false);
	}
	,captureMouseEvent: function(p_context,p_captured,p_signal) {
		if(this.g2d_capturedThisFrame || !this.g2d_node.g2d_active) return false;
		this.g2d_capturedThisFrame = true;
		var stageRect = p_context.g2d_stageViewRect;
		this.g2d_viewRectangle.setTo(stageRect.width * this.g2d_contextCamera.normalizedViewX,stageRect.height * this.g2d_contextCamera.normalizedViewY,stageRect.width * this.g2d_contextCamera.normalizedViewWidth,stageRect.height * this.g2d_contextCamera.normalizedViewHeight);
		if(!this.g2d_viewRectangle.contains(p_signal.x,p_signal.y)) return false;
		var tx = p_signal.x - this.g2d_viewRectangle.x - this.g2d_viewRectangle.width / 2;
		var ty = p_signal.y - this.g2d_viewRectangle.y - this.g2d_viewRectangle.height / 2;
		var cos = Math.cos(-this.g2d_node.g2d_transform.g2d_worldRotation);
		var sin = Math.sin(-this.g2d_node.g2d_transform.g2d_worldRotation);
		var rx = tx * cos - ty * sin;
		var ry = ty * cos + tx * sin;
		rx /= this.g2d_contextCamera.scaleX;
		ry /= this.g2d_contextCamera.scaleX;
		return ((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root().processContextMouseSignal(p_captured,rx + this.g2d_node.g2d_transform.g2d_worldX,ry + this.g2d_node.g2d_transform.g2d_worldY,p_signal,this.g2d_contextCamera);
	}
	,dispose: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).g2d_removeCameraController(this);
		this.g2d_node.get_onAddedToStage().remove($bind(this,this.g2d_onAddedToStage));
		this.g2d_node.get_onRemovedFromStage().remove($bind(this,this.g2d_onRemovedFromStage));
		com.genome2d.components.GComponent.prototype.dispose.call(this);
	}
	,g2d_onAddedToStage: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).g2d_addCameraController(this);
	}
	,g2d_onRemovedFromStage: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).g2d_removeCameraController(this);
	}
	,__class__: com.genome2d.components.GCameraController
	,__properties__: $extend(com.genome2d.components.GComponent.prototype.__properties__,{set_zoom:"set_zoom",get_zoom:"get_zoom",get_contextCamera:"get_contextCamera"})
});
com.genome2d.components.GTransform = function() {
	this.g2d_localAlpha = 1;
	this.g2d_worldAlpha = 1;
	this.g2d_localBlue = 1;
	this.g2d_worldBlue = 1;
	this.g2d_localGreen = 1;
	this.g2d_worldGreen = 1;
	this.g2d_localRed = 1;
	this.g2d_worldRed = 1;
	this.g2d_localRotation = 0;
	this.g2d_worldRotation = 0;
	this.g2d_localScaleY = 1;
	this.g2d_worldScaleY = 1;
	this.g2d_localScaleX = 1;
	this.g2d_worldScaleX = 1;
	this.g2d_localUseMatrix = 0;
	this.g2d_localY = 0;
	this.g2d_worldY = 0;
	this.g2d_localX = 0;
	this.g2d_worldX = 0;
	this.visible = true;
	this.useWorldColor = false;
	this.useWorldSpace = false;
	this.g2d_colorDirty = false;
	this.g2d_transformDirty = false;
	this.g2d_matrixDirty = true;
	com.genome2d.components.GComponent.call(this);
};
$hxClasses["com.genome2d.components.GTransform"] = com.genome2d.components.GTransform;
com.genome2d.components.GTransform.__name__ = ["com","genome2d","components","GTransform"];
com.genome2d.components.GTransform.__super__ = com.genome2d.components.GComponent;
com.genome2d.components.GTransform.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	get_x: function() {
		return this.g2d_localX;
	}
	,set_x: function(p_value) {
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		return this.g2d_localX = this.g2d_worldX = p_value;
	}
	,get_y: function() {
		return this.g2d_localY;
	}
	,set_y: function(p_value) {
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		return this.g2d_localY = this.g2d_worldY = p_value;
	}
	,hasUniformRotation: function() {
		return this.g2d_localScaleX != this.g2d_localScaleY && this.g2d_localRotation != 0;
	}
	,get_g2d_useMatrix: function() {
		return this.g2d_localUseMatrix;
	}
	,set_g2d_useMatrix: function(p_value) {
		if(this.g2d_node.g2d_parent != null) {
			var _g = this.g2d_node.g2d_parent.g2d_transform;
			_g.set_g2d_useMatrix(_g.g2d_localUseMatrix + (p_value - this.g2d_localUseMatrix));
		}
		this.g2d_localUseMatrix = p_value;
		return this.g2d_localUseMatrix;
	}
	,get_scaleX: function() {
		return this.g2d_localScaleX;
	}
	,set_scaleX: function(p_value) {
		if(this.g2d_localScaleX == this.g2d_localScaleY && p_value != this.g2d_localScaleY && this.g2d_localRotation != 0 && this.g2d_node.g2d_numChildren > 0) {
			var _g = this;
			var _g1 = _g.g2d_localUseMatrix;
			_g.set_g2d_useMatrix(_g1 + 1);
			_g1;
		}
		if(this.g2d_localScaleX == this.g2d_localScaleY && p_value == this.g2d_localScaleY && this.g2d_localRotation != 0 && this.g2d_node.g2d_numChildren > 0) {
			var _g2 = this;
			var _g11 = _g2.g2d_localUseMatrix;
			_g2.set_g2d_useMatrix(_g11 - 1);
			_g11;
		}
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		return this.g2d_localScaleX = this.g2d_worldScaleX = p_value;
	}
	,get_scaleY: function() {
		return this.g2d_localScaleY;
	}
	,set_scaleY: function(p_value) {
		if(this.g2d_localScaleX == this.g2d_localScaleY && p_value != this.g2d_localScaleX && this.g2d_localRotation != 0 && this.g2d_node.g2d_numChildren > 0) {
			var _g = this;
			var _g1 = _g.g2d_localUseMatrix;
			_g.set_g2d_useMatrix(_g1 + 1);
			_g1;
		}
		if(this.g2d_localScaleX == this.g2d_localScaleY && p_value == this.g2d_localScaleX && this.g2d_localRotation != 0 && this.g2d_node.g2d_numChildren > 0) {
			var _g2 = this;
			var _g11 = _g2.g2d_localUseMatrix;
			_g2.set_g2d_useMatrix(_g11 - 1);
			_g11;
		}
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		return this.g2d_localScaleY = this.g2d_worldScaleY = p_value;
	}
	,get_rotation: function() {
		return this.g2d_localRotation;
	}
	,set_rotation: function(p_value) {
		if(this.g2d_localRotation == 0 && p_value != 0 && this.g2d_localScaleX != this.g2d_localScaleY && this.g2d_node.g2d_numChildren > 0) {
			var _g = this;
			var _g1 = _g.g2d_localUseMatrix;
			_g.set_g2d_useMatrix(_g1 + 1);
			_g1;
		}
		if(this.g2d_localRotation != 0 && p_value == 0 && this.g2d_localScaleX != this.g2d_localScaleY && this.g2d_node.g2d_numChildren > 0) {
			var _g2 = this;
			var _g11 = _g2.g2d_localUseMatrix;
			_g2.set_g2d_useMatrix(_g11 - 1);
			_g11;
		}
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		return this.g2d_localRotation = this.g2d_worldRotation = p_value;
	}
	,get_red: function() {
		return this.g2d_localRed;
	}
	,set_red: function(p_value) {
		this.g2d_colorDirty = true;
		return this.g2d_localRed = this.g2d_worldRed = p_value;
	}
	,get_green: function() {
		return this.g2d_localGreen;
	}
	,set_green: function(p_value) {
		this.g2d_colorDirty = true;
		return this.g2d_localGreen = this.g2d_worldGreen = p_value;
	}
	,get_blue: function() {
		return this.g2d_localBlue;
	}
	,set_blue: function(p_value) {
		this.g2d_colorDirty = true;
		return this.g2d_localBlue = this.g2d_worldBlue = p_value;
	}
	,get_alpha: function() {
		return this.g2d_localAlpha;
	}
	,set_alpha: function(p_value) {
		this.g2d_colorDirty = true;
		return this.g2d_localAlpha = this.g2d_worldAlpha = p_value;
	}
	,set_color: function(p_value) {
		this.g2d_colorDirty = true;
		this.g2d_localRed = this.g2d_worldRed = (p_value >> 16 & 255) / 255;
		this.g2d_colorDirty = true;
		this.g2d_localGreen = this.g2d_worldGreen = (p_value >> 8 & 255) / 255;
		this.g2d_colorDirty = true;
		this.g2d_localBlue = this.g2d_worldBlue = (p_value & 255) / 255;
		return p_value;
	}
	,get_matrix: function() {
		if(this.g2d_matrixDirty) {
			if(this.g2d_matrix == null) this.g2d_matrix = new com.genome2d.geom.GMatrix();
			if(this.g2d_localRotation == 0.0) this.g2d_matrix.setTo(this.g2d_localScaleX,0.0,0.0,this.g2d_localScaleY,this.g2d_localX,this.g2d_localY); else {
				var cos = Math.cos(this.g2d_localRotation);
				var sin = Math.sin(this.g2d_localRotation);
				var a = this.g2d_localScaleX * cos;
				var b = this.g2d_localScaleX * sin;
				var c = this.g2d_localScaleY * -sin;
				var d = this.g2d_localScaleY * cos;
				var tx = this.g2d_localX;
				var ty = this.g2d_localY;
				this.g2d_matrix.setTo(a,b,c,d,tx,ty);
			}
			this.g2d_matrixDirty = false;
		}
		return this.g2d_matrix;
	}
	,getTransformationMatrix: function(p_targetSpace,p_resultMatrix) {
		if(p_resultMatrix == null) p_resultMatrix = new com.genome2d.geom.GMatrix(); else p_resultMatrix.identity();
		if(p_targetSpace == this.g2d_node.g2d_parent) p_resultMatrix.copyFrom(this.get_matrix()); else if(p_targetSpace != this.g2d_node) {
			var common = this.g2d_node.getCommonParent(p_targetSpace);
			if(common != null) {
				var current = this.g2d_node;
				while(common != current) {
					p_resultMatrix.concat(current.g2d_transform.get_matrix());
					current = current.g2d_parent;
				}
				if(common != p_targetSpace) {
					com.genome2d.components.GTransform.g2d_cachedMatrix.identity();
					while(p_targetSpace != common) {
						com.genome2d.components.GTransform.g2d_cachedMatrix.concat(p_targetSpace.g2d_transform.get_matrix());
						p_targetSpace = p_targetSpace.g2d_parent;
					}
					com.genome2d.components.GTransform.g2d_cachedMatrix.invert();
					p_resultMatrix.concat(com.genome2d.components.GTransform.g2d_cachedMatrix);
				}
			}
		}
		return p_resultMatrix;
	}
	,localToGlobal: function(p_local,p_result) {
		this.getTransformationMatrix(((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root(),com.genome2d.components.GTransform.g2d_cachedMatrix);
		if(p_result == null) p_result = new com.genome2d.geom.GPoint();
		p_result.x = com.genome2d.components.GTransform.g2d_cachedMatrix.a * p_local.x + com.genome2d.components.GTransform.g2d_cachedMatrix.c * p_local.y + com.genome2d.components.GTransform.g2d_cachedMatrix.tx;
		p_result.y = com.genome2d.components.GTransform.g2d_cachedMatrix.d * p_local.y + com.genome2d.components.GTransform.g2d_cachedMatrix.b * p_local.x + com.genome2d.components.GTransform.g2d_cachedMatrix.ty;
		return p_result;
	}
	,globalToLocal: function(p_global,p_result) {
		this.getTransformationMatrix(((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root(),com.genome2d.components.GTransform.g2d_cachedMatrix);
		com.genome2d.components.GTransform.g2d_cachedMatrix.invert();
		if(p_result == null) p_result = new com.genome2d.geom.GPoint();
		p_result.x = com.genome2d.components.GTransform.g2d_cachedMatrix.a * p_global.x + com.genome2d.components.GTransform.g2d_cachedMatrix.c * p_global.y + com.genome2d.components.GTransform.g2d_cachedMatrix.tx;
		p_result.y = com.genome2d.components.GTransform.g2d_cachedMatrix.d * p_global.y + com.genome2d.components.GTransform.g2d_cachedMatrix.b * p_global.x + com.genome2d.components.GTransform.g2d_cachedMatrix.ty;
		return p_result;
	}
	,init: function() {
		if(com.genome2d.components.GTransform.g2d_cachedMatrix == null) com.genome2d.components.GTransform.g2d_cachedMatrix = new com.genome2d.geom.GMatrix();
	}
	,setPosition: function(p_x,p_y) {
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		this.g2d_localX = this.g2d_worldX = p_x;
		this.g2d_localY = this.g2d_worldY = p_y;
	}
	,setScale: function(p_scaleX,p_scaleY) {
		this.g2d_transformDirty = this.g2d_matrixDirty = true;
		this.g2d_localScaleX = this.g2d_worldScaleX = p_scaleX;
		this.g2d_localScaleY = this.g2d_worldScaleY = p_scaleY;
	}
	,invalidate: function(p_invalidateParentTransform,p_invalidateParentColor) {
		var parentTransform = this.g2d_node.g2d_parent.g2d_transform;
		if(p_invalidateParentTransform && !this.useWorldSpace) {
			if(parentTransform.g2d_worldRotation != 0) {
				var cos = Math.cos(parentTransform.g2d_worldRotation);
				var sin = Math.sin(parentTransform.g2d_worldRotation);
				this.g2d_worldX = (this.g2d_localX * cos - this.g2d_localY * sin) * parentTransform.g2d_worldScaleX + parentTransform.g2d_worldX;
				this.g2d_worldY = (this.g2d_localY * cos + this.g2d_localX * sin) * parentTransform.g2d_worldScaleY + parentTransform.g2d_worldY;
			} else {
				this.g2d_worldX = this.g2d_localX * parentTransform.g2d_worldScaleX + parentTransform.g2d_worldX;
				this.g2d_worldY = this.g2d_localY * parentTransform.g2d_worldScaleY + parentTransform.g2d_worldY;
			}
			this.g2d_worldScaleX = this.g2d_localScaleX * parentTransform.g2d_worldScaleX;
			this.g2d_worldScaleY = this.g2d_localScaleY * parentTransform.g2d_worldScaleY;
			this.g2d_worldRotation = this.g2d_localRotation + parentTransform.g2d_worldRotation;
			this.g2d_transformDirty = false;
		}
		if(p_invalidateParentColor && !this.useWorldColor) {
			this.g2d_worldRed = this.g2d_localRed * parentTransform.g2d_worldRed;
			this.g2d_worldGreen = this.g2d_localGreen * parentTransform.g2d_worldGreen;
			this.g2d_worldBlue = this.g2d_localBlue * parentTransform.g2d_worldBlue;
			this.g2d_worldAlpha = this.g2d_localAlpha * parentTransform.g2d_worldAlpha;
			this.g2d_colorDirty = false;
		}
	}
	,__class__: com.genome2d.components.GTransform
	,__properties__: $extend(com.genome2d.components.GComponent.prototype.__properties__,{get_matrix:"get_matrix",set_color:"set_color",set_alpha:"set_alpha",get_alpha:"get_alpha",set_blue:"set_blue",get_blue:"get_blue",set_green:"set_green",get_green:"get_green",set_red:"set_red",get_red:"get_red",set_rotation:"set_rotation",get_rotation:"get_rotation",set_scaleY:"set_scaleY",get_scaleY:"get_scaleY",set_scaleX:"set_scaleX",get_scaleX:"get_scaleX",set_g2d_useMatrix:"set_g2d_useMatrix",get_g2d_useMatrix:"get_g2d_useMatrix",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x"})
});
com.genome2d.components.renderables = {};
com.genome2d.components.renderables.IRenderable = function() { };
$hxClasses["com.genome2d.components.renderables.IRenderable"] = com.genome2d.components.renderables.IRenderable;
com.genome2d.components.renderables.IRenderable.__name__ = ["com","genome2d","components","renderables","IRenderable"];
com.genome2d.components.renderables.IRenderable.prototype = {
	__class__: com.genome2d.components.renderables.IRenderable
};
com.genome2d.components.renderables.GTexturedQuad = function() {
	this.ignoreMatrix = true;
	this.mousePixelTreshold = 0;
	this.mousePixelEnabled = false;
	this.blendMode = 1;
	com.genome2d.components.GComponent.call(this);
};
$hxClasses["com.genome2d.components.renderables.GTexturedQuad"] = com.genome2d.components.renderables.GTexturedQuad;
com.genome2d.components.renderables.GTexturedQuad.__name__ = ["com","genome2d","components","renderables","GTexturedQuad"];
com.genome2d.components.renderables.GTexturedQuad.__interfaces__ = [com.genome2d.components.renderables.IRenderable];
com.genome2d.components.renderables.GTexturedQuad.__super__ = com.genome2d.components.GComponent;
com.genome2d.components.renderables.GTexturedQuad.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	render: function(p_camera,p_useMatrix) {
		if(this.texture != null) {
			if(p_useMatrix && !this.ignoreMatrix) {
				var matrix = ((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrix;
				((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).getContext().drawMatrix(this.texture,matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty,this.g2d_node.g2d_transform.g2d_worldRed,this.g2d_node.g2d_transform.g2d_worldGreen,this.g2d_node.g2d_transform.g2d_worldBlue,this.g2d_node.g2d_transform.g2d_worldAlpha,this.blendMode,this.filter);
			} else ((function($this) {
				var $r;
				if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
				$r = com.genome2d.node.GNode.g2d_core;
				return $r;
			}(this))).getContext().draw(this.texture,this.g2d_node.g2d_transform.g2d_worldX,this.g2d_node.g2d_transform.g2d_worldY,this.g2d_node.g2d_transform.g2d_worldScaleX,this.g2d_node.g2d_transform.g2d_worldScaleY,this.g2d_node.g2d_transform.g2d_worldRotation,this.g2d_node.g2d_transform.g2d_worldRed,this.g2d_node.g2d_transform.g2d_worldGreen,this.g2d_node.g2d_transform.g2d_worldBlue,this.g2d_node.g2d_transform.g2d_worldAlpha,this.blendMode,this.filter);
		}
	}
	,hitTestPoint: function(p_x,p_y,p_pixelEnabled,p_w,p_h) {
		if(p_h == null) p_h = 0;
		if(p_w == null) p_w = 0;
		if(p_pixelEnabled == null) p_pixelEnabled = false;
		var tx = p_x - this.g2d_node.g2d_transform.g2d_worldX;
		var ty = p_y - this.g2d_node.g2d_transform.g2d_worldY;
		if(this.g2d_node.g2d_transform.g2d_worldRotation != 0) {
			var cos = Math.cos(-this.g2d_node.g2d_transform.g2d_worldRotation);
			var sin = Math.sin(-this.g2d_node.g2d_transform.g2d_worldRotation);
			var ox = tx;
			tx = tx * cos - ty * sin;
			ty = ty * cos + ox * sin;
		}
		tx /= this.g2d_node.g2d_transform.g2d_worldScaleX * (this.texture.g2d_region.width | 0);
		ty /= this.g2d_node.g2d_transform.g2d_worldScaleY * (this.texture.g2d_region.height | 0);
		if(p_w != 0) p_w /= this.g2d_node.g2d_transform.g2d_worldScaleX * (this.texture.g2d_region.width | 0);
		if(p_h != 0) p_h /= this.g2d_node.g2d_transform.g2d_worldScaleY * (this.texture.g2d_region.height | 0);
		tx += .5;
		ty += .5;
		if(tx + p_w >= -this.texture.pivotX / (this.texture.g2d_region.width | 0) && tx - p_w <= 1 - this.texture.pivotX / (this.texture.g2d_region.width | 0) && ty + p_h >= -this.texture.pivotY / (this.texture.g2d_region.height | 0) && ty - p_h <= 1 - this.texture.pivotY / (this.texture.g2d_region.height | 0)) {
			if(p_pixelEnabled && this.texture.getAlphaAtUV(tx + this.texture.pivotX / (this.texture.g2d_region.width | 0),ty + this.texture.pivotY / (this.texture.g2d_region.height | 0)) <= this.mousePixelTreshold) return false;
			return true;
		}
		return false;
	}
	,processContextMouseSignal: function(p_captured,p_cameraX,p_cameraY,p_contextSignal) {
		if(p_captured && p_contextSignal.type == "mouseUp") this.g2d_node.g2d_mouseDownNode = null;
		if(p_captured || this.texture == null || (this.texture.g2d_region.width | 0) == 0 || (this.texture.g2d_region.height | 0) == 0 || this.g2d_node.g2d_transform.g2d_worldScaleX == 0 || this.g2d_node.g2d_transform.g2d_worldScaleY == 0) {
			if(this.g2d_node.g2d_mouseOverNode == this.g2d_node) this.g2d_node.dispatchNodeMouseSignal("mouseOut",this.g2d_node,0,0,p_contextSignal);
			return false;
		}
		var tx = p_cameraX - this.g2d_node.g2d_transform.g2d_worldX;
		var ty = p_cameraY - this.g2d_node.g2d_transform.g2d_worldY;
		if(this.g2d_node.g2d_transform.g2d_worldRotation != 0) {
			var cos = Math.cos(-this.g2d_node.g2d_transform.g2d_worldRotation);
			var sin = Math.sin(-this.g2d_node.g2d_transform.g2d_worldRotation);
			var ox = tx;
			tx = tx * cos - ty * sin;
			ty = ty * cos + ox * sin;
		}
		tx /= this.g2d_node.g2d_transform.g2d_worldScaleX * (this.texture.g2d_region.width | 0);
		ty /= this.g2d_node.g2d_transform.g2d_worldScaleY * (this.texture.g2d_region.height | 0);
		tx += .5;
		ty += .5;
		if(tx >= -this.texture.pivotX / (this.texture.g2d_region.width | 0) && tx <= 1 - this.texture.pivotX / (this.texture.g2d_region.width | 0) && ty >= -this.texture.pivotY / (this.texture.g2d_region.height | 0) && ty <= 1 - this.texture.pivotY / (this.texture.g2d_region.height | 0)) {
			if(this.mousePixelEnabled && this.texture.getAlphaAtUV(tx + this.texture.pivotX / (this.texture.g2d_region.width | 0),ty + this.texture.pivotY / (this.texture.g2d_region.height | 0)) <= this.mousePixelTreshold) {
				if(this.g2d_node.g2d_mouseOverNode == this.g2d_node) this.g2d_node.dispatchNodeMouseSignal("mouseOut",this.g2d_node,tx * (this.texture.g2d_region.width | 0) - (this.texture.g2d_region.width | 0) * .5,ty * (this.texture.g2d_region.height | 0) - (this.texture.g2d_region.height | 0) * .5,p_contextSignal);
				return false;
			}
			this.g2d_node.dispatchNodeMouseSignal(p_contextSignal.type,this.g2d_node,tx * (this.texture.g2d_region.width | 0) - (this.texture.g2d_region.width | 0) * .5,ty * (this.texture.g2d_region.height | 0) - (this.texture.g2d_region.height | 0) * .5,p_contextSignal);
			if(this.g2d_node.g2d_mouseOverNode != this.g2d_node) this.g2d_node.dispatchNodeMouseSignal("mouseOver",this.g2d_node,tx * (this.texture.g2d_region.width | 0) - (this.texture.g2d_region.width | 0) * .5,ty * (this.texture.g2d_region.height | 0) - (this.texture.g2d_region.height | 0) * .5,p_contextSignal);
			return true;
		} else if(this.g2d_node.g2d_mouseOverNode == this.g2d_node) this.g2d_node.dispatchNodeMouseSignal("mouseOut",this.g2d_node,tx * (this.texture.g2d_region.width | 0) - (this.texture.g2d_region.width | 0) * .5,ty * (this.texture.g2d_region.height | 0) - (this.texture.g2d_region.height | 0) * .5,p_contextSignal);
		return false;
	}
	,getBounds: function(p_bounds) {
		if(this.texture == null) {
			if(p_bounds != null) p_bounds.setTo(0,0,0,0); else p_bounds = new com.genome2d.geom.GRectangle(0,0,0,0);
		} else if(p_bounds != null) p_bounds.setTo(-(this.texture.g2d_region.width | 0) * .5 - this.texture.pivotX,-(this.texture.g2d_region.height | 0) * .5 - this.texture.pivotY,this.texture.g2d_region.width | 0,this.texture.g2d_region.height | 0); else p_bounds = new com.genome2d.geom.GRectangle(-(this.texture.g2d_region.width | 0) * .5 - this.texture.pivotX,-(this.texture.g2d_region.height | 0) * .5 - this.texture.pivotY,this.texture.g2d_region.width | 0,this.texture.g2d_region.height | 0);
		return p_bounds;
	}
	,__class__: com.genome2d.components.renderables.GTexturedQuad
});
com.genome2d.components.renderables.GSprite = function() {
	com.genome2d.components.renderables.GTexturedQuad.call(this);
};
$hxClasses["com.genome2d.components.renderables.GSprite"] = com.genome2d.components.renderables.GSprite;
com.genome2d.components.renderables.GSprite.__name__ = ["com","genome2d","components","renderables","GSprite"];
com.genome2d.components.renderables.GSprite.__super__ = com.genome2d.components.renderables.GTexturedQuad;
com.genome2d.components.renderables.GSprite.prototype = $extend(com.genome2d.components.renderables.GTexturedQuad.prototype,{
	get_textureId: function() {
		if(this.texture != null) return this.texture.g2d_id; else return "";
	}
	,set_textureId: function(p_value) {
		this.texture = com.genome2d.textures.GTexture.getTextureById(p_value);
		if(this.texture == null) new com.genome2d.error.GError("Invalid texture with id " + p_value);
		return p_value;
	}
	,__class__: com.genome2d.components.renderables.GSprite
	,__properties__: $extend(com.genome2d.components.renderables.GTexturedQuad.prototype.__properties__,{set_textureId:"set_textureId",get_textureId:"get_textureId"})
});
com.genome2d.components.renderables.particles = {};
com.genome2d.components.renderables.particles.GSimpleParticle = function() {
	this.g2d_id = 0;
	this.g2d_accumulatedEnergy = 0;
	this.g2d_endScale = 1;
	this.g2d_initialScale = 1;
	this.g2d_energy = 0;
	this.g2d_velocityY = 0;
	this.g2d_velocityX = 0;
	this.g2d_id = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_instanceCount++;
};
$hxClasses["com.genome2d.components.renderables.particles.GSimpleParticle"] = com.genome2d.components.renderables.particles.GSimpleParticle;
com.genome2d.components.renderables.particles.GSimpleParticle.__name__ = ["com","genome2d","components","renderables","particles","GSimpleParticle"];
com.genome2d.components.renderables.particles.GSimpleParticle.precache = function(p_precacheCount) {
	if(p_precacheCount < com.genome2d.components.renderables.particles.GSimpleParticle.g2d_instanceCount) return;
	var precached = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_get();
	while(com.genome2d.components.renderables.particles.GSimpleParticle.g2d_instanceCount < p_precacheCount) {
		var n = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_get();
		n.g2d_previous = precached;
		precached = n;
	}
	while(precached != null) {
		var d = precached;
		precached = d.g2d_previous;
		d.g2d_dispose();
	}
};
com.genome2d.components.renderables.particles.GSimpleParticle.g2d_get = function() {
	var instance = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_availableInstance;
	if(instance != null) {
		com.genome2d.components.renderables.particles.GSimpleParticle.g2d_availableInstance = instance.g2d_nextInstance;
		instance.g2d_nextInstance = null;
	} else instance = new com.genome2d.components.renderables.particles.GSimpleParticle();
	return instance;
};
com.genome2d.components.renderables.particles.GSimpleParticle.prototype = {
	g2d_init: function(p_emitter,p_invalidate) {
		if(p_invalidate == null) p_invalidate = true;
		this.g2d_accumulatedEnergy = 0;
		this.g2d_energy = p_emitter.energy * 1000;
		if(p_emitter.energyVariance > 0) this.g2d_energy += p_emitter.energyVariance * 1000 * Math.random();
		this.g2d_initialScale = p_emitter.initialScale;
		if(p_emitter.initialScaleVariance > 0) this.g2d_initialScale += p_emitter.initialScaleVariance * Math.random();
		this.g2d_endScale = p_emitter.endScale;
		if(p_emitter.endScaleVariance > 0) this.g2d_endScale += p_emitter.endScaleVariance * Math.random();
		var particleVelocityX;
		var particleVelocityY;
		var v = p_emitter.initialVelocity;
		if(p_emitter.initialVelocityVariance > 0) v += p_emitter.initialVelocityVariance * Math.random();
		var particleAccelerationX;
		var particleAccelerationY;
		var a = p_emitter.initialAcceleration;
		if(p_emitter.initialAccelerationVariance > 0) a += p_emitter.initialAccelerationVariance * Math.random();
		var vX = particleVelocityX = v;
		var vY = particleVelocityY = 0;
		var aX = particleAccelerationX = a;
		var aY = particleAccelerationY = 0;
		var rot = p_emitter.g2d_node.g2d_transform.g2d_worldRotation;
		if(rot != 0) {
			var sin = Math.sin(rot);
			var cos = Math.cos(rot);
			vX = particleVelocityX = v * cos;
			vY = particleVelocityY = v * sin;
			aX = particleAccelerationX = a * cos;
			aY = particleAccelerationY = a * sin;
		}
		if(p_emitter.dispersionAngle != 0 || p_emitter.dispersionAngleVariance != 0) {
			var rangle = p_emitter.dispersionAngle;
			if(p_emitter.dispersionAngleVariance > 0) rangle += p_emitter.dispersionAngleVariance * Math.random();
			var sin1 = Math.sin(rangle);
			var cos1 = Math.cos(rangle);
			particleVelocityX = vX * cos1 - vY * sin1;
			particleVelocityY = vY * cos1 + vX * sin1;
			particleAccelerationX = aX * cos1 - aY * sin1;
			particleAccelerationY = aY * cos1 + aX * sin1;
		}
		this.g2d_initialVelocityX = this.g2d_velocityX = particleVelocityX * .001;
		this.g2d_initialVelocityY = this.g2d_velocityY = particleVelocityY * .001;
		this.g2d_initialAccelerationX = this.g2d_accelerationX = particleAccelerationX * .001;
		this.g2d_initialAccelerationY = this.g2d_accelerationY = particleAccelerationY * .001;
		this.g2d_initialVelocityAngular = p_emitter.initialAngularVelocity;
		if(p_emitter.initialAngularVelocityVariance > 0) this.g2d_initialVelocityAngular += p_emitter.initialAngularVelocityVariance * Math.random();
		this.g2d_initialRed = p_emitter.initialRed;
		if(p_emitter.initialRedVariance > 0) this.g2d_initialRed += p_emitter.initialRedVariance * Math.random();
		this.g2d_initialGreen = p_emitter.initialGreen;
		if(p_emitter.initialGreenVariance > 0) this.g2d_initialGreen += p_emitter.initialGreenVariance * Math.random();
		this.g2d_initialBlue = p_emitter.initialBlue;
		if(p_emitter.initialBlueVariance > 0) this.g2d_initialBlue += p_emitter.initialBlueVariance * Math.random();
		this.g2d_initialAlpha = p_emitter.initialAlpha;
		if(p_emitter.initialAlphaVariance > 0) this.g2d_initialAlpha += p_emitter.initialAlphaVariance * Math.random();
		this.g2d_endRed = p_emitter.endRed;
		if(p_emitter.endRedVariance > 0) this.g2d_endRed += p_emitter.endRedVariance * Math.random();
		this.g2d_endGreen = p_emitter.endGreen;
		if(p_emitter.endGreenVariance > 0) this.g2d_endGreen += p_emitter.endGreenVariance * Math.random();
		this.g2d_endBlue = p_emitter.endBlue;
		if(p_emitter.endBlueVariance > 0) this.g2d_endBlue += p_emitter.endBlueVariance * Math.random();
		this.g2d_endAlpha = p_emitter.endAlpha;
		if(p_emitter.endAlphaVariance > 0) this.g2d_endAlpha += p_emitter.endAlphaVariance * Math.random();
		this.g2d_redDif = this.g2d_endRed - this.g2d_initialRed;
		this.g2d_greenDif = this.g2d_endGreen - this.g2d_initialGreen;
		this.g2d_blueDif = this.g2d_endBlue - this.g2d_initialBlue;
		this.g2d_alphaDif = this.g2d_endAlpha - this.g2d_initialAlpha;
		this.g2d_scaleDif = this.g2d_endScale - this.g2d_initialScale;
	}
	,g2d_update: function(p_emitter,p_deltaTime) {
		this.g2d_accumulatedEnergy += p_deltaTime;
		if(this.g2d_accumulatedEnergy >= this.g2d_energy) {
			p_emitter.deactivateParticle(this);
			return;
		}
		var p = this.g2d_accumulatedEnergy / this.g2d_energy;
		this.g2d_velocityX += this.g2d_accelerationX * p_deltaTime;
		this.g2d_velocityY += this.g2d_accelerationY * p_deltaTime;
		this.g2d_red = this.g2d_redDif * p + this.g2d_initialRed;
		this.g2d_green = this.g2d_greenDif * p + this.g2d_initialGreen;
		this.g2d_blue = this.g2d_blueDif * p + this.g2d_initialBlue;
		this.g2d_alpha = this.g2d_alphaDif * p + this.g2d_initialAlpha;
		this.g2d_x += this.g2d_velocityX * p_deltaTime;
		this.g2d_y += this.g2d_velocityY * p_deltaTime;
		this.g2d_rotation += this.g2d_initialVelocityAngular * p_deltaTime;
		this.g2d_scaleX = this.g2d_scaleY = this.g2d_scaleDif * p + this.g2d_initialScale;
	}
	,g2d_dispose: function() {
		if(this.g2d_next != null) this.g2d_next.g2d_previous = this.g2d_previous;
		if(this.g2d_previous != null) this.g2d_previous.g2d_next = this.g2d_next;
		this.g2d_next = null;
		this.g2d_previous = null;
		this.g2d_nextInstance = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_availableInstance;
		com.genome2d.components.renderables.particles.GSimpleParticle.g2d_availableInstance = this;
	}
	,__class__: com.genome2d.components.renderables.particles.GSimpleParticle
};
com.genome2d.components.renderables.particles.GSimpleParticleSystem = function() {
	this.g2d_activeParticles = 0;
	this.g2d_accumulatedEmission = 0;
	this.g2d_accumulatedTime = 0;
	this.burst = false;
	this.initialAngleVariance = 0;
	this.initialAngle = 0;
	this.dispersionAngleVariance = 0;
	this.dispersionAngle = 0;
	this.dispersionYVariance = 0;
	this.dispersionXVariance = 0;
	this.endAlphaVariance = 0;
	this.endAlpha = 1;
	this.endBlueVariance = 0;
	this.endBlue = 1;
	this.endGreenVariance = 0;
	this.endGreen = 1;
	this.endRedVariance = 0;
	this.endRed = 1;
	this.initialAlphaVariance = 0;
	this.initialAlpha = 1;
	this.initialBlueVariance = 0;
	this.initialBlue = 1;
	this.initialGreenVariance = 0;
	this.initialGreen = 1;
	this.initialRedVariance = 0;
	this.initialRed = 1;
	this.initialAngularVelocityVariance = 0;
	this.initialAngularVelocity = 0;
	this.initialAccelerationVariance = 0;
	this.initialAcceleration = 0;
	this.initialVelocityVariance = 0;
	this.initialVelocity = 0;
	this.emissionDelay = 0;
	this.emissionTime = 1;
	this.emissionVariance = 0;
	this.emission = 1;
	this.energyVariance = 0;
	this.energy = 0;
	this.endScaleVariance = 0;
	this.endScale = 1;
	this.initialScaleVariance = 0;
	this.initialScale = 1;
	this.useWorldSpace = false;
	this.emit = false;
	this.blendMode = 1;
	com.genome2d.components.GComponent.call(this);
};
$hxClasses["com.genome2d.components.renderables.particles.GSimpleParticleSystem"] = com.genome2d.components.renderables.particles.GSimpleParticleSystem;
com.genome2d.components.renderables.particles.GSimpleParticleSystem.__name__ = ["com","genome2d","components","renderables","particles","GSimpleParticleSystem"];
com.genome2d.components.renderables.particles.GSimpleParticleSystem.__interfaces__ = [com.genome2d.components.renderables.IRenderable];
com.genome2d.components.renderables.particles.GSimpleParticleSystem.__super__ = com.genome2d.components.GComponent;
com.genome2d.components.renderables.particles.GSimpleParticleSystem.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	get_initialColor: function() {
		var red = (this.initialRed * 255 | 0) << 16;
		var green = (this.initialGreen * 255 | 0) << 8;
		var blue = this.initialBlue * 255 | 0;
		return red + green + blue;
	}
	,set_initialColor: function(p_value) {
		this.initialRed = (p_value >> 16 & 255 | 0) / 255;
		this.initialGreen = (p_value >> 8 & 255 | 0) / 255;
		this.initialBlue = (p_value & 255 | 0) / 255;
		return p_value;
	}
	,get_endColor: function() {
		var red = (this.endRed * 255 | 0) << 16;
		var green = (this.endGreen * 255 | 0) << 8;
		var blue = this.endBlue * 255 | 0;
		return red + green + blue | 0;
	}
	,set_endColor: function(p_value) {
		this.endRed = (p_value >> 16 & 255) / 255;
		this.endGreen = (p_value >> 8 & 255) / 255;
		this.endBlue = (p_value & 255) / 255;
		return p_value;
	}
	,get_settings: function() {
		return this.blendMode + "|" + Std.string(this.emit) + "|" + Std.string(this.useWorldSpace) + "|" + this.initialScale + "|" + this.initialScaleVariance + "|" + this.endScale + "|" + this.endScaleVariance + "|" + this.energy + "|" + this.energyVariance + "|" + this.emission + "|" + this.emissionVariance + "|" + this.emissionTime + "|" + this.emissionDelay + "|" + this.initialVelocity + "|" + this.initialVelocityVariance + "|" + this.initialAcceleration + "|" + this.initialAccelerationVariance + "|" + this.initialAngularVelocity + "|" + this.initialAngularVelocityVariance + "|" + this.initialRed + "|" + this.initialRedVariance + "|" + this.initialGreen + "|" + this.initialGreenVariance + "|" + this.initialBlue + "|" + this.initialBlueVariance + "|" + this.initialAlpha + "|" + this.initialAlphaVariance + "|" + this.endRed + "|" + this.endRedVariance + "|" + this.endGreen + "|" + this.endGreenVariance + "|" + this.endBlue + "|" + this.endBlueVariance + "|" + this.endAlpha + "|" + this.endAlphaVariance + "|" + this.dispersionXVariance + "|" + this.dispersionYVariance + "|" + this.dispersionAngle + "|" + this.dispersionAngleVariance + "|" + this.initialAngle + "|" + this.initialAngleVariance + "|" + Std.string(this.burst) + "|" + (this.texture != null?this.texture.g2d_id:"");
	}
	,set_settings: function(p_value) {
		var split = p_value.split("|");
		this.blendMode = Std.parseInt(split[0]);
		if(split[1] == "true") this.emit = true; else this.emit = false;
		if(split[2] == "true") this.useWorldSpace = true; else this.useWorldSpace = false;
		this.initialScale = Std.parseFloat(split[3]);
		this.initialScaleVariance = Std.parseFloat(split[4]);
		this.endScale = Std.parseFloat(split[5]);
		this.endScaleVariance = Std.parseFloat(split[6]);
		this.energy = Std.parseFloat(split[7]);
		this.energyVariance = Std.parseFloat(split[8]);
		this.emission = Std.parseInt(split[9]);
		this.emissionVariance = Std.parseInt(split[10]);
		this.emissionTime = Std.parseFloat(split[11]);
		this.emissionDelay = Std.parseFloat(split[12]);
		this.initialVelocity = Std.parseFloat(split[13]);
		this.initialVelocityVariance = Std.parseFloat(split[14]);
		this.initialAcceleration = Std.parseFloat(split[15]);
		this.initialAccelerationVariance = Std.parseFloat(split[16]);
		this.initialAngularVelocity = Std.parseFloat(split[17]);
		this.initialAngularVelocityVariance = Std.parseFloat(split[18]);
		this.initialRed = Std.parseFloat(split[19]);
		this.initialRedVariance = Std.parseFloat(split[20]);
		this.initialGreen = Std.parseFloat(split[21]);
		this.initialGreenVariance = Std.parseFloat(split[22]);
		this.initialBlue = Std.parseFloat(split[23]);
		this.initialBlueVariance = Std.parseFloat(split[24]);
		this.initialAlpha = Std.parseFloat(split[25]);
		this.initialAlphaVariance = Std.parseFloat(split[26]);
		this.endRed = Std.parseFloat(split[27]);
		this.endRedVariance = Std.parseFloat(split[28]);
		this.endGreen = Std.parseFloat(split[29]);
		this.endGreenVariance = Std.parseFloat(split[30]);
		this.endBlue = Std.parseFloat(split[31]);
		this.endBlueVariance = Std.parseFloat(split[32]);
		this.endAlpha = Std.parseFloat(split[33]);
		this.endAlphaVariance = Std.parseFloat(split[34]);
		this.dispersionXVariance = Std.parseFloat(split[35]);
		this.dispersionYVariance = Std.parseFloat(split[36]);
		this.dispersionAngle = Std.parseFloat(split[37]);
		this.dispersionAngleVariance = Std.parseFloat(split[38]);
		this.initialAngle = Std.parseFloat(split[39]);
		this.initialAngleVariance = Std.parseFloat(split[40]);
		if(split[41] == "true") this.burst = true; else this.burst = false;
		this.set_textureId(split[42]);
		return p_value;
	}
	,get_textureId: function() {
		if(this.texture != null) return this.texture.g2d_id; else return "";
	}
	,set_textureId: function(p_value) {
		this.texture = com.genome2d.textures.GTexture.getTextureById(p_value);
		if(this.texture == null) new com.genome2d.error.GError("Invalid texture with id " + p_value);
		return p_value;
	}
	,setInitialParticlePosition: function(p_particle) {
		if(this.useWorldSpace) p_particle.g2d_x = this.g2d_node.g2d_transform.g2d_worldX; else p_particle.g2d_x = 0;
		if(this.dispersionXVariance > 0) p_particle.g2d_x += this.dispersionXVariance * Math.random() - this.dispersionXVariance * .5;
		if(this.useWorldSpace) p_particle.g2d_y = this.g2d_node.g2d_transform.g2d_worldY; else p_particle.g2d_y = 0;
		if(this.dispersionYVariance > 0) p_particle.g2d_y += this.dispersionYVariance * Math.random() - this.dispersionYVariance * .5;
		p_particle.g2d_rotation = this.initialAngle;
		if(this.initialAngleVariance > 0) p_particle.g2d_rotation += this.initialAngleVariance * Math.random();
		p_particle.g2d_scaleX = p_particle.g2d_scaleY = this.initialScale;
		if(this.initialScaleVariance > 0) {
			var sd = this.initialScaleVariance * Math.random();
			p_particle.g2d_scaleX += sd;
			p_particle.g2d_scaleY += sd;
		}
	}
	,init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this.update));
	}
	,setup: function(p_maxCount,p_precacheCount,p_disposeImmediately) {
		if(p_disposeImmediately == null) p_disposeImmediately = true;
		if(p_precacheCount == null) p_precacheCount = 0;
		if(p_maxCount == null) p_maxCount = 0;
		this.g2d_accumulatedTime = 0;
		this.g2d_accumulatedEmission = 0;
	}
	,g2d_createParticle: function() {
		var particle = com.genome2d.components.renderables.particles.GSimpleParticle.g2d_get();
		if(this.g2d_firstParticle != null) {
			particle.g2d_next = this.g2d_firstParticle;
			this.g2d_firstParticle.g2d_previous = particle;
			this.g2d_firstParticle = particle;
		} else {
			this.g2d_firstParticle = particle;
			this.g2d_lastParticle = particle;
		}
		return particle;
	}
	,forceBurst: function() {
		var currentEmission = Std["int"](this.emission + this.emissionVariance * Math.random());
		var _g = 0;
		while(_g < currentEmission) {
			var i = _g++;
			this.g2d_activateParticle();
		}
		this.emit = false;
	}
	,update: function(p_deltaTime) {
		this.g2d_lastUpdateTime = p_deltaTime;
		if(this.emit) {
			if(this.burst) this.forceBurst(); else {
				this.g2d_accumulatedTime += p_deltaTime * .001;
				var time = this.g2d_accumulatedTime % (this.emissionTime + this.emissionDelay);
				if(time <= this.emissionTime) {
					var updateEmission = this.emission;
					if(this.emissionVariance > 0) updateEmission += this.emissionVariance * Math.random();
					this.g2d_accumulatedEmission += updateEmission * p_deltaTime * .001;
					while(this.g2d_accumulatedEmission > 0) {
						this.g2d_activateParticle();
						this.g2d_accumulatedEmission--;
					}
				}
			}
		}
		var particle = this.g2d_firstParticle;
		while(particle != null) {
			var next = particle.g2d_next;
			particle.g2d_update(this,this.g2d_lastUpdateTime);
			particle = next;
		}
	}
	,render: function(p_camera,p_useMatrix) {
		if(this.texture == null) return;
		var particle = this.g2d_firstParticle;
		while(particle != null) {
			var next = particle.g2d_next;
			var tx;
			var ty;
			if(this.useWorldSpace) {
				tx = particle.g2d_x;
				ty = particle.g2d_y;
			} else {
				tx = this.g2d_node.g2d_transform.g2d_worldX + particle.g2d_x;
				ty = this.g2d_node.g2d_transform.g2d_worldY + particle.g2d_y;
			}
			((function($this) {
				var $r;
				if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
				$r = com.genome2d.node.GNode.g2d_core;
				return $r;
			}(this))).getContext().draw(this.texture,tx,ty,particle.g2d_scaleX * this.g2d_node.g2d_transform.g2d_worldScaleX,particle.g2d_scaleY * this.g2d_node.g2d_transform.g2d_worldScaleY,particle.g2d_rotation,particle.g2d_red,particle.g2d_green,particle.g2d_blue,particle.g2d_alpha,this.blendMode,null);
			particle = next;
		}
	}
	,g2d_activateParticle: function() {
		var particle = this.g2d_createParticle();
		this.setInitialParticlePosition(particle);
		particle.g2d_init(this);
	}
	,deactivateParticle: function(p_particle) {
		if(p_particle == this.g2d_lastParticle) this.g2d_lastParticle = this.g2d_lastParticle.g2d_previous;
		if(p_particle == this.g2d_firstParticle) this.g2d_firstParticle = this.g2d_firstParticle.g2d_next;
		p_particle.g2d_dispose();
	}
	,dispose: function() {
		while(this.g2d_firstParticle != null) this.deactivateParticle(this.g2d_firstParticle);
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().remove($bind(this,this.update));
		com.genome2d.components.GComponent.prototype.dispose.call(this);
	}
	,clear: function(p_disposeCachedParticles) {
		if(p_disposeCachedParticles == null) p_disposeCachedParticles = false;
	}
	,getBounds: function(p_target) {
		return null;
	}
	,__class__: com.genome2d.components.renderables.particles.GSimpleParticleSystem
	,__properties__: $extend(com.genome2d.components.GComponent.prototype.__properties__,{set_textureId:"set_textureId",get_textureId:"get_textureId",set_settings:"set_settings",get_settings:"get_settings",set_endColor:"set_endColor",get_endColor:"get_endColor",set_initialColor:"set_initialColor",get_initialColor:"get_initialColor"})
});
com.genome2d.context = {};
com.genome2d.context.GBlendMode = function() { };
$hxClasses["com.genome2d.context.GBlendMode"] = com.genome2d.context.GBlendMode;
com.genome2d.context.GBlendMode.__name__ = ["com","genome2d","context","GBlendMode"];
com.genome2d.context.GBlendMode.addBlendMode = function(p_normalFactors,p_premultipliedFactors) {
	com.genome2d.context.GBlendMode.blendFactors[0].push(p_normalFactors);
	com.genome2d.context.GBlendMode.blendFactors[1].push(p_premultipliedFactors);
	return com.genome2d.context.GBlendMode.blendFactors[0].length;
};
com.genome2d.context.GBlendMode.setBlendMode = function(p_context,p_mode,p_premultiplied) {
	var p;
	if(p_premultiplied) p = 1; else p = 0;
	p_context.blendFunc(com.genome2d.context.GBlendMode.blendFactors[p][p_mode][0],com.genome2d.context.GBlendMode.blendFactors[p][p_mode][1]);
};
com.genome2d.context.GContextCamera = function() {
	this.normalizedViewHeight = 1;
	this.normalizedViewWidth = 1;
	this.normalizedViewY = 0;
	this.normalizedViewX = 0;
	this.mask = 16777215;
	this.y = 0;
	this.x = 0;
	this.scaleY = 1;
	this.scaleX = 1;
	this.rotation = 0;
};
$hxClasses["com.genome2d.context.GContextCamera"] = com.genome2d.context.GContextCamera;
com.genome2d.context.GContextCamera.__name__ = ["com","genome2d","context","GContextCamera"];
com.genome2d.context.GContextCamera.prototype = {
	__class__: com.genome2d.context.GContextCamera
};
com.genome2d.context.GContextConfig = function(p_viewRect) {
	this.enableStats = false;
	this.nativeStage = window.document.getElementById("canvas");
	this.viewRect = p_viewRect;
	if(this.nativeStage == null) {
		if(p_viewRect == null) new com.genome2d.error.GError("No canvas found");
		var _this = window.document;
		this.nativeStage = _this.createElement("canvas");
		this.nativeStage.width = this.viewRect.width | 0;
		this.nativeStage.height = this.viewRect.height | 0;
		window.document.body.appendChild(this.nativeStage);
	} else if(this.viewRect == null) this.viewRect = new com.genome2d.geom.GRectangle(0,0,this.nativeStage.width,this.nativeStage.height);
	this.contextClass = com.genome2d.context.webgl.GWebGLContext;
};
$hxClasses["com.genome2d.context.GContextConfig"] = com.genome2d.context.GContextConfig;
com.genome2d.context.GContextConfig.__name__ = ["com","genome2d","context","GContextConfig"];
com.genome2d.context.GContextConfig.prototype = {
	__class__: com.genome2d.context.GContextConfig
};
com.genome2d.context.GContextFeature = function() { };
$hxClasses["com.genome2d.context.GContextFeature"] = com.genome2d.context.GContextFeature;
com.genome2d.context.GContextFeature.__name__ = ["com","genome2d","context","GContextFeature"];
com.genome2d.context.GRequestAnimationFrame = function() { };
$hxClasses["com.genome2d.context.GRequestAnimationFrame"] = com.genome2d.context.GRequestAnimationFrame;
com.genome2d.context.GRequestAnimationFrame.__name__ = ["com","genome2d","context","GRequestAnimationFrame"];
com.genome2d.context.GRequestAnimationFrame.request = function(method) {
	var requestAnimationFrame = window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(method1,element) {
		window.setTimeout(method1,16.666666666666668);
	}))));
	requestAnimationFrame(method);
};
com.genome2d.context.filters = {};
com.genome2d.context.filters.GFilter = function() {
	this.fragmentCode = "";
	this.overrideFragmentShader = false;
	this.g2d_id = Std.string(Type.getClass(this));
};
$hxClasses["com.genome2d.context.filters.GFilter"] = com.genome2d.context.filters.GFilter;
com.genome2d.context.filters.GFilter.__name__ = ["com","genome2d","context","filters","GFilter"];
com.genome2d.context.filters.GFilter.prototype = {
	__class__: com.genome2d.context.filters.GFilter
};
com.genome2d.context.stats = {};
com.genome2d.context.stats.IStats = function() { };
$hxClasses["com.genome2d.context.stats.IStats"] = com.genome2d.context.stats.IStats;
com.genome2d.context.stats.IStats.__name__ = ["com","genome2d","context","stats","IStats"];
com.genome2d.context.stats.IStats.prototype = {
	__class__: com.genome2d.context.stats.IStats
};
com.genome2d.context.stats.GStats = function(p_canvas) {
	this.g2d_previousTime = 0;
	this.g2d_frames = 0;
	this.g2d_previousTime = new Date().getTime();
	com.genome2d.context.stats.GStats.fps = 0;
	var _this = window.document;
	this.g2d_container = _this.createElement("div");
	this.g2d_container.id = "stats";
	this.g2d_container.style.cssText = "width:" + p_canvas.clientWidth + "px;opacity:0.9;cursor:pointer";
	this.g2d_container.style.position = "absolute";
	this.g2d_container.style.left = p_canvas.offsetLeft + "px";
	this.g2d_container.style.top = p_canvas.offsetTop + "px";
	var _this1 = window.document;
	this.g2d_fpsDiv = _this1.createElement("div");
	this.g2d_fpsDiv.id = "fps";
	this.g2d_fpsDiv.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002";
	this.g2d_container.appendChild(this.g2d_fpsDiv);
	var _this2 = window.document;
	this.g2d_fpsText = _this2.createElement("div");
	this.g2d_fpsText.id = "fpsText";
	this.g2d_fpsText.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;line-height:15px";
	this.g2d_fpsText.innerHTML = "FPS";
	this.g2d_fpsDiv.appendChild(this.g2d_fpsText);
	p_canvas.parentElement.appendChild(this.g2d_container);
};
$hxClasses["com.genome2d.context.stats.GStats"] = com.genome2d.context.stats.GStats;
com.genome2d.context.stats.GStats.__name__ = ["com","genome2d","context","stats","GStats"];
com.genome2d.context.stats.GStats.__interfaces__ = [com.genome2d.context.stats.IStats];
com.genome2d.context.stats.GStats.prototype = {
	render: function(p_context) {
		if(com.genome2d.context.stats.GStats.visible) {
			if(this.g2d_fpsDiv.parentElement == null) this.g2d_container.appendChild(this.g2d_fpsDiv);
			var time = new Date().getTime();
			this.g2d_frames++;
			if(time > this.g2d_previousTime + 1000) {
				com.genome2d.context.stats.GStats.fps = Math.round(this.g2d_frames * 1000 / (time - this.g2d_previousTime));
				this.g2d_fpsText.textContent = "FPS: " + com.genome2d.context.stats.GStats.fps + " Drawcalls: " + com.genome2d.context.stats.GStats.drawCalls;
				this.g2d_previousTime = time;
				this.g2d_frames = 0;
			}
		} else if(this.g2d_fpsDiv.parentElement != null) this.g2d_container.removeChild(this.g2d_fpsDiv);
	}
	,clear: function() {
		com.genome2d.context.stats.GStats.drawCalls = 0;
	}
	,__class__: com.genome2d.context.stats.GStats
};
com.genome2d.context.webgl = {};
com.genome2d.context.webgl.GWebGLContext = function(p_config) {
	this.g2d_backgroundAlpha = 1;
	this.g2d_backgroundBlue = 0;
	this.g2d_backgroundGreen = 0;
	this.g2d_backgroundRed = 0;
	this.g2d_reinitialize = false;
	this.g2d_nativeStage = p_config.nativeStage;
	this.g2d_stageViewRect = p_config.viewRect;
	this.g2d_stats = new com.genome2d.context.stats.GStats(this.g2d_nativeStage);
	this.onInitialized = new msignal.Signal0();
	this.onFailed = new msignal.Signal1();
	this.onInvalidated = new msignal.Signal0();
	this.onFrame = new msignal.Signal1();
	this.onMouseSignal = new msignal.Signal1();
	this.onKeyboardSignal = new msignal.Signal1();
};
$hxClasses["com.genome2d.context.webgl.GWebGLContext"] = com.genome2d.context.webgl.GWebGLContext;
com.genome2d.context.webgl.GWebGLContext.__name__ = ["com","genome2d","context","webgl","GWebGLContext"];
com.genome2d.context.webgl.GWebGLContext.prototype = {
	hasFeature: function(p_feature) {
		switch(p_feature) {
		case 2:
			return true;
		}
		return false;
	}
	,getNativeStage: function() {
		return this.g2d_nativeStage;
	}
	,getNativeContext: function() {
		return this.g2d_nativeContext;
	}
	,setBackgroundRGBA: function(p_color,p_alpha) {
		if(p_alpha == null) p_alpha = 1;
		this.g2d_backgroundRed = (p_color >> 16 & 255 | 0) / 255;
		this.g2d_backgroundGreen = (p_color >> 8 & 255 | 0) / 255;
		this.g2d_backgroundBlue = (p_color & 255 | 0) / 255;
		this.g2d_backgroundAlpha = p_alpha;
	}
	,getDefaultCamera: function() {
		return this.g2d_defaultCamera;
	}
	,getStageViewRect: function() {
		return this.g2d_stageViewRect;
	}
	,init: function() {
		try {
			this.g2d_nativeContext = this.g2d_nativeStage.getContext("webgl");
			if(this.g2d_nativeContext == null) this.g2d_nativeContext = this.g2d_nativeStage.getContext("experimental-webgl");
		} catch( e ) {
		}
		if(this.g2d_nativeContext == null) {
			this.onFailed.dispatch("No WebGL support detected.");
			return;
		}
		com.genome2d.context.webgl.renderers.GRendererCommon.init();
		this.g2d_drawRenderer = new com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer();
		this.g2d_defaultCamera = new com.genome2d.context.GContextCamera();
		this.g2d_defaultCamera.x = this.g2d_stageViewRect.width / 2;
		this.g2d_defaultCamera.y = this.g2d_stageViewRect.height / 2;
		this.g2d_activeViewRect = new com.genome2d.geom.GRectangle();
		this.g2d_currentTime = new Date().getTime();
		this.g2d_nativeStage.addEventListener("mousedown",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeStage.addEventListener("mouseup",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeStage.addEventListener("mousemove",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeStage.addEventListener("touchstart",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeStage.addEventListener("touchend",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeStage.addEventListener("touchmove",$bind(this,this.g2d_mouseEventHandler));
		this.g2d_nativeContext.pixelStorei(37441,1);
		this.onInitialized.dispatch();
		com.genome2d.context.GRequestAnimationFrame.request($bind(this,this.g2d_enterFrameHandler));
	}
	,setCamera: function(p_camera) {
		this.g2d_projectionMatrix = new Float32Array([2.0 / this.g2d_stageViewRect.width,0.0,0.0,-1.0,0.0,-2. / this.g2d_stageViewRect.height,0.0,1.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
	}
	,getMaskRect: function() {
		return null;
	}
	,setMaskRect: function(p_maskRect) {
	}
	,begin: function() {
		this.g2d_stats.clear();
		this.g2d_activeRenderer = null;
		this.setCamera(this.g2d_defaultCamera);
		this.g2d_nativeContext.viewport(0,0,this.g2d_stageViewRect.width | 0,this.g2d_stageViewRect.height | 0);
		this.g2d_nativeContext.clearColor(this.g2d_backgroundRed,this.g2d_backgroundGreen,this.g2d_backgroundBlue,this.g2d_backgroundAlpha);
		this.g2d_nativeContext.clear(16640);
		this.g2d_nativeContext.disable(2929);
		this.g2d_nativeContext.enable(3042);
		com.genome2d.context.GBlendMode.setBlendMode(this.g2d_nativeContext,1,true);
	}
	,draw: function(p_texture,p_x,p_y,p_scaleX,p_scaleY,p_rotation,p_red,p_green,p_blue,p_alpha,p_blendMode,p_filter) {
		if(p_blendMode == null) p_blendMode = 1;
		if(p_alpha == null) p_alpha = 1;
		if(p_blue == null) p_blue = 1;
		if(p_green == null) p_green = 1;
		if(p_red == null) p_red = 1;
		if(p_rotation == null) p_rotation = 0;
		if(p_scaleY == null) p_scaleY = 1;
		if(p_scaleX == null) p_scaleX = 1;
		this.bindRenderer(this.g2d_drawRenderer);
		this.g2d_drawRenderer.draw(p_x,p_y,p_scaleX,p_scaleY,p_rotation,p_red,p_green,p_blue,p_alpha,p_texture);
	}
	,drawMatrix: function(p_texture,p_a,p_b,p_c,p_d,p_tx,p_ty,p_red,p_green,p_blue,p_alpha,p_blendMode,p_filter) {
		if(p_blendMode == null) p_blendMode = 1;
		if(p_alpha == null) p_alpha = 1;
		if(p_blue == null) p_blue = 1;
		if(p_green == null) p_green = 1;
		if(p_red == null) p_red = 1;
	}
	,drawSource: function(p_texture,p_sourceX,p_sourceY,p_sourceWidth,p_sourceHeight,p_x,p_y,p_scaleX,p_scaleY,p_rotation,p_red,p_green,p_blue,p_alpha,p_blendMode,p_filter) {
		if(p_blendMode == null) p_blendMode = 1;
		if(p_alpha == null) p_alpha = 1;
		if(p_blue == null) p_blue = 1;
		if(p_green == null) p_green = 1;
		if(p_red == null) p_red = 1;
		if(p_rotation == null) p_rotation = 0;
		if(p_scaleY == null) p_scaleY = 1;
		if(p_scaleX == null) p_scaleX = 1;
	}
	,drawPoly: function(p_texture,p_vertices,p_uvs,p_x,p_y,p_scaleX,p_scaleY,p_rotation,p_red,p_green,p_blue,p_alpha,p_blendMode,p_filter) {
		if(p_blendMode == null) p_blendMode = 1;
		if(p_alpha == null) p_alpha = 1;
		if(p_blue == null) p_blue = 1;
		if(p_green == null) p_green = 1;
		if(p_red == null) p_red = 1;
		if(p_rotation == null) p_rotation = 0;
		if(p_scaleY == null) p_scaleY = 1;
		if(p_scaleX == null) p_scaleX = 1;
	}
	,bindRenderer: function(p_renderer) {
		if(p_renderer != this.g2d_activeRenderer || this.g2d_activeRenderer == null) {
			if(this.g2d_activeRenderer != null) {
				this.g2d_activeRenderer.push();
				this.g2d_activeRenderer.clear();
			}
			this.g2d_activeRenderer = p_renderer;
			this.g2d_activeRenderer.bind(this,this.g2d_reinitialize);
		}
	}
	,end: function() {
		if(this.g2d_activeRenderer != null) {
			this.g2d_activeRenderer.push();
			this.g2d_activeRenderer.clear();
		}
		this.g2d_reinitialize = false;
	}
	,clearStencil: function() {
	}
	,renderToStencil: function(p_stencilLayer) {
	}
	,renderToColor: function(p_stencilLayer) {
	}
	,setRenderTarget: function(p_texture,p_transform) {
	}
	,g2d_enterFrameHandler: function() {
		var currentTime = new Date().getTime();
		this.g2d_currentDeltaTime = currentTime - this.g2d_currentTime;
		this.g2d_currentTime = currentTime;
		this.g2d_stats.render(this);
		this.onFrame.dispatch(this.g2d_currentDeltaTime);
		com.genome2d.context.GRequestAnimationFrame.request($bind(this,this.g2d_enterFrameHandler));
	}
	,g2d_mouseEventHandler: function(event) {
		var captured = false;
		event.preventDefault();
		event.stopPropagation();
		var mx;
		var my;
		if(js.Boot.__instanceof(event,MouseEvent)) {
			var me = event;
			mx = me.pageX - this.g2d_nativeStage.offsetLeft;
			my = me.pageY - this.g2d_nativeStage.offsetTop;
		} else {
			var te = event;
			mx = te.targetTouches[0].pageX;
			my = te.targetTouches[0].pageY;
		}
		var signal = new com.genome2d.signals.GMouseSignal(com.genome2d.signals.GMouseSignalType.fromNative(event.type),mx,my,captured);
		this.onMouseSignal.dispatch(signal);
	}
	,dispose: function() {
	}
	,setDepthTest: function(p_depthMask,p_compareMode) {
	}
	,setRenderTargets: function(p_textures,p_transform) {
	}
	,__class__: com.genome2d.context.webgl.GWebGLContext
};
com.genome2d.context.webgl.renderers = {};
com.genome2d.context.webgl.renderers.IGRenderer = function() { };
$hxClasses["com.genome2d.context.webgl.renderers.IGRenderer"] = com.genome2d.context.webgl.renderers.IGRenderer;
com.genome2d.context.webgl.renderers.IGRenderer.__name__ = ["com","genome2d","context","webgl","renderers","IGRenderer"];
com.genome2d.context.webgl.renderers.IGRenderer.prototype = {
	__class__: com.genome2d.context.webgl.renderers.IGRenderer
};
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer = function() {
	this.g2d_useSeparatedAlphaPipeline = false;
	this.g2d_activeAlpha = false;
	this.g2d_quadCount = 0;
	this.g2d_initialized = false;
};
$hxClasses["com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer"] = com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer;
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.__name__ = ["com","genome2d","context","webgl","renderers","GQuadTextureShaderRenderer"];
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.__interfaces__ = [com.genome2d.context.webgl.renderers.IGRenderer];
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.prototype = {
	getShader: function(shaderSrc,shaderType) {
		var shader = this.g2d_nativeContext.createShader(shaderType);
		this.g2d_nativeContext.shaderSource(shader,shaderSrc);
		this.g2d_nativeContext.compileShader(shader);
		if(!this.g2d_nativeContext.getShaderParameter(shader,35713)) {
			console.log("Shader compilation error: " + this.g2d_nativeContext.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}
	,initialize: function(p_context) {
		this.g2d_context = p_context;
		this.g2d_nativeContext = this.g2d_context.g2d_nativeContext;
		var fragmentShader = this.getShader("\r\n\t\t\t//#ifdef GL_ES\r\n\t\t\tprecision lowp float;\r\n\t\t\t//#endif\r\n\r\n\t\t\tvarying vec2 vTexCoord;\r\n\t\t\tvarying vec4 vColor;\r\n\r\n\t\t\tuniform sampler2D sTexture;\r\n\r\n\t\t\tvoid main(void)\r\n\t\t\t{\r\n\t\t\t\tgl_FragColor = texture2D(sTexture, vTexCoord) * vColor;\r\n\t\t\t}\r\n\t\t",35632);
		var vertexShader = this.getShader("\r\n\t\t\tuniform mat4 projectionMatrix;\r\n\t\t\tuniform vec4 transforms[" + 120 + "];\r\n\r\n\t\t\tattribute vec2 aPosition;\r\n\t\t\tattribute vec2 aTexCoord;\r\n\t\t\tattribute vec4 aConstantIndex;\r\n\r\n\t\t\tvarying vec2 vTexCoord;\r\n\t\t\tvarying vec4 vColor;\r\n\r\n\t\t\tvoid main(void)\r\n\t\t\t{\r\n\t\t\t\tgl_Position = vec4(aPosition.x*transforms[int(aConstantIndex.z)].x, aPosition.y*transforms[int(aConstantIndex.z)].y, 0, 1);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x - transforms[int(aConstantIndex.z)].z, gl_Position.y - transforms[int(aConstantIndex.z)].w, 0, 1);\r\n\t\t\t\tfloat c = cos(transforms[int(aConstantIndex.x)].z);\r\n\t\t\t\tfloat s = sin(transforms[int(aConstantIndex.x)].z);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x * c - gl_Position.y * s, gl_Position.x * s + gl_Position.y * c, 0, 1);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x+transforms[int(aConstantIndex.x)].x, gl_Position.y+transforms[int(aConstantIndex.x)].y, 0, 1);\r\n\t\t\t\tgl_Position = gl_Position * projectionMatrix;\r\n\r\n\t\t\t\tvTexCoord = vec2(aTexCoord.x*transforms[int(aConstantIndex.y)].z+transforms[int(aConstantIndex.y)].x, aTexCoord.y*transforms[int(aConstantIndex.y)].w+transforms[int(aConstantIndex.y)].y);\r\n\t\t\t\tvColor = transforms[int(aConstantIndex.w)];\r\n\t\t\t}\r\n\t\t ",35633);
		this.g2d_program = this.g2d_nativeContext.createProgram();
		this.g2d_nativeContext.attachShader(this.g2d_program,vertexShader);
		this.g2d_nativeContext.attachShader(this.g2d_program,fragmentShader);
		this.g2d_nativeContext.linkProgram(this.g2d_program);
		this.g2d_nativeContext.useProgram(this.g2d_program);
		var vertices = new Float32Array(240);
		var uvs = new Float32Array(240);
		var registerIndices = new Float32Array(360);
		var registerIndicesAlpha = new Float32Array(480);
		var _g = 0;
		while(_g < 30) {
			var i = _g++;
			vertices[i * 8] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[0];
			vertices[i * 8 + 1] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[1];
			vertices[i * 8 + 2] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[2];
			vertices[i * 8 + 3] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[3];
			vertices[i * 8 + 4] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[4];
			vertices[i * 8 + 5] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[5];
			vertices[i * 8 + 6] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[6];
			vertices[i * 8 + 7] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES[7];
			uvs[i * 8] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[0];
			uvs[i * 8 + 1] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[1];
			uvs[i * 8 + 2] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[2];
			uvs[i * 8 + 3] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[3];
			uvs[i * 8 + 4] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[4];
			uvs[i * 8 + 5] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[5];
			uvs[i * 8 + 6] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[6];
			uvs[i * 8 + 7] = com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS[7];
			var index = i * 3;
			registerIndices[index * 4] = index;
			registerIndices[index * 4 + 1] = index + 1;
			registerIndices[index * 4 + 2] = index + 2;
			registerIndices[index * 4 + 3] = index;
			registerIndices[index * 4 + 4] = index + 1;
			registerIndices[index * 4 + 5] = index + 2;
			registerIndices[index * 4 + 6] = index;
			registerIndices[index * 4 + 7] = index + 1;
			registerIndices[index * 4 + 8] = index + 2;
			registerIndices[index * 4 + 9] = index;
			registerIndices[index * 4 + 10] = index + 1;
			registerIndices[index * 4 + 11] = index + 2;
			var index1 = i * 4;
			registerIndicesAlpha[index1 * 4] = index1;
			registerIndicesAlpha[index1 * 4 + 1] = index1 + 1;
			registerIndicesAlpha[index1 * 4 + 2] = index1 + 2;
			registerIndicesAlpha[index1 * 4 + 3] = index1 + 3;
			registerIndicesAlpha[index1 * 4 + 4] = index1;
			registerIndicesAlpha[index1 * 4 + 5] = index1 + 1;
			registerIndicesAlpha[index1 * 4 + 6] = index1 + 2;
			registerIndicesAlpha[index1 * 4 + 7] = index1 + 3;
			registerIndicesAlpha[index1 * 4 + 8] = index1;
			registerIndicesAlpha[index1 * 4 + 9] = index1 + 1;
			registerIndicesAlpha[index1 * 4 + 10] = index1 + 2;
			registerIndicesAlpha[index1 * 4 + 11] = index1 + 3;
			registerIndicesAlpha[index1 * 4 + 12] = index1;
			registerIndicesAlpha[index1 * 4 + 13] = index1 + 1;
			registerIndicesAlpha[index1 * 4 + 14] = index1 + 2;
			registerIndicesAlpha[index1 * 4 + 15] = index1 + 3;
		}
		this.g2d_geometryBuffer = this.g2d_nativeContext.createBuffer();
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_geometryBuffer);
		this.g2d_nativeContext.bufferData(34962,vertices,35040);
		this.g2d_uvBuffer = this.g2d_nativeContext.createBuffer();
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_uvBuffer);
		this.g2d_nativeContext.bufferData(34962,uvs,35040);
		this.g2d_constantIndexBuffer = this.g2d_nativeContext.createBuffer();
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_constantIndexBuffer);
		this.g2d_nativeContext.bufferData(34962,registerIndices,35040);
		this.g2d_constantIndexAlphaBuffer = this.g2d_nativeContext.createBuffer();
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_constantIndexAlphaBuffer);
		this.g2d_nativeContext.bufferData(34962,registerIndicesAlpha,35040);
		var indices = new Uint16Array(180);
		var _g1 = 0;
		while(_g1 < 30) {
			var i1 = _g1++;
			var ao = i1 * 6;
			var io = i1 * 4;
			indices[ao] = io;
			indices[ao + 1] = io + 1;
			indices[ao + 2] = io + 2;
			indices[ao + 3] = io;
			indices[ao + 4] = io + 2;
			indices[ao + 5] = io + 3;
		}
		this.g2d_indexBuffer = this.g2d_nativeContext.createBuffer();
		this.g2d_nativeContext.bindBuffer(34963,this.g2d_indexBuffer);
		this.g2d_nativeContext.bufferData(34963,indices,35044);
		this.g2d_program.samplerUniform = this.g2d_nativeContext.getUniformLocation(this.g2d_program,"sTexture");
		this.g2d_program.positionAttribute = this.g2d_nativeContext.getAttribLocation(this.g2d_program,"aPosition");
		this.g2d_nativeContext.enableVertexAttribArray(this.g2d_program.positionAttribute);
		this.g2d_program.texCoordAttribute = this.g2d_nativeContext.getAttribLocation(this.g2d_program,"aTexCoord");
		this.g2d_nativeContext.enableVertexAttribArray(this.g2d_program.texCoordAttribute);
		this.g2d_program.constantIndexAttribute = this.g2d_nativeContext.getAttribLocation(this.g2d_program,"aConstantIndex");
		this.g2d_nativeContext.enableVertexAttribArray(this.g2d_program.constantIndexAttribute);
		this.g2d_transforms = new Float32Array(480);
		this.g2d_initialized = true;
	}
	,bind: function(p_context,p_reinitialize) {
		if(!this.g2d_initialized || p_reinitialize) this.initialize(p_context);
		this.g2d_nativeContext.uniformMatrix4fv(this.g2d_nativeContext.getUniformLocation(this.g2d_program,"projectionMatrix"),false,this.g2d_context.g2d_projectionMatrix);
		this.g2d_nativeContext.bindBuffer(34963,this.g2d_indexBuffer);
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_geometryBuffer);
		this.g2d_nativeContext.vertexAttribPointer(this.g2d_program.positionAttribute,2,5126,false,0,0);
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_uvBuffer);
		this.g2d_nativeContext.vertexAttribPointer(this.g2d_program.texCoordAttribute,2,5126,false,0,0);
		this.g2d_nativeContext.bindBuffer(34962,this.g2d_constantIndexAlphaBuffer);
		this.g2d_nativeContext.vertexAttribPointer(this.g2d_program.constantIndexAttribute,4,5126,false,0,0);
	}
	,draw: function(p_x,p_y,p_scaleX,p_scaleY,p_rotation,p_red,p_green,p_blue,p_alpha,p_texture) {
		var notSameTexture = this.g2d_activeNativeTexture != p_texture.nativeTexture;
		var useAlpha = !this.g2d_useSeparatedAlphaPipeline && !(p_red == 1 && p_green == 1 && p_blue == 1 && p_alpha == 1);
		var notSameUseAlpha = this.g2d_activeAlpha != useAlpha;
		this.g2d_activeAlpha = useAlpha;
		if(notSameTexture) {
			if(this.g2d_activeNativeTexture != null) {
				if(this.g2d_quadCount > 0) {
					com.genome2d.context.stats.GStats.drawCalls++;
					this.g2d_nativeContext.uniform4fv(this.g2d_nativeContext.getUniformLocation(this.g2d_program,"transforms"),this.g2d_transforms);
					this.g2d_nativeContext.drawElements(4,6 * this.g2d_quadCount,5123,0);
					this.g2d_quadCount = 0;
				}
			}
			if(notSameTexture) {
				this.g2d_activeNativeTexture = p_texture.nativeTexture;
				this.g2d_nativeContext.activeTexture(33984);
				this.g2d_nativeContext.bindTexture(3553,p_texture.nativeTexture);
				this.g2d_nativeContext.uniform1i(this.g2d_program.samplerUniform,0);
			}
		}
		if(this.g2d_activeAlpha) {
			p_red *= p_alpha;
			p_green *= p_alpha;
			p_blue *= p_alpha;
		}
		var offset = this.g2d_quadCount * 4 << 2;
		this.g2d_transforms[offset] = p_x;
		this.g2d_transforms[offset + 1] = p_y;
		this.g2d_transforms[offset + 2] = p_rotation;
		this.g2d_transforms[offset + 3] = 0;
		this.g2d_transforms[offset + 4] = p_texture.uvX;
		this.g2d_transforms[offset + 5] = p_texture.uvY;
		this.g2d_transforms[offset + 6] = p_texture.uvScaleX;
		this.g2d_transforms[offset + 7] = p_texture.uvScaleY;
		this.g2d_transforms[offset + 8] = p_scaleX * (p_texture.g2d_region.width | 0);
		this.g2d_transforms[offset + 9] = p_scaleY * (p_texture.g2d_region.height | 0);
		this.g2d_transforms[offset + 10] = p_scaleX * p_texture.pivotX;
		this.g2d_transforms[offset + 11] = p_scaleY * p_texture.pivotY;
		this.g2d_transforms[offset + 12] = p_red;
		this.g2d_transforms[offset + 13] = p_green;
		this.g2d_transforms[offset + 14] = p_blue;
		this.g2d_transforms[offset + 15] = p_alpha;
		this.g2d_quadCount++;
		if(this.g2d_quadCount == 30) {
			if(this.g2d_quadCount > 0) {
				com.genome2d.context.stats.GStats.drawCalls++;
				this.g2d_nativeContext.uniform4fv(this.g2d_nativeContext.getUniformLocation(this.g2d_program,"transforms"),this.g2d_transforms);
				this.g2d_nativeContext.drawElements(4,6 * this.g2d_quadCount,5123,0);
				this.g2d_quadCount = 0;
			}
		}
	}
	,push: function() {
		if(this.g2d_quadCount > 0) {
			com.genome2d.context.stats.GStats.drawCalls++;
			this.g2d_nativeContext.uniform4fv(this.g2d_nativeContext.getUniformLocation(this.g2d_program,"transforms"),this.g2d_transforms);
			this.g2d_nativeContext.drawElements(4,6 * this.g2d_quadCount,5123,0);
			this.g2d_quadCount = 0;
		}
	}
	,clear: function() {
		this.g2d_activeNativeTexture = null;
	}
	,__class__: com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer
};
com.genome2d.context.webgl.renderers.GRendererCommon = function() { };
$hxClasses["com.genome2d.context.webgl.renderers.GRendererCommon"] = com.genome2d.context.webgl.renderers.GRendererCommon;
com.genome2d.context.webgl.renderers.GRendererCommon.__name__ = ["com","genome2d","context","webgl","renderers","GRendererCommon"];
com.genome2d.context.webgl.renderers.GRendererCommon.init = function() {
	com.genome2d.context.webgl.renderers.GRendererCommon.DEFAULT_CONSTANTS = [1,0,0,.5];
	com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_VERTICES = [-.5,.5,-.5,-.5,.5,-.5,.5,.5];
	com.genome2d.context.webgl.renderers.GRendererCommon.NORMALIZED_UVS = [.0,1.0,.0,.0,1.0,.0,1.0,1.0];
};
com.genome2d.error = {};
com.genome2d.error.GError = function(p_message) {
	if(p_message == null) p_message = "Unspecified error.";
	throw p_message;
};
$hxClasses["com.genome2d.error.GError"] = com.genome2d.error.GError;
com.genome2d.error.GError.__name__ = ["com","genome2d","error","GError"];
com.genome2d.error.GError.prototype = {
	__class__: com.genome2d.error.GError
};
com.genome2d.geom = {};
com.genome2d.geom.GMatrix = function(p_a,p_b,p_c,p_d,p_tx,p_ty) {
	if(p_ty == null) p_ty = 0;
	if(p_tx == null) p_tx = 0;
	if(p_d == null) p_d = 1;
	if(p_c == null) p_c = 0;
	if(p_b == null) p_b = 0;
	if(p_a == null) p_a = 1;
	this.a = p_a;
	this.b = p_b;
	this.c = p_c;
	this.d = p_d;
	this.tx = p_tx;
	this.ty = p_ty;
};
$hxClasses["com.genome2d.geom.GMatrix"] = com.genome2d.geom.GMatrix;
com.genome2d.geom.GMatrix.__name__ = ["com","genome2d","geom","GMatrix"];
com.genome2d.geom.GMatrix.prototype = {
	copyFrom: function(p_from) {
		this.a = p_from.a;
		this.b = p_from.b;
		this.c = p_from.c;
		this.d = p_from.d;
		this.tx = p_from.tx;
		this.ty = p_from.ty;
	}
	,setTo: function(p_a,p_b,p_c,p_d,p_tx,p_ty) {
		this.a = p_a;
		this.b = p_b;
		this.c = p_c;
		this.d = p_d;
		this.tx = p_tx;
		this.ty = p_ty;
	}
	,identity: function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
	}
	,concat: function(p_matrix) {
		var a1 = this.a * p_matrix.a + this.b * p_matrix.c;
		this.b = this.a * p_matrix.b + this.b * p_matrix.d;
		this.a = a1;
		var c1 = this.c * p_matrix.a + this.d * p_matrix.c;
		this.d = this.c * p_matrix.b + this.d * p_matrix.d;
		this.c = c1;
		var tx1 = this.tx * p_matrix.a + this.ty * p_matrix.c + p_matrix.tx;
		this.ty = this.tx * p_matrix.b + this.ty * p_matrix.d + p_matrix.ty;
		this.tx = tx1;
	}
	,invert: function() {
		var n = this.a * this.d - this.b * this.c;
		if(n == 0) {
			this.a = this.b = this.c = this.d = 0;
			this.tx = -this.tx;
			this.ty = -this.ty;
		} else {
			n = 1 / n;
			var a1 = this.d * n;
			this.d = this.a * n;
			this.a = a1;
			this.b *= -n;
			this.c *= -n;
			var tx1 = -this.a * this.tx - this.c * this.ty;
			this.ty = -this.b * this.tx - this.d * this.ty;
			this.tx = tx1;
		}
		return this;
	}
	,__class__: com.genome2d.geom.GMatrix
};
com.genome2d.geom.GMatrix3D = function() {
};
$hxClasses["com.genome2d.geom.GMatrix3D"] = com.genome2d.geom.GMatrix3D;
com.genome2d.geom.GMatrix3D.__name__ = ["com","genome2d","geom","GMatrix3D"];
com.genome2d.geom.GMatrix3D.prototype = {
	identity: function() {
	}
	,prependTranslation: function(p_x,p_y,p_z) {
	}
	,__class__: com.genome2d.geom.GMatrix3D
};
com.genome2d.geom.GMatrixUtils = function() { };
$hxClasses["com.genome2d.geom.GMatrixUtils"] = com.genome2d.geom.GMatrixUtils;
com.genome2d.geom.GMatrixUtils.__name__ = ["com","genome2d","geom","GMatrixUtils"];
com.genome2d.geom.GMatrixUtils.prependMatrix = function(p_matrix,p_by) {
	p_matrix.setTo(p_matrix.a * p_by.a + p_matrix.c * p_by.b,p_matrix.b * p_by.a + p_matrix.d * p_by.b,p_matrix.a * p_by.c + p_matrix.c * p_by.d,p_matrix.b * p_by.c + p_matrix.d * p_by.d,p_matrix.tx + p_matrix.a * p_by.tx + p_matrix.c * p_by.ty,p_matrix.ty + p_matrix.b * p_by.tx + p_matrix.d * p_by.ty);
};
com.genome2d.geom.GPoint = function(p_x,p_y) {
	if(p_y == null) p_y = 0;
	if(p_x == null) p_x = 0;
	this.x = p_x;
	this.y = p_y;
};
$hxClasses["com.genome2d.geom.GPoint"] = com.genome2d.geom.GPoint;
com.genome2d.geom.GPoint.__name__ = ["com","genome2d","geom","GPoint"];
com.genome2d.geom.GPoint.prototype = {
	__class__: com.genome2d.geom.GPoint
};
com.genome2d.geom.GRectangle = function(p_x,p_y,p_width,p_height) {
	if(p_height == null) p_height = 0;
	if(p_width == null) p_width = 0;
	if(p_y == null) p_y = 0;
	if(p_x == null) p_x = 0;
	this.x = p_x;
	this.y = p_y;
	this.width = p_width;
	this.height = p_height;
};
$hxClasses["com.genome2d.geom.GRectangle"] = com.genome2d.geom.GRectangle;
com.genome2d.geom.GRectangle.__name__ = ["com","genome2d","geom","GRectangle"];
com.genome2d.geom.GRectangle.prototype = {
	get_bottom: function() {
		return this.y + this.height;
	}
	,set_bottom: function(p_value) {
		this.height = p_value - this.y;
		return p_value;
	}
	,get_left: function() {
		return this.x;
	}
	,set_left: function(p_value) {
		this.width -= p_value - this.x;
		this.x = p_value;
		return p_value;
	}
	,get_right: function() {
		return this.x + this.width;
	}
	,set_right: function(p_value) {
		this.width = p_value - this.x;
		return p_value;
	}
	,get_top: function() {
		return this.y;
	}
	,set_top: function(p_value) {
		this.height -= p_value - this.y;
		this.y = p_value;
		return p_value;
	}
	,setTo: function(p_x,p_y,p_width,p_height) {
		this.x = p_x;
		this.y = p_y;
		this.width = p_width;
		this.height = p_height;
	}
	,clone: function() {
		return new com.genome2d.geom.GRectangle(this.x,this.y,this.width,this.height);
	}
	,intersection: function(p_rect) {
		var result;
		var x0;
		if(this.x < p_rect.x) x0 = p_rect.x; else x0 = this.x;
		var x1;
		if(this.get_right() > p_rect.get_right()) x1 = p_rect.get_right(); else x1 = this.get_right();
		if(x1 <= x0) result = new com.genome2d.geom.GRectangle(); else {
			var y0;
			if(this.y < p_rect.y) y0 = p_rect.y; else y0 = this.y;
			var y1;
			if(this.get_bottom() > p_rect.get_bottom()) y1 = p_rect.get_bottom(); else y1 = this.get_bottom();
			if(y1 <= y0) result = new com.genome2d.geom.GRectangle(); else result = new com.genome2d.geom.GRectangle(x0,y0,x1 - x0,y1 - y0);
		}
		return result;
	}
	,contains: function(p_x,p_y) {
		return p_x >= this.x && p_y >= this.y && p_x < this.get_right() && p_y < this.get_bottom();
	}
	,__class__: com.genome2d.geom.GRectangle
	,__properties__: {set_top:"set_top",get_top:"get_top",set_right:"set_right",get_right:"get_right",set_left:"set_left",get_left:"get_left",set_bottom:"set_bottom",get_bottom:"get_bottom"}
};
com.genome2d.macros = {};
com.genome2d.macros.GComponentMacro = function() { };
$hxClasses["com.genome2d.macros.GComponentMacro"] = com.genome2d.macros.GComponentMacro;
com.genome2d.macros.GComponentMacro.__name__ = ["com","genome2d","macros","GComponentMacro"];
com.genome2d.node = {};
com.genome2d.node.GNode = function(p_name) {
	if(p_name == null) p_name = "";
	this.g2d_numChildren = 0;
	this.g2d_numComponents = 0;
	this.mouseEnabled = false;
	this.mouseChildren = true;
	this.g2d_disposed = false;
	this.g2d_active = true;
	this.g2d_usedAsMask = 0;
	this.cameraGroup = 0;
	this.g2d_id = com.genome2d.node.GNode.g2d_nodeCount++;
	if(p_name == "") this.name = "GNode#" + this.g2d_id; else this.name = p_name;
	if(com.genome2d.node.GNode.g2d_cachedMatrix == null) {
		com.genome2d.node.GNode.g2d_cachedMatrix = new com.genome2d.geom.GMatrix();
		com.genome2d.node.GNode.g2d_activeMasks = new Array();
	}
	this.g2d_transform = this.addComponent(com.genome2d.components.GTransform);
};
$hxClasses["com.genome2d.node.GNode"] = com.genome2d.node.GNode;
com.genome2d.node.GNode.__name__ = ["com","genome2d","node","GNode"];
com.genome2d.node.GNode.prototype = {
	get_core: function() {
		if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
		return com.genome2d.node.GNode.g2d_core;
	}
	,get_mask: function() {
		return this.g2d_mask;
	}
	,set_mask: function(p_value) {
		if(!((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).getContext().hasFeature(1)) new com.genome2d.error.GError("Stencil masking feature not supported.");
		if(this.g2d_mask != null) this.g2d_mask.g2d_usedAsMask--;
		this.g2d_mask = p_value;
		this.g2d_mask.g2d_usedAsMask++;
		return this.g2d_mask;
	}
	,get_userData: function() {
		if(this.g2d_userData == null) this.g2d_userData = new haxe.ds.StringMap();
		return this.g2d_userData;
	}
	,isActive: function() {
		return this.g2d_active;
	}
	,setActive: function(p_value) {
		if(p_value != this.g2d_active) {
			if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
			this.g2d_active = p_value;
			this.g2d_transform.setActive(this.g2d_active);
			if(this.g2d_pool != null) {
				if(p_value) this.g2d_pool.g2d_putToBack(this); else this.g2d_pool.g2d_putToFront(this);
			}
			var _g1 = 0;
			var _g = this.g2d_numComponents;
			while(_g1 < _g) {
				var i = _g1++;
				this.g2d_components[i].setActive(p_value);
			}
			var child = this.g2d_firstChild;
			while(child != null) {
				var next = child.g2d_nextNode;
				child.setActive(p_value);
				child = next;
			}
		}
	}
	,get_id: function() {
		return this.g2d_id;
	}
	,get_transform: function() {
		return this.g2d_transform;
	}
	,get_parent: function() {
		return this.g2d_parent;
	}
	,isDisposed: function() {
		return this.g2d_disposed;
	}
	,render: function(p_parentTransformUpdate,p_parentColorUpdate,p_camera,p_renderAsMask,p_useMatrix) {
		if(this.g2d_active) {
			var context = ((function($this) {
				var $r;
				if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
				$r = com.genome2d.node.GNode.g2d_core;
				return $r;
			}(this))).getContext();
			var previousMaskRect = null;
			var hasMask = false;
			if(this.maskRect != null && this.maskRect != this.g2d_parent.maskRect) {
				hasMask = true;
				if(context.getMaskRect() == null) previousMaskRect = null; else previousMaskRect = context.getMaskRect().clone();
				if(this.g2d_parent.maskRect != null) {
					var intersection = this.g2d_parent.maskRect.intersection(this.maskRect);
					context.setMaskRect(intersection);
				} else context.setMaskRect(this.maskRect);
			}
			var invalidateTransform = p_parentTransformUpdate || this.g2d_transform.g2d_transformDirty;
			var invalidateColor = p_parentColorUpdate || this.g2d_transform.g2d_colorDirty;
			if(invalidateTransform || invalidateColor) this.g2d_transform.invalidate(p_parentTransformUpdate,p_parentColorUpdate);
			if(!this.g2d_active || !this.g2d_transform.visible || (this.cameraGroup & p_camera.mask) == 0 && this.cameraGroup != 0 || this.g2d_usedAsMask > 0 && !p_renderAsMask) return;
			if(!p_renderAsMask && this.g2d_mask != null) {
				context.renderToStencil(com.genome2d.node.GNode.g2d_activeMasks.length);
				this.g2d_mask.render(true,false,p_camera,true,false);
				com.genome2d.node.GNode.g2d_activeMasks.push(this.g2d_mask);
				context.renderToColor(com.genome2d.node.GNode.g2d_activeMasks.length);
			}
			var useMatrix = p_useMatrix || this.g2d_transform.g2d_localUseMatrix > 0;
			if(useMatrix) {
				if(((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixArray.length <= ((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex) ((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixArray[((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex] = new com.genome2d.geom.GMatrix();
				((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixArray[((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex].copyFrom(((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrix);
				com.genome2d.geom.GMatrixUtils.prependMatrix(((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrix,this.g2d_transform.get_matrix());
				((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex++;
			}
			if(this.g2d_renderable != null) this.g2d_renderable.render(p_camera,useMatrix);
			var child = this.g2d_firstChild;
			while(child != null) {
				var next = child.g2d_nextNode;
				if(child.postProcess != null) child.postProcess.render(invalidateTransform,invalidateColor,p_camera,child); else child.render(invalidateTransform,invalidateColor,p_camera,p_renderAsMask,useMatrix);
				child = next;
			}
			if(hasMask) context.setMaskRect(previousMaskRect);
			if(!p_renderAsMask && this.g2d_mask != null) {
				com.genome2d.node.GNode.g2d_activeMasks.pop();
				if(com.genome2d.node.GNode.g2d_activeMasks.length == 0) context.clearStencil();
				context.renderToColor(com.genome2d.node.GNode.g2d_activeMasks.length);
			}
			if(useMatrix) {
				((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex--;
				((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrix.copyFrom(((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixArray[((function($this) {
					var $r;
					if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
					$r = com.genome2d.node.GNode.g2d_core;
					return $r;
				}(this))).g2d_renderMatrixIndex]);
			}
		}
	}
	,dispose: function() {
		if(this.g2d_disposed) return;
		this.disposeChildren();
		while(this.g2d_numComponents > 0) {
			this.g2d_components.pop().g2d_dispose();
			this.g2d_numComponents--;
		}
		this.g2d_transform = null;
		this.g2d_renderable = null;
		if(this.g2d_parent != null) this.g2d_parent.removeChild(this);
		if(this.g2d_onAddedToStage != null) {
			this.g2d_onAddedToStage.removeAll();
			this.g2d_onAddedToStage = null;
		}
		if(this.g2d_onRemovedFromStage != null) {
			this.g2d_onRemovedFromStage.removeAll();
			this.g2d_onRemovedFromStage = null;
		}
		if(this.g2d_onMouseClick != null) {
			this.g2d_onMouseClick.removeAll();
			this.g2d_onMouseClick = null;
		}
		if(this.g2d_onMouseDown != null) {
			this.g2d_onMouseDown.removeAll();
			this.g2d_onMouseDown = null;
		}
		if(this.g2d_onMouseMove != null) {
			this.g2d_onMouseMove.removeAll();
			this.g2d_onMouseMove = null;
		}
		if(this.g2d_onMouseOut != null) {
			this.g2d_onMouseOut.removeAll();
			this.g2d_onMouseOut = null;
		}
		if(this.g2d_onMouseOver != null) {
			this.g2d_onMouseOver.removeAll();
			this.g2d_onMouseOver = null;
		}
		if(this.g2d_onMouseUp != null) {
			this.g2d_onMouseUp.removeAll();
			this.g2d_onMouseUp = null;
		}
		if(this.g2d_onRightMouseClick != null) {
			this.g2d_onRightMouseClick.removeAll();
			this.g2d_onRightMouseClick = null;
		}
		if(this.g2d_onRightMouseDown != null) {
			this.g2d_onRightMouseDown.removeAll();
			this.g2d_onRightMouseDown = null;
		}
		if(this.g2d_onRightMouseUp != null) {
			this.g2d_onRightMouseUp.removeAll();
			this.g2d_onRightMouseUp = null;
		}
		this.g2d_disposed = true;
	}
	,getPrototype: function() {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		var prototypeXml = Xml.parse("<node/>").firstElement();
		prototypeXml.set("name",this.name);
		prototypeXml.set("mouseEnabled",Std.string(this.mouseEnabled));
		prototypeXml.set("mouseChildren",Std.string(this.mouseChildren));
		var componentsXml = Xml.parse("<components/>").firstElement();
		var _g1 = 0;
		var _g = this.g2d_numComponents;
		while(_g1 < _g) {
			var i = _g1++;
			componentsXml.addChild(this.g2d_components[i].getPrototype());
		}
		prototypeXml.addChild(componentsXml);
		var childrenXml = Xml.parse("<children/>").firstElement();
		var child = this.g2d_firstChild;
		while(child != null) {
			var next = child.g2d_nextNode;
			childrenXml.addChild(child.getPrototype());
			child = next;
		}
		prototypeXml.addChild(childrenXml);
		return prototypeXml;
	}
	,get_onMouseDown: function() {
		if(this.g2d_onMouseDown == null) this.g2d_onMouseDown = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseDown;
	}
	,get_onMouseMove: function() {
		if(this.g2d_onMouseMove == null) this.g2d_onMouseMove = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseMove;
	}
	,get_onMouseClick: function() {
		if(this.g2d_onMouseClick == null) this.g2d_onMouseClick = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseClick;
	}
	,get_onMouseUp: function() {
		if(this.g2d_onMouseUp == null) this.g2d_onMouseUp = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseUp;
	}
	,get_onMouseOver: function() {
		if(this.g2d_onMouseOver == null) this.g2d_onMouseOver = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseOver;
	}
	,get_onMouseOut: function() {
		if(this.g2d_onMouseOut == null) this.g2d_onMouseOut = new msignal.Signal1(com.genome2d.signals.GMouseSignal);
		return this.g2d_onMouseOut;
	}
	,processContextMouseSignal: function(p_captured,p_cameraX,p_cameraY,p_signal,p_camera) {
		if(!this.g2d_active || !this.g2d_transform.visible || p_camera != null && (this.cameraGroup & p_camera.mask) == 0 && this.cameraGroup != 0) return false;
		if(this.mouseChildren) {
			var child = this.g2d_lastChild;
			while(child != null) {
				var previous = child.g2d_previousNode;
				p_captured = child.processContextMouseSignal(p_captured,p_cameraX,p_cameraY,p_signal,p_camera) || p_captured;
				child = previous;
			}
		}
		if(this.mouseEnabled) {
			var _g1 = 0;
			var _g = this.g2d_numComponents;
			while(_g1 < _g) {
				var i = _g1++;
				p_captured = this.g2d_components[i].processContextMouseSignal(p_captured,p_cameraX,p_cameraY,p_signal) || p_captured;
			}
		}
		return p_captured;
	}
	,dispatchNodeMouseSignal: function(p_type,p_object,p_localX,p_localY,p_contextSignal) {
		if(this.mouseEnabled) {
			var mouseSignal = new com.genome2d.signals.GNodeMouseSignal(p_type,this,p_object,p_localX,p_localY,p_contextSignal);
			switch(p_type) {
			case "mouseDown":
				this.g2d_mouseDownNode = p_object;
				if(this.g2d_onMouseDown != null) this.g2d_onMouseDown.dispatch(mouseSignal);
				break;
			case "mouseMove":
				if(this.g2d_onMouseMove != null) this.g2d_onMouseMove.dispatch(mouseSignal);
				break;
			case "mouseUp":
				if(this.g2d_mouseDownNode == p_object && this.g2d_onMouseClick != null) {
					var mouseClickSignal = new com.genome2d.signals.GNodeMouseSignal("mouseUp",this,p_object,p_localX,p_localY,p_contextSignal);
					this.g2d_onMouseClick.dispatch(mouseClickSignal);
				}
				this.g2d_mouseDownNode = null;
				if(this.g2d_onMouseUp != null) this.g2d_onMouseUp.dispatch(mouseSignal);
				break;
			case "mouseOver":
				this.g2d_mouseOverNode = p_object;
				if(this.g2d_onMouseOver != null) this.g2d_onMouseOver.dispatch(mouseSignal);
				break;
			case "mouseOut":
				this.g2d_mouseOverNode = null;
				if(this.g2d_onMouseOut != null) this.g2d_onMouseOut.dispatch(mouseSignal);
				break;
			}
		}
		if(this.g2d_parent != null) this.g2d_parent.dispatchNodeMouseSignal(p_type,p_object,p_localX,p_localY,p_contextSignal);
	}
	,getComponent: function(p_componentLookupClass) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		var _g1 = 0;
		var _g = this.g2d_numComponents;
		while(_g1 < _g) {
			var i = _g1++;
			var component = this.g2d_components[i];
			if(component.g2d_lookupClass == p_componentLookupClass) return component;
		}
		return null;
	}
	,getComponents: function() {
		return this.g2d_components;
	}
	,hasComponent: function(p_componentLookupClass) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		return this.getComponent(p_componentLookupClass) != null;
	}
	,addComponent: function(p_componentClass,p_componentLookupClass) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		if(p_componentLookupClass == null) p_componentLookupClass = p_componentClass;
		var lookup = this.getComponent(p_componentLookupClass);
		if(lookup != null) return lookup;
		var component = Type.createInstance(p_componentClass,[]);
		if(component == null) new com.genome2d.error.GError("Invalid component.");
		component.g2d_node = this;
		component.g2d_lookupClass = p_componentLookupClass;
		if(js.Boot.__instanceof(component,com.genome2d.components.renderables.IRenderable)) this.g2d_renderable = component;
		if(this.g2d_components == null) this.g2d_components = new Array();
		this.g2d_components.push(component);
		this.g2d_numComponents++;
		component.init();
		return component;
	}
	,addComponentPrototype: function(p_prototype) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		var componentClass = Type.resolveClass(p_prototype.get("componentClass"));
		if(componentClass == null) new com.genome2d.error.GError("Non existing componentClass " + p_prototype.get("componentClass"));
		var componentLookupClass = Type.resolveClass(p_prototype.get("componentLookupClass"));
		if(componentLookupClass == null) new com.genome2d.error.GError("Non existing componentLookupClass " + p_prototype.get("componentLookupClass"));
		var component = this.addComponent(componentClass,componentLookupClass);
		component.initPrototype(p_prototype);
		return component;
	}
	,removeComponent: function(p_componentLookupClass) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		var component = this.getComponent(p_componentLookupClass);
		if(component == null || component == this.g2d_transform) return;
		HxOverrides.remove(this.g2d_components,component);
		this.g2d_numComponents--;
		if(js.Boot.__instanceof(component,com.genome2d.components.renderables.IRenderable)) this.g2d_renderable = component;
		component.g2d_dispose();
	}
	,get_firstChild: function() {
		return this.g2d_firstChild;
	}
	,get_nextNode: function() {
		return this.g2d_nextNode;
	}
	,get_numChildren: function() {
		return this.g2d_numChildren;
	}
	,get_onAddedToStage: function() {
		if(this.g2d_onAddedToStage == null) this.g2d_onAddedToStage = new msignal.Signal0();
		return this.g2d_onAddedToStage;
	}
	,get_onRemovedFromStage: function() {
		if(this.g2d_onRemovedFromStage == null) this.g2d_onRemovedFromStage = new msignal.Signal0();
		return this.g2d_onRemovedFromStage;
	}
	,addChild: function(p_child,p_before) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		if(p_child == this) new com.genome2d.error.GError("Can't add child to itself.");
		if(p_child.g2d_parent != null) p_child.g2d_parent.removeChild(p_child);
		p_child.g2d_parent = this;
		if(this.g2d_firstChild == null) {
			this.g2d_firstChild = p_child;
			this.g2d_lastChild = p_child;
		} else if(p_before == null) {
			this.g2d_lastChild.g2d_nextNode = p_child;
			p_child.g2d_previousNode = this.g2d_lastChild;
			this.g2d_lastChild = p_child;
		} else {
			if(p_before != this.g2d_firstChild) p_before.g2d_previousNode.g2d_nextNode = p_child; else this.g2d_firstChild = p_child;
			p_child.g2d_previousNode = p_before.g2d_previousNode;
			p_child.g2d_nextNode = p_before;
			p_before.g2d_previousNode = p_child;
		}
		this.g2d_numChildren++;
		if(this.g2d_numChildren == 1 && this.g2d_transform.hasUniformRotation()) {
			var _g = this.g2d_transform;
			var _g1 = _g.g2d_localUseMatrix;
			_g.set_g2d_useMatrix(_g1 + 1);
			_g1;
		}
		if(this.isOnStage()) p_child.g2d_addedToStage();
	}
	,addChildAt: function(p_child,p_index) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		if(p_child == this) new com.genome2d.error.GError("Can't add child to itself.");
		if(p_child.g2d_parent != null) p_child.g2d_parent.removeChild(p_child);
		p_child.g2d_parent = this;
		var i = 0;
		var after = this.g2d_firstChild;
		while(i < p_index && after != null) {
			after = after.g2d_nextNode;
			i++;
		}
		this.addChild(p_child,after == null?null:after.g2d_nextNode);
	}
	,getChildAt: function(p_index) {
		if(p_index >= this.g2d_numChildren) new com.genome2d.error.GError("Index out of bounds.");
		var child = this.g2d_firstChild;
		var _g = 0;
		while(_g < p_index) {
			var i = _g++;
			child = child.g2d_nextNode;
		}
		return child;
	}
	,getChildIndex: function(p_child) {
		if(p_child.g2d_parent != this) return -1;
		var child = this.g2d_firstChild;
		var _g1 = 0;
		var _g = this.g2d_numChildren;
		while(_g1 < _g) {
			var i = _g1++;
			if(child == p_child) return i;
			child = child.g2d_nextNode;
		}
		return -1;
	}
	,setChildIndex: function(p_child,p_index) {
		if(p_child.g2d_parent != this) new com.genome2d.error.GError("Not a child of this node.");
		if(p_index >= this.g2d_numChildren) new com.genome2d.error.GError("Index out of bounds.");
		var index = 0;
		var child = this.g2d_firstChild;
		while(child != null && index < p_index) {
			child = child.g2d_nextNode;
			index++;
		}
		if(index == p_index && child != p_child) {
			if(p_child != this.g2d_lastChild) p_child.g2d_nextNode.g2d_previousNode = p_child.g2d_previousNode; else this.g2d_lastChild = p_child.g2d_previousNode;
			if(p_child != this.g2d_firstChild) p_child.g2d_previousNode.g2d_nextNode = p_child.g2d_nextNode; else this.g2d_firstChild = p_child.g2d_nextNode;
			if(child != this.g2d_firstChild) child.g2d_previousNode.g2d_nextNode = p_child; else this.g2d_firstChild = p_child;
			p_child.g2d_previousNode = child.g2d_previousNode;
			p_child.g2d_nextNode = child;
			child.g2d_previousNode = p_child;
		}
	}
	,swapChildrenAt: function(p_index1,p_index2) {
		this.swapChildren(this.getChildAt(p_index1),this.getChildAt(p_index2));
	}
	,swapChildren: function(p_child1,p_child2) {
		if(p_child1.g2d_parent != this || p_child2.g2d_parent != this) return;
		var temp = p_child1.g2d_nextNode;
		if(p_child2.g2d_nextNode == p_child1) p_child1.g2d_nextNode = p_child2; else {
			p_child1.g2d_nextNode = p_child2.g2d_nextNode;
			if(p_child1.g2d_nextNode != null) p_child1.g2d_nextNode.g2d_previousNode = p_child1;
		}
		if(temp == p_child2) p_child2.g2d_nextNode = p_child1; else {
			p_child2.g2d_nextNode = temp;
			if(p_child2.g2d_nextNode != null) p_child2.g2d_nextNode.g2d_previousNode = p_child2;
		}
		temp = p_child1.g2d_previousNode;
		if(p_child2.g2d_previousNode == p_child1) p_child1.g2d_previousNode = p_child2; else {
			p_child1.g2d_previousNode = p_child2.g2d_previousNode;
			if(p_child1.g2d_previousNode != null) p_child1.g2d_previousNode.g2d_nextNode = p_child1;
		}
		if(temp == p_child2) p_child2.g2d_previousNode = p_child1; else {
			p_child2.g2d_previousNode = temp;
			if(p_child2.g2d_previousNode != null) p_child2.g2d_previousNode.g2d_nextNode = p_child2;
		}
		if(p_child1 == this.g2d_firstChild) this.g2d_firstChild = p_child2; else if(p_child2 == this.g2d_firstChild) this.g2d_firstChild = p_child1;
		if(p_child1 == this.g2d_lastChild) this.g2d_lastChild = p_child2; else if(p_child2 == this.g2d_lastChild) this.g2d_lastChild = p_child1;
	}
	,putChildToFront: function(p_child) {
		if(p_child.g2d_parent != this || p_child == this.g2d_lastChild) return;
		if(p_child.g2d_nextNode != null) p_child.g2d_nextNode.g2d_previousNode = p_child.g2d_previousNode;
		if(p_child.g2d_previousNode != null) p_child.g2d_previousNode.g2d_nextNode = p_child.g2d_nextNode;
		if(p_child == this.g2d_firstChild) this.g2d_firstChild = this.g2d_firstChild.g2d_nextNode;
		if(this.g2d_lastChild != null) this.g2d_lastChild.g2d_nextNode = p_child;
		p_child.g2d_previousNode = this.g2d_lastChild;
		p_child.g2d_nextNode = null;
		this.g2d_lastChild = p_child;
	}
	,putChildToBack: function(p_child) {
		if(p_child.g2d_parent != this || p_child == this.g2d_firstChild) return;
		if(p_child.g2d_nextNode != null) p_child.g2d_nextNode.g2d_previousNode = p_child.g2d_previousNode;
		if(p_child.g2d_previousNode != null) p_child.g2d_previousNode.g2d_nextNode = p_child.g2d_nextNode;
		if(p_child == this.g2d_lastChild) this.g2d_lastChild = this.g2d_lastChild.g2d_previousNode;
		if(this.g2d_firstChild != null) this.g2d_firstChild.g2d_previousNode = p_child;
		p_child.g2d_previousNode = null;
		p_child.g2d_nextNode = this.g2d_firstChild;
		this.g2d_firstChild = p_child;
	}
	,removeChild: function(p_child) {
		if(this.g2d_disposed) new com.genome2d.error.GError("Node already disposed.");
		if(p_child.g2d_parent != this) return;
		if(p_child.g2d_previousNode != null) p_child.g2d_previousNode.g2d_nextNode = p_child.g2d_nextNode; else this.g2d_firstChild = this.g2d_firstChild.g2d_nextNode;
		if(p_child.g2d_nextNode != null) p_child.g2d_nextNode.g2d_previousNode = p_child.g2d_previousNode; else this.g2d_lastChild = this.g2d_lastChild.g2d_previousNode;
		p_child.g2d_nextNode = p_child.g2d_previousNode = p_child.g2d_parent = null;
		this.g2d_numChildren--;
		if(this.g2d_numChildren == 0 && this.g2d_transform.hasUniformRotation()) {
			var _g = this.g2d_transform;
			var _g1 = _g.g2d_localUseMatrix;
			_g.set_g2d_useMatrix(_g1 - 1);
			_g1;
		}
		if(this.isOnStage()) p_child.g2d_removedFromStage();
	}
	,removeChildAt: function(p_index) {
		if(p_index >= this.g2d_numChildren) new com.genome2d.error.GError("Index out of bounds.");
		var index = 0;
		var child = this.g2d_firstChild;
		while(child != null && index < p_index) {
			child = child.g2d_nextNode;
			index++;
		}
		this.removeChild(child);
	}
	,disposeChildren: function() {
		while(this.g2d_firstChild != null) this.g2d_firstChild.dispose();
	}
	,g2d_addedToStage: function() {
		if(this.g2d_onAddedToStage != null) this.g2d_onAddedToStage.dispatch();
		com.genome2d.context.stats.GStats.nodeCount++;
		var child = this.g2d_firstChild;
		while(child != null) {
			var next = child.g2d_nextNode;
			child.g2d_addedToStage();
			child = next;
		}
	}
	,g2d_removedFromStage: function() {
		if(this.g2d_onRemovedFromStage != null) this.g2d_onRemovedFromStage.dispatch();
		com.genome2d.context.stats.GStats.nodeCount--;
		var child = this.g2d_firstChild;
		while(child != null) {
			var next = child.g2d_nextNode;
			child.g2d_removedFromStage();
			child = next;
		}
	}
	,isOnStage: function() {
		if(this == ((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root()) return true; else if(this.g2d_parent == null) return false; else return this.g2d_parent.isOnStage();
	}
	,getBounds: function(p_targetSpace,p_bounds) {
		if(p_targetSpace == null) p_targetSpace = ((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_root();
		if(p_bounds == null) p_bounds = new com.genome2d.geom.GRectangle();
		var found = false;
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;
		var aabb = new com.genome2d.geom.GRectangle(0,0,0,0);
		if(this.g2d_renderable != null) {
			this.g2d_renderable.getBounds(aabb);
			if(aabb.width != 0 && aabb.height != 0) {
				var m = this.g2d_transform.getTransformationMatrix(p_targetSpace,com.genome2d.node.GNode.g2d_cachedMatrix);
				var tx1 = com.genome2d.node.GNode.g2d_cachedMatrix.a * aabb.x + com.genome2d.node.GNode.g2d_cachedMatrix.c * aabb.y + com.genome2d.node.GNode.g2d_cachedMatrix.tx;
				var ty1 = com.genome2d.node.GNode.g2d_cachedMatrix.d * aabb.y + com.genome2d.node.GNode.g2d_cachedMatrix.b * aabb.x + com.genome2d.node.GNode.g2d_cachedMatrix.ty;
				var tx2 = com.genome2d.node.GNode.g2d_cachedMatrix.a * aabb.x + com.genome2d.node.GNode.g2d_cachedMatrix.c * aabb.get_bottom() + com.genome2d.node.GNode.g2d_cachedMatrix.tx;
				var ty2 = com.genome2d.node.GNode.g2d_cachedMatrix.d * aabb.get_bottom() + com.genome2d.node.GNode.g2d_cachedMatrix.b * aabb.x + com.genome2d.node.GNode.g2d_cachedMatrix.ty;
				var tx3 = com.genome2d.node.GNode.g2d_cachedMatrix.a * aabb.get_right() + com.genome2d.node.GNode.g2d_cachedMatrix.c * aabb.y + com.genome2d.node.GNode.g2d_cachedMatrix.tx;
				var ty3 = com.genome2d.node.GNode.g2d_cachedMatrix.d * aabb.y + com.genome2d.node.GNode.g2d_cachedMatrix.b * aabb.get_right() + com.genome2d.node.GNode.g2d_cachedMatrix.ty;
				var tx4 = com.genome2d.node.GNode.g2d_cachedMatrix.a * aabb.get_right() + com.genome2d.node.GNode.g2d_cachedMatrix.c * aabb.get_bottom() + com.genome2d.node.GNode.g2d_cachedMatrix.tx;
				var ty4 = com.genome2d.node.GNode.g2d_cachedMatrix.d * aabb.get_bottom() + com.genome2d.node.GNode.g2d_cachedMatrix.b * aabb.get_right() + com.genome2d.node.GNode.g2d_cachedMatrix.ty;
				if(minX > tx1) minX = tx1;
				if(minX > tx2) minX = tx2;
				if(minX > tx3) minX = tx3;
				if(minX > tx4) minX = tx4;
				if(minY > ty1) minY = ty1;
				if(minY > ty2) minY = ty2;
				if(minY > ty3) minY = ty3;
				if(minY > ty4) minY = ty4;
				if(maxX < tx1) maxX = tx1;
				if(maxX < tx2) maxX = tx2;
				if(maxX < tx3) maxX = tx3;
				if(maxX < tx4) maxX = tx4;
				if(maxY < ty1) maxY = ty1;
				if(maxY < ty2) maxY = ty2;
				if(maxY < ty3) maxY = ty3;
				if(maxY < ty4) maxY = ty4;
				found = true;
			}
		}
		var child = this.g2d_firstChild;
		while(child != null) {
			var next = child.g2d_nextNode;
			child.getBounds(p_targetSpace,aabb);
			if(aabb.width == 0 || aabb.height == 0) {
				child = next;
				continue;
			}
			if(minX > aabb.x) minX = aabb.x;
			if(maxX < aabb.get_right()) maxX = aabb.get_right();
			if(minY > aabb.y) minY = aabb.y;
			if(maxY < aabb.get_bottom()) maxY = aabb.get_bottom();
			found = true;
			child = next;
		}
		if(found) p_bounds.setTo(minX,minY,maxX - minX,maxY - minY);
		return p_bounds;
	}
	,getCommonParent: function(p_node) {
		var current = this;
		com.genome2d.node.GNode.g2d_cachedArray = [];
		while(current != null) {
			com.genome2d.node.GNode.g2d_cachedArray.push(current);
			current = current.g2d_parent;
		}
		current = p_node;
		while(current != null && Lambda.indexOf(com.genome2d.node.GNode.g2d_cachedArray,current) == -1) current = current.g2d_parent;
		return current;
	}
	,sortChildrenOnUserData: function(p_property,p_ascending) {
		if(p_ascending == null) p_ascending = true;
		if(this.g2d_firstChild == null) return;
		var insize = 1;
		var psize;
		var qsize;
		var nmerges;
		var p;
		var q;
		var e;
		while(true) {
			p = this.g2d_firstChild;
			this.g2d_firstChild = null;
			this.g2d_lastChild = null;
			nmerges = 0;
			while(p != null) {
				nmerges++;
				q = p;
				psize = 0;
				var _g = 0;
				while(_g < insize) {
					var i = _g++;
					psize++;
					q = q.g2d_nextNode;
					if(q == null) break;
				}
				qsize = insize;
				while(psize > 0 || qsize > 0 && q != null) {
					if(psize == 0) {
						e = q;
						q = q.g2d_nextNode;
						qsize--;
					} else if(qsize == 0 || q == null) {
						e = p;
						p = p.g2d_nextNode;
						psize--;
					} else if(p_ascending) {
						if((function($this) {
							var $r;
							var this1;
							{
								if(p.g2d_userData == null) p.g2d_userData = new haxe.ds.StringMap();
								this1 = p.g2d_userData;
							}
							$r = this1.get(p_property);
							return $r;
						}(this)) >= (function($this) {
							var $r;
							var this2;
							{
								if(q.g2d_userData == null) q.g2d_userData = new haxe.ds.StringMap();
								this2 = q.g2d_userData;
							}
							$r = this2.get(p_property);
							return $r;
						}(this))) {
							e = p;
							p = p.g2d_nextNode;
							psize--;
						} else {
							e = q;
							q = q.g2d_nextNode;
							qsize--;
						}
					} else if((function($this) {
						var $r;
						var this3;
						{
							if(p.g2d_userData == null) p.g2d_userData = new haxe.ds.StringMap();
							this3 = p.g2d_userData;
						}
						$r = this3.get(p_property);
						return $r;
					}(this)) <= (function($this) {
						var $r;
						var this4;
						{
							if(q.g2d_userData == null) q.g2d_userData = new haxe.ds.StringMap();
							this4 = q.g2d_userData;
						}
						$r = this4.get(p_property);
						return $r;
					}(this))) {
						e = p;
						p = p.g2d_nextNode;
						psize--;
					} else {
						e = q;
						q = q.g2d_nextNode;
						qsize--;
					}
					if(this.g2d_lastChild != null) this.g2d_lastChild.g2d_nextNode = e; else this.g2d_firstChild = e;
					e.g2d_previousNode = this.g2d_lastChild;
					this.g2d_lastChild = e;
				}
				p = q;
			}
			this.g2d_lastChild.g2d_nextNode = null;
			if(nmerges <= 1) return;
			insize *= 2;
		}
	}
	,toString: function() {
		return "[GNode " + this.name + "]";
	}
	,__class__: com.genome2d.node.GNode
	,__properties__: {get_onRemovedFromStage:"get_onRemovedFromStage",get_onAddedToStage:"get_onAddedToStage",get_numChildren:"get_numChildren",get_nextNode:"get_nextNode",get_firstChild:"get_firstChild",get_onMouseOut:"get_onMouseOut",get_onMouseOver:"get_onMouseOver",get_onMouseUp:"get_onMouseUp",get_onMouseClick:"get_onMouseClick",get_onMouseMove:"get_onMouseMove",get_onMouseDown:"get_onMouseDown",get_parent:"get_parent",get_transform:"get_transform",get_id:"get_id",get_userData:"get_userData",set_mask:"set_mask",get_mask:"get_mask",get_core:"get_core"}
};
com.genome2d.node.GNodePool = function(p_prototype,p_maxCount,p_precacheCount) {
	if(p_precacheCount == null) p_precacheCount = 0;
	if(p_maxCount == null) p_maxCount = 0;
	this.g2d_cachedCount = 0;
	this.g2d_prototype = p_prototype;
	this.g2d_maxCount = p_maxCount;
	var _g = 0;
	while(_g < p_precacheCount) {
		var i = _g++;
		this.g2d_createNew(true);
	}
};
$hxClasses["com.genome2d.node.GNodePool"] = com.genome2d.node.GNodePool;
com.genome2d.node.GNodePool.__name__ = ["com","genome2d","node","GNodePool"];
com.genome2d.node.GNodePool.prototype = {
	getCachedCount: function() {
		return this.g2d_cachedCount;
	}
	,getNext: function() {
		var node;
		if(this.g2d_first == null || this.g2d_first.g2d_active) node = this.g2d_createNew(); else {
			node = this.g2d_first;
			node.setActive(true);
		}
		return node;
	}
	,g2d_putToFront: function(p_node) {
		if(p_node == this.g2d_first) return;
		if(p_node.g2d_poolNext != null) p_node.g2d_poolNext.g2d_poolPrevious = p_node.g2d_poolPrevious;
		if(p_node.g2d_poolPrevious != null) p_node.g2d_poolPrevious.g2d_poolNext = p_node.g2d_poolNext;
		if(p_node == this.g2d_last) this.g2d_last = this.g2d_last.g2d_poolPrevious;
		if(this.g2d_first != null) this.g2d_first.g2d_poolPrevious = p_node;
		p_node.g2d_poolPrevious = null;
		p_node.g2d_poolNext = this.g2d_first;
		this.g2d_first = p_node;
	}
	,g2d_putToBack: function(p_node) {
		if(p_node == this.g2d_last) return;
		if(p_node.g2d_poolNext != null) p_node.g2d_poolNext.g2d_poolPrevious = p_node.g2d_poolPrevious;
		if(p_node.g2d_poolPrevious != null) p_node.g2d_poolPrevious.g2d_poolNext = p_node.g2d_poolNext;
		if(p_node == this.g2d_first) this.g2d_first = this.g2d_first.g2d_poolNext;
		if(this.g2d_last != null) this.g2d_last.g2d_poolNext = p_node;
		p_node.g2d_poolPrevious = this.g2d_last;
		p_node.g2d_poolNext = null;
		this.g2d_last = p_node;
	}
	,g2d_createNew: function(p_precache) {
		if(p_precache == null) p_precache = false;
		var node = null;
		if(this.g2d_maxCount == 0 || this.g2d_cachedCount < this.g2d_maxCount) {
			this.g2d_cachedCount++;
			node = com.genome2d.node.factory.GNodeFactory.createFromPrototype(this.g2d_prototype);
			if(p_precache) node.setActive(false);
			node.g2d_pool = this;
			if(this.g2d_first == null) {
				this.g2d_first = node;
				this.g2d_last = node;
			} else {
				node.g2d_poolPrevious = this.g2d_last;
				this.g2d_last.g2d_poolNext = node;
				this.g2d_last = node;
			}
		}
		return node;
	}
	,dispose: function() {
		while(this.g2d_first != null) {
			var next = this.g2d_first.g2d_poolNext;
			this.g2d_first.dispose();
			this.g2d_first = next;
		}
	}
	,__class__: com.genome2d.node.GNodePool
};
com.genome2d.node.factory = {};
com.genome2d.node.factory.GNodeFactory = function() { };
$hxClasses["com.genome2d.node.factory.GNodeFactory"] = com.genome2d.node.factory.GNodeFactory;
com.genome2d.node.factory.GNodeFactory.__name__ = ["com","genome2d","node","factory","GNodeFactory"];
com.genome2d.node.factory.GNodeFactory.createNode = function(p_name) {
	if(p_name == null) p_name = "";
	return new com.genome2d.node.GNode(p_name);
};
com.genome2d.node.factory.GNodeFactory.createNodeWithComponent = function(p_componentClass,p_name,p_lookupClass) {
	if(p_name == null) p_name = "";
	var node = new com.genome2d.node.GNode();
	return node.addComponent(p_componentClass,p_lookupClass);
};
com.genome2d.node.factory.GNodeFactory.createFromPrototype = function(p_prototypeXml) {
	if(p_prototypeXml == null) new com.genome2d.error.GError("Null prototype");
	if(p_prototypeXml.nodeType == Xml.Document) p_prototypeXml = p_prototypeXml.firstChild();
	if(p_prototypeXml.get_nodeName() != "node") new com.genome2d.error.GError("Incorrect GNode prototype XML");
	var node = new com.genome2d.node.GNode();
	if(p_prototypeXml.get("mouseEnabled") == "true") node.mouseEnabled = true; else node.mouseEnabled = false;
	if(p_prototypeXml.get("mouseChildren") == "true") node.mouseChildren = true; else node.mouseChildren = false;
	var it = p_prototypeXml.elements();
	while(it.hasNext()) {
		var xml = it.next();
		if(xml.get_nodeName() == "components") {
			var componentsIt = xml.elements();
			while(componentsIt.hasNext()) {
				var componentXml = componentsIt.next();
				node.addComponentPrototype(componentXml);
			}
		}
		if(xml.get_nodeName() == "children") {
			var childIt = xml.elements();
			while(childIt.hasNext()) node.addChild(com.genome2d.node.factory.GNodeFactory.createFromPrototype(childIt.next()));
		}
	}
	return node;
};
com.genome2d.postprocesses = {};
com.genome2d.postprocesses.GPostProcess = function(p_passes,p_filters) {
	if(p_passes == null) p_passes = 1;
	this.g2d_bottomMargin = 0;
	this.g2d_topMargin = 0;
	this.g2d_rightMargin = 0;
	this.g2d_leftMargin = 0;
	this.g2d_passes = 1;
	this.g2d_id = Std.string(com.genome2d.postprocesses.GPostProcess.g2d_count++);
	if(p_passes < 1) new com.genome2d.error.GError("There are no passes.");
	this.g2d_passes = p_passes;
	this.g2d_matrix = new com.genome2d.geom.GMatrix3D();
	this.g2d_passFilters = p_filters;
	this.g2d_passTextures = new Array();
	var _g1 = 0;
	var _g = this.g2d_passes;
	while(_g1 < _g) {
		var i = _g1++;
		this.g2d_passTextures.push(null);
	}
	this.createPassTextures();
};
$hxClasses["com.genome2d.postprocesses.GPostProcess"] = com.genome2d.postprocesses.GPostProcess;
com.genome2d.postprocesses.GPostProcess.__name__ = ["com","genome2d","postprocesses","GPostProcess"];
com.genome2d.postprocesses.GPostProcess.prototype = {
	getPassCount: function() {
		return this.g2d_passes;
	}
	,setBounds: function(p_bounds) {
		this.g2d_definedBounds = p_bounds;
	}
	,setMargins: function(p_leftMargin,p_rightMargin,p_topMargin,p_bottomMargin) {
		if(p_bottomMargin == null) p_bottomMargin = 0;
		if(p_topMargin == null) p_topMargin = 0;
		if(p_rightMargin == null) p_rightMargin = 0;
		if(p_leftMargin == null) p_leftMargin = 0;
		this.g2d_leftMargin = p_leftMargin;
		this.g2d_rightMargin = p_rightMargin;
		this.g2d_topMargin = p_topMargin;
		this.g2d_bottomMargin = p_bottomMargin;
	}
	,render: function(p_parentTransformUpdate,p_parentColorUpdate,p_camera,p_node,p_bounds,p_source,p_target) {
		var bounds = p_bounds;
		if(bounds == null) if(this.g2d_definedBounds != null) bounds = this.g2d_definedBounds; else bounds = p_node.getBounds(null,this.g2d_activeBounds);
		if(bounds.width > 4096) return;
		this.updatePassTextures(bounds);
		var context = com.genome2d.Genome2D.getInstance().getContext();
		if(p_source == null) {
			this.g2d_matrix.identity();
			this.g2d_matrix.prependTranslation(-bounds.x + this.g2d_leftMargin,-bounds.y + this.g2d_topMargin,0);
			context.setRenderTarget(this.g2d_passTextures[0],this.g2d_matrix);
			p_node.render(true,true,p_camera,false,false);
		}
		var zero = this.g2d_passTextures[0];
		if(p_source != null) this.g2d_passTextures[0] = p_source;
		var _g1 = 1;
		var _g = this.g2d_passes;
		while(_g1 < _g) {
			var i = _g1++;
			context.setRenderTarget(this.g2d_passTextures[i]);
			context.bindRenderer(context.g2d_drawRenderer);
			context.g2d_drawRenderer.draw(0,0,1,1,0,1,1,1,1,this.g2d_passTextures[i - 1]);
		}
		context.setRenderTarget(p_target);
		if(p_target == null) {
			context.setCamera(p_camera);
			context.bindRenderer(context.g2d_drawRenderer);
			context.g2d_drawRenderer.draw(bounds.x - this.g2d_leftMargin,bounds.y - this.g2d_topMargin,1,1,0,1,1,1,1,this.g2d_passTextures[this.g2d_passes - 1]);
		} else {
			context.bindRenderer(context.g2d_drawRenderer);
			context.g2d_drawRenderer.draw(0,0,1,1,0,1,1,1,1,this.g2d_passTextures[this.g2d_passes - 1]);
		}
		this.g2d_passTextures[0] = zero;
	}
	,getPassTexture: function(p_pass) {
		return this.g2d_passTextures[p_pass];
	}
	,getPassFilter: function(p_pass) {
		return this.g2d_passFilters[p_pass];
	}
	,updatePassTextures: function(p_bounds) {
		var w = p_bounds.width + this.g2d_leftMargin + this.g2d_rightMargin | 0;
		var h = p_bounds.height + this.g2d_topMargin + this.g2d_bottomMargin | 0;
		if((this.g2d_passTextures[0].g2d_region.width | 0) != w || (this.g2d_passTextures[0].g2d_region.height | 0) != h) {
			var i = this.g2d_passTextures.length - 1;
			while(i >= 0) {
				var texture = this.g2d_passTextures[i];
				texture.setRegion(new com.genome2d.geom.GRectangle(0,0,w,h));
				texture.pivotX = -(texture.g2d_region.width | 0) / 2;
				texture.pivotY = -(texture.g2d_region.height | 0) / 2;
				texture.invalidateNativeTexture(true);
				i--;
			}
		}
	}
	,createPassTextures: function() {
		var _g1 = 0;
		var _g = this.g2d_passes;
		while(_g1 < _g) {
			var i = _g1++;
			var texture = com.genome2d.textures.factories.GTextureFactory.createRenderTexture("g2d_pp_" + this.g2d_id + "_" + i,2,2);
			texture.g2d_filteringType = 0;
			texture.pivotX = -(texture.g2d_region.width | 0) / 2;
			texture.pivotY = -(texture.g2d_region.height | 0) / 2;
			this.g2d_passTextures[i] = texture;
		}
	}
	,dispose: function() {
		var i = this.g2d_passTextures.length - 1;
		while(i >= 0) {
			this.g2d_passTextures[i].dispose();
			i--;
		}
	}
	,__class__: com.genome2d.postprocesses.GPostProcess
};
com.genome2d.signals = {};
com.genome2d.signals.GKeyboardSignal = function(p_keyCode) {
	this.keyCode = p_keyCode;
};
$hxClasses["com.genome2d.signals.GKeyboardSignal"] = com.genome2d.signals.GKeyboardSignal;
com.genome2d.signals.GKeyboardSignal.__name__ = ["com","genome2d","signals","GKeyboardSignal"];
com.genome2d.signals.GKeyboardSignal.prototype = {
	__class__: com.genome2d.signals.GKeyboardSignal
};
com.genome2d.signals.GMouseSignal = function(p_type,p_x,p_y,p_nativeCaptured) {
	this.type = p_type;
	this.x = p_x;
	this.y = p_y;
	this.nativeCaptured = p_nativeCaptured;
};
$hxClasses["com.genome2d.signals.GMouseSignal"] = com.genome2d.signals.GMouseSignal;
com.genome2d.signals.GMouseSignal.__name__ = ["com","genome2d","signals","GMouseSignal"];
com.genome2d.signals.GMouseSignal.prototype = {
	__class__: com.genome2d.signals.GMouseSignal
};
com.genome2d.signals.GMouseSignalType = function() { };
$hxClasses["com.genome2d.signals.GMouseSignalType"] = com.genome2d.signals.GMouseSignalType;
com.genome2d.signals.GMouseSignalType.__name__ = ["com","genome2d","signals","GMouseSignalType"];
com.genome2d.signals.GMouseSignalType.fromNative = function(p_nativeType) {
	var type = "";
	switch(p_nativeType) {
	case "mousemove":case "touchmove":
		type = "mouseMove";
		break;
	case "mousedown":case "touchstart":
		type = "mouseDown";
		break;
	case "mouseup":case "touchend":
		type = "mouseUp";
		break;
	}
	return type;
};
com.genome2d.signals.GNodeMouseSignal = function(p_type,p_target,p_dispatcher,p_localX,p_localY,p_contextSignal) {
	this.type = p_type;
	this.target = p_target;
	this.dispatcher = p_dispatcher;
	this.localX = p_localX;
	this.localY = p_localY;
};
$hxClasses["com.genome2d.signals.GNodeMouseSignal"] = com.genome2d.signals.GNodeMouseSignal;
com.genome2d.signals.GNodeMouseSignal.__name__ = ["com","genome2d","signals","GNodeMouseSignal"];
com.genome2d.signals.GNodeMouseSignal.prototype = {
	__class__: com.genome2d.signals.GNodeMouseSignal
};
com.genome2d.textures = {};
com.genome2d.textures.GContextTexture = function(p_context,p_id,p_sourceType,p_source,p_region,p_format,p_repeatable,p_pivotX,p_pivotY) {
	this.g2d_premultiplied = true;
	this.pivotY = 0;
	this.pivotX = 0;
	this.uvScaleY = 1;
	this.uvScaleX = 1;
	this.uvY = 0;
	this.uvX = 0;
	this.g2d_gpuHeight = 0;
	this.g2d_gpuWidth = 0;
	if(com.genome2d.textures.GContextTexture.g2d_references == null) com.genome2d.textures.GContextTexture.g2d_references = new haxe.ds.StringMap();
	if(p_id == null || p_id.length == 0) new com.genome2d.error.GError("Invalid textures id.");
	if(com.genome2d.textures.GContextTexture.g2d_references.get(p_id) != null) new com.genome2d.error.GError("Duplicate textures id.");
	this.g2d_format = p_format;
	com.genome2d.textures.GContextTexture.g2d_instanceCount++;
	this.g2d_contextId = com.genome2d.textures.GContextTexture.g2d_instanceCount;
	this.g2d_region = p_region;
	var useRectangle = p_context.hasFeature(2);
	if(useRectangle) this.g2d_gpuWidth = this.g2d_region.width | 0; else this.g2d_gpuWidth = com.genome2d.textures.GTextureUtils.getNextValidTextureSize(this.g2d_region.width | 0);
	if(useRectangle) this.g2d_gpuHeight = this.g2d_region.height | 0; else this.g2d_gpuHeight = com.genome2d.textures.GTextureUtils.getNextValidTextureSize(this.g2d_region.height | 0);
	com.genome2d.textures.GContextTexture.g2d_references.set(p_id,this);
	this.g2d_context = p_context;
	this.g2d_id = p_id;
	this.g2d_sourceType = p_sourceType;
	this.g2d_nativeSource = p_source;
	this.g2d_filteringType = com.genome2d.textures.GContextTexture.defaultFilteringType;
};
$hxClasses["com.genome2d.textures.GContextTexture"] = com.genome2d.textures.GContextTexture;
com.genome2d.textures.GContextTexture.__name__ = ["com","genome2d","textures","GContextTexture"];
com.genome2d.textures.GContextTexture.getContextTextureById = function(p_id) {
	return com.genome2d.textures.GContextTexture.g2d_references.get(p_id);
};
com.genome2d.textures.GContextTexture.invalidateAll = function(p_force) {
	if(com.genome2d.textures.GContextTexture.g2d_references != null) {
		var $it0 = com.genome2d.textures.GContextTexture.g2d_references.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			com.genome2d.textures.GContextTexture.g2d_references.get(key).invalidateNativeTexture(p_force);
		}
	}
};
com.genome2d.textures.GContextTexture.prototype = {
	getNativeSource: function() {
		return this.g2d_nativeSource;
	}
	,getType: function() {
		return this.g2d_type;
	}
	,getId: function() {
		return this.g2d_id;
	}
	,get_width: function() {
		return this.g2d_region.width | 0;
	}
	,get_height: function() {
		return this.g2d_region.height | 0;
	}
	,get_gpuWidth: function() {
		return this.g2d_gpuWidth;
	}
	,get_gpuHeight: function() {
		return this.g2d_gpuHeight;
	}
	,getFilteringType: function() {
		return this.g2d_filteringType;
	}
	,setFilteringType: function(p_value) {
		return this.g2d_filteringType = p_value;
	}
	,invalidateNativeTexture: function(p_reinitialize) {
		if(js.Boot.__instanceof(this.g2d_context,com.genome2d.context.webgl.GWebGLContext)) {
			var webglContext = this.g2d_context;
			if(this.g2d_type != 1) {
				var _g = this.g2d_sourceType;
				switch(_g) {
				case 0:
					if(this.nativeTexture == null || p_reinitialize) this.nativeTexture = webglContext.g2d_nativeContext.createTexture();
					webglContext.g2d_nativeContext.bindTexture(3553,this.nativeTexture);
					webglContext.g2d_nativeContext.texImage2D(3553,0,6408,6408,5121,this.g2d_nativeSource);
					webglContext.g2d_nativeContext.texParameteri(3553,10241,9729);
					webglContext.g2d_nativeContext.texParameteri(3553,10240,9729);
					webglContext.g2d_nativeContext.texParameteri(3553,10242,33071);
					webglContext.g2d_nativeContext.texParameteri(3553,10243,33071);
					webglContext.g2d_nativeContext.bindTexture(3553,null);
					break;
				default:
				}
			}
		} else this.g2d_nativeImage = this.g2d_nativeSource;
	}
	,getAlphaAtUV: function(p_u,p_v) {
		return 1;
	}
	,dispose: function() {
	}
	,__class__: com.genome2d.textures.GContextTexture
	,__properties__: {get_gpuHeight:"get_gpuHeight",get_gpuWidth:"get_gpuWidth",get_height:"get_height",get_width:"get_width"}
};
com.genome2d.textures.GTexture = function(p_context,p_id,p_sourceType,p_source,p_region,p_format,p_repeatable,p_pivotX,p_pivotY,p_parentAtlas) {
	this.g2d_subId = "";
	com.genome2d.textures.GContextTexture.call(this,p_context,p_id,p_sourceType,p_source,p_region,p_format,p_repeatable,p_pivotX,p_pivotY);
	this.g2d_parentAtlas = p_parentAtlas;
	if(this.g2d_parentAtlas == null) this.g2d_type = 0; else this.g2d_type = 1;
	this.g2d_invalidateUV();
	this.pivotX = p_pivotX;
	this.pivotY = p_pivotY;
	this.invalidateNativeTexture(false);
};
$hxClasses["com.genome2d.textures.GTexture"] = com.genome2d.textures.GTexture;
com.genome2d.textures.GTexture.__name__ = ["com","genome2d","textures","GTexture"];
com.genome2d.textures.GTexture.getTextureById = function(p_id) {
	return com.genome2d.textures.GContextTexture.getContextTextureById(p_id);
};
com.genome2d.textures.GTexture.__super__ = com.genome2d.textures.GContextTexture;
com.genome2d.textures.GTexture.prototype = $extend(com.genome2d.textures.GContextTexture.prototype,{
	getParentAtlas: function() {
		return this.g2d_parentAtlas;
	}
	,getRegion: function() {
		return this.g2d_region;
	}
	,setRegion: function(p_value) {
		this.g2d_region = p_value;
		var useRectangle = this.g2d_context.hasFeature(2);
		if(useRectangle) this.g2d_gpuWidth = this.g2d_region.width | 0; else this.g2d_gpuWidth = com.genome2d.textures.GTextureUtils.getNextValidTextureSize(this.g2d_region.width | 0);
		if(useRectangle) this.g2d_gpuHeight = this.g2d_region.height | 0; else this.g2d_gpuHeight = com.genome2d.textures.GTextureUtils.getNextValidTextureSize(this.g2d_region.height | 0);
		this.g2d_invalidateUV();
	}
	,g2d_invalidateUV: function() {
		if(this.g2d_parentAtlas != null) {
			this.uvX = this.g2d_region.x / (this.g2d_parentAtlas.g2d_region.width | 0);
			this.uvY = this.g2d_region.y / (this.g2d_parentAtlas.g2d_region.height | 0);
			this.uvScaleX = (this.g2d_region.width | 0) / (this.g2d_parentAtlas.g2d_region.width | 0);
			this.uvScaleY = (this.g2d_region.height | 0) / (this.g2d_parentAtlas.g2d_region.height | 0);
		} else {
			this.uvScaleX = (this.g2d_region.width | 0) / this.g2d_gpuWidth;
			this.uvScaleY = (this.g2d_region.height | 0) / this.g2d_gpuHeight;
		}
	}
	,invalidateNativeTexture: function(p_reinitialize) {
		com.genome2d.textures.GContextTexture.prototype.invalidateNativeTexture.call(this,p_reinitialize);
		if(this.g2d_type == 1) {
			this.g2d_gpuWidth = this.g2d_parentAtlas.g2d_gpuWidth;
			this.g2d_gpuHeight = this.g2d_parentAtlas.g2d_gpuHeight;
		}
	}
	,dispose: function() {
		this.g2d_parentAtlas = null;
		com.genome2d.textures.GContextTexture.prototype.dispose.call(this);
	}
	,__class__: com.genome2d.textures.GTexture
});
com.genome2d.textures.GCharTexture = function(p_context,p_id,p_sourceType,p_source,p_region,p_format,p_repeatable,p_pivotX,p_pivotY,p_parentAtlas) {
	this.xadvance = 0;
	this.yoffset = 0;
	this.xoffset = 0;
	com.genome2d.textures.GTexture.call(this,p_context,p_id,p_sourceType,p_source,p_region,p_format,p_repeatable,p_pivotX,p_pivotY,p_parentAtlas);
};
$hxClasses["com.genome2d.textures.GCharTexture"] = com.genome2d.textures.GCharTexture;
com.genome2d.textures.GCharTexture.__name__ = ["com","genome2d","textures","GCharTexture"];
com.genome2d.textures.GCharTexture.__super__ = com.genome2d.textures.GTexture;
com.genome2d.textures.GCharTexture.prototype = $extend(com.genome2d.textures.GTexture.prototype,{
	__class__: com.genome2d.textures.GCharTexture
});
com.genome2d.textures.GTextureAtlas = function(p_context,p_id,p_sourceType,p_source,p_region,p_format,p_uploadCallback) {
	com.genome2d.textures.GContextTexture.call(this,p_context,p_id,p_sourceType,p_source,p_region,p_format,false,0,0);
	this.g2d_type = 2;
	this.g2d_textures = new haxe.ds.StringMap();
};
$hxClasses["com.genome2d.textures.GTextureAtlas"] = com.genome2d.textures.GTextureAtlas;
com.genome2d.textures.GTextureAtlas.__name__ = ["com","genome2d","textures","GTextureAtlas"];
com.genome2d.textures.GTextureAtlas.getTextureAtlasById = function(p_id) {
	return com.genome2d.textures.GContextTexture.getContextTextureById(p_id);
};
com.genome2d.textures.GTextureAtlas.__super__ = com.genome2d.textures.GContextTexture;
com.genome2d.textures.GTextureAtlas.prototype = $extend(com.genome2d.textures.GContextTexture.prototype,{
	getSubTexture: function(p_subId) {
		return this.g2d_textures.get(p_subId);
	}
	,getSubTextures: function(p_regExp) {
		var found = new Array();
		var $it0 = this.g2d_textures.iterator();
		while( $it0.hasNext() ) {
			var tex = $it0.next();
			if(p_regExp != null) {
				if(p_regExp.match(tex.g2d_id)) found.push(tex);
			} else found.push(tex);
		}
		return found;
	}
	,invalidateNativeTexture: function(p_reinitialize) {
		com.genome2d.textures.GContextTexture.prototype.invalidateNativeTexture.call(this,p_reinitialize);
		var $it0 = this.g2d_textures.iterator();
		while( $it0.hasNext() ) {
			var tex = $it0.next();
			tex.nativeTexture = this.nativeTexture;
			tex.g2d_gpuWidth = this.g2d_gpuWidth;
			tex.g2d_gpuHeight = this.g2d_gpuHeight;
		}
	}
	,addSubTexture: function(p_subId,p_region,p_pivotX,p_pivotY) {
		if(p_pivotY == null) p_pivotY = 0;
		if(p_pivotX == null) p_pivotX = 0;
		var texture = new com.genome2d.textures.GTexture(this.g2d_context,this.g2d_id + "_" + p_subId,this.g2d_sourceType,this.g2d_nativeSource,p_region,this.g2d_format,false,p_pivotX,p_pivotY,this);
		texture.g2d_subId = p_subId;
		texture.g2d_filteringType = this.g2d_filteringType;
		texture.nativeTexture = this.nativeTexture;
		this.g2d_textures.set(p_subId,texture);
		return texture;
	}
	,removeSubTexture: function(p_subId) {
		this.g2d_textures.get(p_subId).dispose();
		this.g2d_textures.remove(p_subId);
	}
	,g2d_disposeSubTextures: function() {
		var $it0 = this.g2d_textures.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			this.g2d_textures.get(key).dispose();
			this.g2d_textures.remove(key);
		}
	}
	,dispose: function() {
		this.g2d_disposeSubTextures();
		com.genome2d.textures.GContextTexture.prototype.dispose.call(this);
	}
	,__class__: com.genome2d.textures.GTextureAtlas
});
com.genome2d.textures.GTextureFilteringType = function() { };
$hxClasses["com.genome2d.textures.GTextureFilteringType"] = com.genome2d.textures.GTextureFilteringType;
com.genome2d.textures.GTextureFilteringType.__name__ = ["com","genome2d","textures","GTextureFilteringType"];
com.genome2d.textures.GTextureFontAtlas = function(p_context,p_id,p_sourceType,p_source,p_region,p_format,p_uploadCallback) {
	this.lineHeight = 0;
	com.genome2d.textures.GTextureAtlas.call(this,p_context,p_id,p_sourceType,p_source,p_region,p_format,p_uploadCallback);
};
$hxClasses["com.genome2d.textures.GTextureFontAtlas"] = com.genome2d.textures.GTextureFontAtlas;
com.genome2d.textures.GTextureFontAtlas.__name__ = ["com","genome2d","textures","GTextureFontAtlas"];
com.genome2d.textures.GTextureFontAtlas.getTextureFontAtlasById = function(p_id) {
	return com.genome2d.textures.GContextTexture.getContextTextureById(p_id);
};
com.genome2d.textures.GTextureFontAtlas.__super__ = com.genome2d.textures.GTextureAtlas;
com.genome2d.textures.GTextureFontAtlas.prototype = $extend(com.genome2d.textures.GTextureAtlas.prototype,{
	getSubTexture: function(p_subId) {
		return this.g2d_textures.get(p_subId);
	}
	,addSubTexture: function(p_subId,p_region,p_pivotX,p_pivotY) {
		if(p_pivotY == null) p_pivotY = 0;
		if(p_pivotX == null) p_pivotX = 0;
		var texture = new com.genome2d.textures.GCharTexture(this.g2d_context,this.g2d_id + "_" + p_subId,this.g2d_sourceType,this.g2d_nativeSource,p_region,this.g2d_format,false,p_pivotX,p_pivotY,this);
		texture.g2d_subId = p_subId;
		texture.g2d_filteringType = this.g2d_filteringType;
		texture.nativeTexture = this.nativeTexture;
		this.g2d_textures.set(p_subId,texture);
		return texture;
	}
	,getKerning: function(p_first,p_second) {
		if(this.g2d_kerning != null) {
			var map = this.g2d_kerning.get(p_first);
			if(map != null) {
				if(!map.exists(p_second)) return 0; else return map.get(p_second);
			}
		}
		return 0;
	}
	,__class__: com.genome2d.textures.GTextureFontAtlas
});
com.genome2d.textures.GTextureSourceType = function() { };
$hxClasses["com.genome2d.textures.GTextureSourceType"] = com.genome2d.textures.GTextureSourceType;
com.genome2d.textures.GTextureSourceType.__name__ = ["com","genome2d","textures","GTextureSourceType"];
com.genome2d.textures.GTextureType = function() { };
$hxClasses["com.genome2d.textures.GTextureType"] = com.genome2d.textures.GTextureType;
com.genome2d.textures.GTextureType.__name__ = ["com","genome2d","textures","GTextureType"];
com.genome2d.textures.GTextureUtils = function() { };
$hxClasses["com.genome2d.textures.GTextureUtils"] = com.genome2d.textures.GTextureUtils;
com.genome2d.textures.GTextureUtils.__name__ = ["com","genome2d","textures","GTextureUtils"];
com.genome2d.textures.GTextureUtils.isValidTextureSize = function(p_size) {
	return com.genome2d.textures.GTextureUtils.getNextValidTextureSize(p_size) == p_size;
};
com.genome2d.textures.GTextureUtils.getNextValidTextureSize = function(p_size) {
	var size = 1;
	while(p_size > size) size *= 2;
	return size;
};
com.genome2d.textures.GTextureUtils.getPreviousValidTextureSize = function(p_size) {
	return com.genome2d.textures.GTextureUtils.getNextValidTextureSize(p_size) >> 1;
};
com.genome2d.textures.GTextureUtils.getNearestValidTextureSize = function(p_size) {
	var previous = com.genome2d.textures.GTextureUtils.getPreviousValidTextureSize(p_size);
	var next = com.genome2d.textures.GTextureUtils.getNextValidTextureSize(p_size);
	if(p_size - previous < next - p_size) return previous; else return next;
};
com.genome2d.textures.factories = {};
com.genome2d.textures.factories.GTextureAtlasFactory = function() { };
$hxClasses["com.genome2d.textures.factories.GTextureAtlasFactory"] = com.genome2d.textures.factories.GTextureAtlasFactory;
com.genome2d.textures.factories.GTextureAtlasFactory.__name__ = ["com","genome2d","textures","factories","GTextureAtlasFactory"];
com.genome2d.textures.factories.GTextureAtlasFactory.createFromImageAndXml = function(p_id,p_image,p_xml,p_format) {
	if(p_format == null) p_format = "bgra";
	if(!com.genome2d.textures.GTextureUtils.isValidTextureSize(p_image.width) || !com.genome2d.textures.GTextureUtils.isValidTextureSize(p_image.height)) new com.genome2d.error.GError("Atlas bitmap needs to have power of 2 size.");
	var textureAtlas = new com.genome2d.textures.GTextureAtlas(com.genome2d.textures.factories.GTextureAtlasFactory.g2d_context,p_id,0,p_image,new com.genome2d.geom.GRectangle(0,0,p_image.width,p_image.height),p_format,null);
	var root = p_xml.firstElement();
	var it = root.elements();
	while(it.hasNext()) {
		var node = it.next();
		var region = new com.genome2d.geom.GRectangle(Std.parseInt(node.get("x")),Std.parseInt(node.get("y")),Std.parseInt(node.get("width")),Std.parseInt(node.get("height")));
		var pivotX;
		if(node.get("frameX") == null || node.get("frameWidth") == null) pivotX = 0; else pivotX = (Std.parseInt(node.get("frameWidth")) - region.width) / 2 + Std.parseInt(node.get("frameX"));
		var pivotY;
		if(node.get("frameY") == null || node.get("frameHeight") == null) pivotY = 0; else pivotY = (Std.parseInt(node.get("frameHeight")) - region.height) / 2 + Std.parseInt(node.get("frameY"));
		textureAtlas.addSubTexture(node.get("name"),region,pivotX,pivotY);
	}
	textureAtlas.invalidateNativeTexture(false);
	return textureAtlas;
};
com.genome2d.textures.factories.GTextureAtlasFactory.createFromImageAndFontXml = function(p_id,p_image,p_fontXml,p_format) {
	if(p_format == null) p_format = "bgra";
	var textureAtlas = new com.genome2d.textures.GTextureFontAtlas(com.genome2d.textures.factories.GTextureAtlasFactory.g2d_context,p_id,0,p_image,new com.genome2d.geom.GRectangle(0,0,p_image.width,p_image.height),p_format,null);
	var root = p_fontXml.firstElement();
	var common = root.elementsNamed("common").next();
	textureAtlas.lineHeight = Std.parseInt(common.get("lineHeight"));
	var it = root.elementsNamed("chars");
	it = it.next().elements();
	while(it.hasNext()) {
		var node = it.next();
		var w = Std.parseInt(node.get("width"));
		var h = Std.parseInt(node.get("height"));
		var region = new com.genome2d.geom.GRectangle(Std.parseInt(node.get("x")),Std.parseInt(node.get("y")),w,h);
		var subtexture = textureAtlas.addSubTexture(node.get("id"),region,-w / 2,-h / 2);
		subtexture.xoffset = Std.parseInt(node.get("xoffset"));
		subtexture.yoffset = Std.parseInt(node.get("yoffset"));
		subtexture.xadvance = Std.parseInt(node.get("xadvance"));
	}
	var kernings = root.elementsNamed("kernings").next();
	if(kernings != null) {
		it = kernings.elements();
		textureAtlas.g2d_kerning = new haxe.ds.IntMap();
		while(it.hasNext()) {
			var node1 = it.next();
			var first = Std.parseInt(node1.get("first"));
			var map = textureAtlas.g2d_kerning.get(first);
			if(map == null) {
				map = new haxe.ds.IntMap();
				textureAtlas.g2d_kerning.set(first,map);
			}
			var second = Std.parseInt(node1.get("second"));
			var value = Std.parseInt("amount");
			map.set(second,value);
		}
	}
	textureAtlas.invalidateNativeTexture(false);
	return textureAtlas;
};
com.genome2d.textures.factories.GTextureAtlasFactory.createFromAssets = function(p_id,p_imageAsset,p_xmlAsset,p_format) {
	if(p_format == null) p_format = "bgra";
	return com.genome2d.textures.factories.GTextureAtlasFactory.createFromImageAndXml(p_id,p_imageAsset.g2d_nativeImage,p_xmlAsset.xml,p_format);
};
com.genome2d.textures.factories.GTextureAtlasFactory.createFontFromAssets = function(p_id,p_imageAsset,p_xmlAsset,p_format) {
	if(p_format == null) p_format = "bgra";
	return com.genome2d.textures.factories.GTextureAtlasFactory.createFromImageAndFontXml(p_id,p_imageAsset.g2d_nativeImage,p_xmlAsset.xml,p_format);
};
com.genome2d.textures.factories.GTextureFactory = function() { };
$hxClasses["com.genome2d.textures.factories.GTextureFactory"] = com.genome2d.textures.factories.GTextureFactory;
com.genome2d.textures.factories.GTextureFactory.__name__ = ["com","genome2d","textures","factories","GTextureFactory"];
com.genome2d.textures.factories.GTextureFactory.createFromImage = function(p_id,p_image) {
	return new com.genome2d.textures.GTexture(com.genome2d.textures.factories.GTextureFactory.g2d_context,p_id,0,p_image,new com.genome2d.geom.GRectangle(0,0,p_image.width,p_image.height),"",false,0,0,null);
};
com.genome2d.textures.factories.GTextureFactory.createFromAsset = function(p_id,p_imageAsset) {
	return com.genome2d.textures.factories.GTextureFactory.createFromImage(p_id,p_imageAsset.g2d_nativeImage);
};
com.genome2d.textures.factories.GTextureFactory.createRenderTexture = function(p_id,p_width,p_height) {
	return null;
};
var components = {};
components.BackgroundMovement = function() {
	this._speed = 0.1;
	com.genome2d.components.GComponent.call(this);
	this._viewRect = model.ModelLocator.initialize().registry.viewRect;
};
$hxClasses["components.BackgroundMovement"] = components.BackgroundMovement;
components.BackgroundMovement.__name__ = ["components","BackgroundMovement"];
components.BackgroundMovement.__super__ = com.genome2d.components.GComponent;
components.BackgroundMovement.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
	}
	,_update: function(deltaTime) {
		var _g = this.g2d_node.g2d_transform;
		_g.g2d_transformDirty = _g.g2d_matrixDirty = true;
		_g.g2d_localY = _g.g2d_worldY = _g.g2d_localY + this._speed * deltaTime;
		if(this.g2d_node.g2d_transform.g2d_localY >= this._viewRect.height) this.g2d_node.g2d_transform.set_y(0);
	}
	,__class__: components.BackgroundMovement
});
components.EnemyShipComponent = function() {
	this._amplitude = 100;
	this._explodeDelay = 120;
	this._exploding = false;
	this._speed = 0.2;
	com.genome2d.components.GComponent.call(this);
	this._registry = model.ModelLocator.initialize().registry;
	this._assets = model.ModelLocator.initialize().assets;
	this._viewRect = this._registry.viewRect;
};
$hxClasses["components.EnemyShipComponent"] = components.EnemyShipComponent;
components.EnemyShipComponent.__name__ = ["components","EnemyShipComponent"];
components.EnemyShipComponent.__super__ = com.genome2d.components.GComponent;
components.EnemyShipComponent.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		this._parentShip = this.g2d_node;
		this._initX = this.g2d_node.g2d_transform.g2d_localX;
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
	}
	,_update: function(deltaTime) {
		var nodeX = this.g2d_node.g2d_transform.g2d_localX + this._viewRect.width / 2;
		var nodeY = this.g2d_node.g2d_transform.g2d_localY + this._viewRect.height / 2;
		if(!this._exploding) {
			var _g = 0;
			var _g1 = this._registry.playerBullets;
			while(_g < _g1.length) {
				var bullet = _g1[_g];
				++_g;
				if(bullet.graphics.hitTestPoint(nodeX,nodeY,false,20,20)) {
					(js.Boot.__cast(bullet.getComponent(components.PlayerBulletComponent) , components.PlayerBulletComponent)).remove();
					this.explode();
				}
			}
		}
		if(!this._exploding && !this._registry.playerComponent.exploding && this._registry.player.graphics.hitTestPoint(nodeX,nodeY,false,20,20)) {
			this._registry.playerComponent.explode();
			this.explode();
		}
		var _g2 = this.g2d_node.g2d_transform;
		_g2.g2d_transformDirty = _g2.g2d_matrixDirty = true;
		_g2.g2d_localY = _g2.g2d_worldY = _g2.g2d_localY + this._speed * deltaTime;
		if(this._parentShip.movementType == model.MovementTypes.SINUSOIDAL) this.g2d_node.g2d_transform.set_x(this._initX + Math.sin(this.g2d_node.g2d_transform.g2d_localY * Math.PI / 180) * this._amplitude);
		if(this._exploding) {
			this._explodeDelay--;
			if(this._explodeDelay <= 0) {
				this.remove();
				return;
			}
		}
		if(this.g2d_node.g2d_transform.g2d_localY > this._viewRect.height / 2 + 100) this.remove();
	}
	,remove: function() {
		this._registry.gameState.removeChild(this.g2d_node);
		var _g = 0;
		var _g1 = this._registry.enemies;
		while(_g < _g1.length) {
			var enemy = _g1[_g];
			++_g;
			if(enemy == this.g2d_node) {
				HxOverrides.remove(this._registry.enemies,enemy);
				break;
			}
		}
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().remove($bind(this,this._update));
		this.g2d_node.dispose();
	}
	,explode: function() {
		if(this._exploding) return;
		this._exploding = true;
		(js.Boot.__cast(this.g2d_node , entities.EnemyShip)).graphics.g2d_node.g2d_transform.visible = false;
		if(this._explosionEmitter == null) {
			this._explosionEmitter = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.particles.GSimpleParticleSystem,"explosion_emitter");
			this._explosionEmitter.texture = this._assets.atlas.getSubTexture("Particle");
			this._explosionEmitter.burst = true;
			this._explosionEmitter.emit = true;
			this._explosionEmitter.useWorldSpace = true;
			this._explosionEmitter.emission = 64;
			this._explosionEmitter.energy = 0.5;
			this._explosionEmitter.energyVariance = 0.2;
			this._explosionEmitter.dispersionAngleVariance = Math.PI * 2;
			this._explosionEmitter.initialVelocity = 80;
			this._explosionEmitter.initialVelocityVariance = 80;
			this._explosionEmitter.initialScale = 0.7;
			this._explosionEmitter.initialScaleVariance = 0.3;
			this._explosionEmitter.endScale = 0.2;
			this._explosionEmitter.endScaleVariance = 0.1;
			this._explosionEmitter.initialAlpha = 1;
			this._explosionEmitter.initialBlue = 4;
			this._explosionEmitter.initialGreen = 1;
			this._explosionEmitter.initialRed = 3;
			this._explosionEmitter.endAlpha = 0;
			this._explosionEmitter.endBlue = 5;
			this._explosionEmitter.endGreen = 2;
			this._explosionEmitter.endRed = 3;
			this.g2d_node.addChild(this._explosionEmitter.g2d_node);
		}
	}
	,__class__: components.EnemyShipComponent
});
components.EnemySpawner = function() {
	this._enemySpawnCounter = 60;
	this._enemySpawnInterval = 60;
	com.genome2d.components.GComponent.call(this);
	this._registry = model.ModelLocator.initialize().registry;
	this._texture = model.ModelLocator.initialize().assets.atlas.getSubTexture("EnemySpaceship");
};
$hxClasses["components.EnemySpawner"] = components.EnemySpawner;
components.EnemySpawner.__name__ = ["components","EnemySpawner"];
components.EnemySpawner.__super__ = com.genome2d.components.GComponent;
components.EnemySpawner.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
	}
	,_update: function(deltaTime) {
		if(this._enemySpawnCounter <= 0) {
			this._spawnEnemy();
			this._enemySpawnInterval--;
			if(this._enemySpawnInterval < 15) this._enemySpawnInterval = 15;
			this._enemySpawnCounter = this._enemySpawnInterval;
		} else this._enemySpawnCounter--;
	}
	,_spawnEnemy: function() {
		var e = new entities.EnemyShip(this._registry,this._texture);
	}
	,__class__: components.EnemySpawner
});
components.FollowMouseComponent = function() {
	com.genome2d.components.GComponent.call(this);
	this._viewRect = model.ModelLocator.initialize().registry.viewRect;
};
$hxClasses["components.FollowMouseComponent"] = components.FollowMouseComponent;
components.FollowMouseComponent.__name__ = ["components","FollowMouseComponent"];
components.FollowMouseComponent.__super__ = com.genome2d.components.GComponent;
components.FollowMouseComponent.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		com.genome2d.Genome2D.getInstance().getContext().onMouseSignal.add($bind(this,this._onMouse));
	}
	,_onMouse: function(e) {
		if(e.type == "mouseMove") {
			this.g2d_node.g2d_transform.set_x(e.x - this._viewRect.width / 2);
			this.g2d_node.g2d_transform.set_y(e.y - this._viewRect.height / 2);
		}
	}
	,__class__: components.FollowMouseComponent
});
components.PlayerBulletComponent = function() {
	this._speed = 1;
	com.genome2d.components.GComponent.call(this);
	this._registry = model.ModelLocator.initialize().registry;
	this._viewRect = this._registry.viewRect;
};
$hxClasses["components.PlayerBulletComponent"] = components.PlayerBulletComponent;
components.PlayerBulletComponent.__name__ = ["components","PlayerBulletComponent"];
components.PlayerBulletComponent.__super__ = com.genome2d.components.GComponent;
components.PlayerBulletComponent.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
	}
	,_update: function(deltaTime) {
		if(this.g2d_node == null) return;
		var _g = this.g2d_node.g2d_transform;
		_g.g2d_transformDirty = _g.g2d_matrixDirty = true;
		_g.g2d_localY = _g.g2d_worldY = _g.g2d_localY - this._speed * deltaTime;
		if(this.g2d_node.g2d_transform.g2d_localY < -this._viewRect.height / 2 - 50) this.remove();
	}
	,remove: function() {
		this._registry.gameState.removeChild(this.g2d_node);
		var _g = 0;
		var _g1 = this._registry.playerBullets;
		while(_g < _g1.length) {
			var bullet = _g1[_g];
			++_g;
			if(bullet == this.g2d_node) {
				HxOverrides.remove(this._registry.playerBullets,bullet);
				break;
			}
		}
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().remove($bind(this,this._update));
		this.g2d_node.dispose();
	}
	,__class__: components.PlayerBulletComponent
});
components.PlayerShipComponent = function() {
	this._invulnerableTimer = 120;
	this._explosionDelay = 120;
	this._explosionTimer = 120;
	com.genome2d.components.GComponent.call(this);
	this._assets = model.ModelLocator.initialize().assets;
	this._registry = model.ModelLocator.initialize().registry;
	this._registry.playerComponent = this;
};
$hxClasses["components.PlayerShipComponent"] = components.PlayerShipComponent;
components.PlayerShipComponent.__name__ = ["components","PlayerShipComponent"];
components.PlayerShipComponent.__super__ = com.genome2d.components.GComponent;
components.PlayerShipComponent.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
		this._shootComponent = js.Boot.__cast(this.g2d_node.getComponent(components.PlayerShoot) , components.PlayerShoot);
	}
	,_update: function(deltaTime) {
		if(this.exploding) {
			this._explosionDelay--;
			if(this._explosionDelay <= 0) {
				this._explosionDelay = this._explosionTimer;
				this._respawn();
			}
		}
		if(this._invulnerableTimer > 0) this._invulnerableTimer--;
	}
	,_respawn: function() {
		this._registry.player.booster.forceBurst();
		this.exploding = false;
		this._shootComponent.canFire = true;
		this._registry.player.graphics.g2d_node.g2d_transform.visible = true;
		this._registry.player.booster.g2d_node.g2d_transform.visible = true;
		this._registry.player.booster.emit = true;
		this._invulnerableTimer = 120;
	}
	,explode: function() {
		if(this.exploding || this._invulnerableTimer > 0) return;
		this.exploding = true;
		this._registry.player.graphics.g2d_node.g2d_transform.visible = false;
		this._registry.player.booster.g2d_node.g2d_transform.visible = false;
		this._shootComponent.canFire = false;
		if(this._explosionEmitter == null) {
			this._explosionEmitter = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.particles.GSimpleParticleSystem,"explosion_emitter");
			this._explosionEmitter.texture = this._assets.atlas.getSubTexture("Particle");
			this._explosionEmitter.burst = true;
			this._explosionEmitter.emit = true;
			this._explosionEmitter.useWorldSpace = true;
			this._explosionEmitter.emission = 64;
			this._explosionEmitter.energy = 0.5;
			this._explosionEmitter.energyVariance = 0.2;
			this._explosionEmitter.dispersionAngleVariance = Math.PI * 2;
			this._explosionEmitter.initialVelocity = 100;
			this._explosionEmitter.initialVelocityVariance = 100;
			this._explosionEmitter.initialScale = 0.7;
			this._explosionEmitter.initialScaleVariance = 0.3;
			this._explosionEmitter.endScale = 0.2;
			this._explosionEmitter.endScaleVariance = 0.1;
			this._explosionEmitter.initialAlpha = 1;
			this._explosionEmitter.initialBlue = 2;
			this._explosionEmitter.initialGreen = 1;
			this._explosionEmitter.initialRed = 4;
			this._explosionEmitter.endAlpha = 0;
			this._explosionEmitter.endBlue = 1;
			this._explosionEmitter.endGreen = 2;
			this._explosionEmitter.endRed = 4;
			this.g2d_node.addChild(this._explosionEmitter.g2d_node);
		} else this._explosionEmitter.forceBurst();
	}
	,__class__: components.PlayerShipComponent
});
components.PlayerShoot = function() {
	this.canFire = true;
	this._intervalTime = 10;
	com.genome2d.components.GComponent.call(this);
	this._registry = model.ModelLocator.initialize().registry;
	this._texture = model.ModelLocator.initialize().assets.atlas.getSubTexture("PlayerBullet");
	this._delay = this._intervalTime;
	com.genome2d.Genome2D.getInstance().getContext().onMouseSignal.add($bind(this,this._onMouse));
};
$hxClasses["components.PlayerShoot"] = components.PlayerShoot;
components.PlayerShoot.__name__ = ["components","PlayerShoot"];
components.PlayerShoot.__super__ = com.genome2d.components.GComponent;
components.PlayerShoot.prototype = $extend(com.genome2d.components.GComponent.prototype,{
	init: function() {
		((function($this) {
			var $r;
			if(com.genome2d.node.GNode.g2d_core == null) com.genome2d.node.GNode.g2d_core = com.genome2d.Genome2D.getInstance();
			$r = com.genome2d.node.GNode.g2d_core;
			return $r;
		}(this))).get_onUpdate().add($bind(this,this._update));
	}
	,_onMouse: function(e) {
		var _g = e.type;
		switch(_g) {
		case "mouseDown":
			this._mouseDown = true;
			break;
		case "mouseUp":
			this._mouseDown = false;
			break;
		}
	}
	,_update: function(deltaTime) {
		if(this._delay > 0) this._delay--; else if(this._mouseDown && this.canFire) this._shoot();
	}
	,_shoot: function() {
		this._delay = this._intervalTime;
		var b = new entities.PlayerBullet(this._registry,this._texture,this.g2d_node.g2d_transform.g2d_localX - 10,this.g2d_node.g2d_transform.g2d_localY);
		var c = new entities.PlayerBullet(this._registry,this._texture,this.g2d_node.g2d_transform.g2d_localX + 14,this.g2d_node.g2d_transform.g2d_localY);
	}
	,__class__: components.PlayerShoot
});
var entities = {};
entities.Background = function() {
	com.genome2d.node.GNode.call(this,"background_stars");
	var assets = model.ModelLocator.initialize().assets;
	var registry = model.ModelLocator.initialize().registry;
	this.graphics1 = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.GSprite,"bg_graphics");
	this.graphics1.texture = assets.atlas.getSubTexture("Background");
	this.addChild(this.graphics1.g2d_node);
	this.graphics2 = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.GSprite,"bg_graphics");
	this.graphics2.texture = assets.atlas.getSubTexture("Background");
	this.addChild(this.graphics2.g2d_node);
	this.graphics2.g2d_node.g2d_transform.set_y(-registry.viewRect.height);
	this.addComponent(components.BackgroundMovement);
};
$hxClasses["entities.Background"] = entities.Background;
entities.Background.__name__ = ["entities","Background"];
entities.Background.__super__ = com.genome2d.node.GNode;
entities.Background.prototype = $extend(com.genome2d.node.GNode.prototype,{
	__class__: entities.Background
});
entities.EnemyShip = function(registry,texture) {
	com.genome2d.node.GNode.call(this,"enemy_ship");
	this.graphics = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.GSprite,"enemy_ship_graphics");
	this.graphics.texture = texture;
	this.addChild(this.graphics.g2d_node);
	this.g2d_transform.set_x((Math.random() * registry.viewRect.width - registry.viewRect.width / 2) * 0.9);
	this.g2d_transform.set_y(-registry.viewRect.height / 2 - 50);
	registry.gameState.addChild(this);
	registry.enemies.push(this);
	if(Math.round(Math.random()) == 0) this.movementType = model.MovementTypes.SINUSOIDAL; else this.movementType = model.MovementTypes.STREIGHT;
	this.addComponent(components.EnemyShipComponent);
};
$hxClasses["entities.EnemyShip"] = entities.EnemyShip;
entities.EnemyShip.__name__ = ["entities","EnemyShip"];
entities.EnemyShip.__super__ = com.genome2d.node.GNode;
entities.EnemyShip.prototype = $extend(com.genome2d.node.GNode.prototype,{
	__class__: entities.EnemyShip
});
entities.Player = function(id) {
	com.genome2d.node.GNode.call(this,id);
	var assets = model.ModelLocator.initialize().assets;
	model.ModelLocator.initialize().registry.player = this;
	this.booster = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.particles.GSimpleParticleSystem,"booster_emitter");
	this.booster.texture = assets.atlas.getSubTexture("Particle");
	this.booster.emit = true;
	this.booster.useWorldSpace = true;
	this.booster.blendMode = 2;
	this.booster.emission = 32;
	this.booster.energy = 0.3;
	this.booster.dispersionAngle = Math.PI / 2;
	this.booster.initialVelocity = 400;
	this.booster.initialVelocityVariance = 100;
	this.booster.initialScale = 0.9;
	this.booster.initialScaleVariance = 0.2;
	this.booster.endScale = 0.9;
	this.booster.endScaleVariance = 0.2;
	this.booster.initialAlpha = 1;
	this.booster.initialBlue = 2;
	this.booster.initialGreen = 1;
	this.booster.initialRed = 4;
	this.booster.endAlpha = 0;
	this.booster.endBlue = 1;
	this.booster.endGreen = 2;
	this.booster.endRed = 4;
	this.booster.g2d_node.g2d_transform.setPosition(0,30);
	this.addChild(this.booster.g2d_node);
	this.graphics = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.GSprite,"player_graphics");
	this.graphics.texture = assets.atlas.getSubTexture("PlayerSpaceship");
	this.addChild(this.graphics.g2d_node);
	this.addComponent(components.FollowMouseComponent);
	this.addComponent(components.PlayerShoot);
	this.addComponent(components.PlayerShipComponent);
};
$hxClasses["entities.Player"] = entities.Player;
entities.Player.__name__ = ["entities","Player"];
entities.Player.__super__ = com.genome2d.node.GNode;
entities.Player.prototype = $extend(com.genome2d.node.GNode.prototype,{
	__class__: entities.Player
});
entities.PlayerBullet = function(registry,texture,_x,_y) {
	com.genome2d.node.GNode.call(this,"player_bullet");
	this.g2d_transform.set_x(_x);
	this.g2d_transform.set_y(_y);
	this.graphics = com.genome2d.node.factory.GNodeFactory.createNodeWithComponent(com.genome2d.components.renderables.GSprite,"player_bullet_graphic");
	this.graphics.texture = texture;
	this.addChild(this.graphics.g2d_node);
	this.addComponent(components.PlayerBulletComponent);
	registry.gameState.addChild(this);
	registry.playerBullets.push(this);
};
$hxClasses["entities.PlayerBullet"] = entities.PlayerBullet;
entities.PlayerBullet.__name__ = ["entities","PlayerBullet"];
entities.PlayerBullet.__super__ = com.genome2d.node.GNode;
entities.PlayerBullet.prototype = $extend(com.genome2d.node.GNode.prototype,{
	__class__: entities.PlayerBullet
});
var haxe = {};
haxe.IMap = function() { };
$hxClasses["haxe.IMap"] = haxe.IMap;
haxe.IMap.__name__ = ["haxe","IMap"];
haxe.IMap.prototype = {
	__class__: haxe.IMap
};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var _g_head = this.params.h;
			var _g_val = null;
			while(_g_head != null) {
				var p;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				p = _g_val;
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var _g_head1 = this.headers.h;
		var _g_val1 = null;
		while(_g_head1 != null) {
			var h1;
			_g_val1 = _g_head1[0];
			_g_head1 = _g_head1[1];
			h1 = _g_val1;
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [haxe.IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [haxe.IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
haxe.xml = {};
haxe.xml.Parser = function() { };
$hxClasses["haxe.xml.Parser"] = haxe.xml.Parser;
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js.Boot.__nativeClassName(o);
		if(name != null) return js.Boot.__resolveNativeClass(name);
		return null;
	}
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js.Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Boot.__nativeClassName = function(o) {
	var name = js.Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js.Boot.__isNativeObj = function(o) {
	return js.Boot.__nativeClassName(o) != null;
};
js.Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
js.Browser = function() { };
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var model = {};
model.Assets = function() {
	this.assetsLoaded = new msignal.Signal0();
	this._assetManager = new com.genome2d.assets.GAssetManager();
	this._assetManager.addUrl("atlas_gfx","assets/Atlas.png");
	this._assetManager.addUrl("atlas_xml","assets/Atlas.xml");
	this._assetManager.g2d_onAllLoaded.add($bind(this,this._assetsInitializedHandler));
	this._assetManager.load();
	console.log("load assets");
};
$hxClasses["model.Assets"] = model.Assets;
model.Assets.__name__ = ["model","Assets"];
model.Assets.prototype = {
	_assetsInitializedHandler: function() {
		console.log("assets loaded");
		this.atlas = com.genome2d.textures.factories.GTextureAtlasFactory.createFromAssets("atlas",this._assetManager.getAssetById("atlas_gfx"),this._assetManager.getAssetById("atlas_xml"));
		this.assetsLoaded.dispatch();
	}
	,__class__: model.Assets
};
model.ModelLocator = function() {
	this.assets = new model.Assets();
	this.registry = new model.Registry();
	if(model.ModelLocator._instance != null) console.log("Error:ModelLocator already initialised.");
	if(model.ModelLocator._instance == null) model.ModelLocator._instance = this;
};
$hxClasses["model.ModelLocator"] = model.ModelLocator;
model.ModelLocator.__name__ = ["model","ModelLocator"];
model.ModelLocator.instance = function() {
	return model.ModelLocator.initialize();
};
model.ModelLocator.initialize = function() {
	if(model.ModelLocator._instance == null) model.ModelLocator._instance = new model.ModelLocator();
	return model.ModelLocator._instance;
};
model.ModelLocator.prototype = {
	__class__: model.ModelLocator
};
model.MovementTypes = function() { };
$hxClasses["model.MovementTypes"] = model.MovementTypes;
model.MovementTypes.__name__ = ["model","MovementTypes"];
model.Registry = function() {
	this.enemies = new Array();
	this.playerBullets = new Array();
};
$hxClasses["model.Registry"] = model.Registry;
model.Registry.__name__ = ["model","Registry"];
model.Registry.prototype = {
	__class__: model.Registry
};
var msignal = {};
msignal.Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
$hxClasses["msignal.Signal"] = msignal.Signal;
msignal.Signal.__name__ = ["msignal","Signal"];
msignal.Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal.SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw "You cannot addOnce() then add() the same listener without removing the relationship first.";
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: msignal.Signal
	,__properties__: {get_numListeners:"get_numListeners"}
};
msignal.Signal0 = function() {
	msignal.Signal.call(this);
};
$hxClasses["msignal.Signal0"] = msignal.Signal0;
msignal.Signal0.__name__ = ["msignal","Signal0"];
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot0(this,listener,once,priority);
	}
	,__class__: msignal.Signal0
});
msignal.Signal1 = function(type) {
	msignal.Signal.call(this,[type]);
};
$hxClasses["msignal.Signal1"] = msignal.Signal1;
msignal.Signal1.__name__ = ["msignal","Signal1"];
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot1(this,listener,once,priority);
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
$hxClasses["msignal.Signal2"] = msignal.Signal2;
msignal.Signal2.__name__ = ["msignal","Signal2"];
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot2(this,listener,once,priority);
	}
	,__class__: msignal.Signal2
});
msignal.Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
$hxClasses["msignal.Slot"] = msignal.Slot;
msignal.Slot.__name__ = ["msignal","Slot"];
msignal.Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,__class__: msignal.Slot
	,__properties__: {set_listener:"set_listener"}
};
msignal.Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
$hxClasses["msignal.Slot0"] = msignal.Slot0;
msignal.Slot0.__name__ = ["msignal","Slot0"];
msignal.Slot0.__super__ = msignal.Slot;
msignal.Slot0.prototype = $extend(msignal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal.Slot0
});
msignal.Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
$hxClasses["msignal.Slot1"] = msignal.Slot1;
msignal.Slot1.__name__ = ["msignal","Slot1"];
msignal.Slot1.__super__ = msignal.Slot;
msignal.Slot1.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal.Slot1
});
msignal.Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
$hxClasses["msignal.Slot2"] = msignal.Slot2;
msignal.Slot2.__name__ = ["msignal","Slot2"];
msignal.Slot2.__super__ = msignal.Slot;
msignal.Slot2.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal.Slot2
});
msignal.SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal.SlotList.NIL != null) throw "Parameters head and tail are null. Use the NIL element instead.";
		this.nonEmpty = false;
	} else if(head == null) throw "Parameter head cannot be null."; else {
		this.head = head;
		if(tail == null) this.tail = msignal.SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
$hxClasses["msignal.SlotList"] = msignal.SlotList;
msignal.SlotList.__name__ = ["msignal","SlotList"];
msignal.SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal.SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		if(this.tail == msignal.SlotList.NIL) return new msignal.SlotList(slot).prepend(this.head);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: msignal.SlotList
	,__properties__: {get_length:"get_length"}
};
var states = {};
states.GameState = function(id) {
	com.genome2d.node.GNode.call(this,id);
	var registry = model.ModelLocator.initialize().registry;
	registry.gameState = this;
	this._player = new entities.Player("player");
	this.addChild(this._player);
	this.addComponent(components.EnemySpawner);
};
$hxClasses["states.GameState"] = states.GameState;
states.GameState.__name__ = ["states","GameState"];
states.GameState.__super__ = com.genome2d.node.GNode;
states.GameState.prototype = $extend(com.genome2d.node.GNode.prototype,{
	__class__: states.GameState
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
msignal.SlotList.NIL = new msignal.SlotList(null,null);
com.genome2d.Genome2D.VERSION = "1.0.277";
com.genome2d.Genome2D.g2d_instantiable = false;
com.genome2d.assets.GAssetManager.PATH_REGEX = new EReg("([^\\?/\\\\]+?)(?:\\.([\\w\\-]+))?(?:\\?.*)?$","");
com.genome2d.components.GCameraController.PROTOTYPE_PROPERTIES = [];
com.genome2d.components.GTransform.__meta__ = { fields : { useWorldSpace : { prototype : null}, useWorldColor : { prototype : null}, x : { prototype : null}, y : { prototype : null}, scaleX : { prototype : null}, scaleY : { prototype : null}, rotation : { prototype : null}, alpha : { prototype : null}}};
com.genome2d.components.GTransform.PROTOTYPE_PROPERTIES = ["useWorldSpace|Bool","useWorldColor|Bool","x|Float","y|Float","scaleX|Float","scaleY|Float","rotation|Float","alpha|Float"];
com.genome2d.components.renderables.GTexturedQuad.PROTOTYPE_PROPERTIES = [];
com.genome2d.components.renderables.GSprite.__meta__ = { fields : { textureId : { prototype : null}}};
com.genome2d.components.renderables.GSprite.PROTOTYPE_PROPERTIES = ["textureId|String"];
com.genome2d.components.renderables.particles.GSimpleParticle.g2d_instanceCount = 0;
com.genome2d.components.renderables.particles.GSimpleParticleSystem.__meta__ = { fields : { settings : { prototype : null}}};
com.genome2d.components.renderables.particles.GSimpleParticleSystem.PROTOTYPE_PROPERTIES = ["settings|String"];
com.genome2d.context.GBlendMode.blendFactors = [[[1,0],[770,771],[770,32970],[32968,771],[770,1],[0,771]],[[1,0],[1,771],[1,1],[32968,771],[1,769],[0,771]]];
com.genome2d.context.GBlendMode.NONE = 0;
com.genome2d.context.GBlendMode.NORMAL = 1;
com.genome2d.context.GBlendMode.ADD = 2;
com.genome2d.context.GBlendMode.MULTIPLY = 3;
com.genome2d.context.GBlendMode.SCREEN = 4;
com.genome2d.context.GBlendMode.ERASE = 5;
com.genome2d.context.GContextFeature.STENCIL_MASKING = 1;
com.genome2d.context.GContextFeature.RECTANGLE_TEXTURES = 2;
com.genome2d.context.stats.GStats.fps = 0;
com.genome2d.context.stats.GStats.drawCalls = 0;
com.genome2d.context.stats.GStats.nodeCount = 0;
com.genome2d.context.stats.GStats.x = 0;
com.genome2d.context.stats.GStats.y = 0;
com.genome2d.context.stats.GStats.scaleX = 1;
com.genome2d.context.stats.GStats.scaleY = 1;
com.genome2d.context.stats.GStats.visible = false;
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.BATCH_SIZE = 30;
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.TRANSFORM_PER_VERTEX = 3;
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.TRANSFORM_PER_VERTEX_ALPHA = 4;
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.VERTEX_SHADER_CODE_ALPHA = "\r\n\t\t\tuniform mat4 projectionMatrix;\r\n\t\t\tuniform vec4 transforms[" + 120 + "];\r\n\r\n\t\t\tattribute vec2 aPosition;\r\n\t\t\tattribute vec2 aTexCoord;\r\n\t\t\tattribute vec4 aConstantIndex;\r\n\r\n\t\t\tvarying vec2 vTexCoord;\r\n\t\t\tvarying vec4 vColor;\r\n\r\n\t\t\tvoid main(void)\r\n\t\t\t{\r\n\t\t\t\tgl_Position = vec4(aPosition.x*transforms[int(aConstantIndex.z)].x, aPosition.y*transforms[int(aConstantIndex.z)].y, 0, 1);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x - transforms[int(aConstantIndex.z)].z, gl_Position.y - transforms[int(aConstantIndex.z)].w, 0, 1);\r\n\t\t\t\tfloat c = cos(transforms[int(aConstantIndex.x)].z);\r\n\t\t\t\tfloat s = sin(transforms[int(aConstantIndex.x)].z);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x * c - gl_Position.y * s, gl_Position.x * s + gl_Position.y * c, 0, 1);\r\n\t\t\t\tgl_Position = vec4(gl_Position.x+transforms[int(aConstantIndex.x)].x, gl_Position.y+transforms[int(aConstantIndex.x)].y, 0, 1);\r\n\t\t\t\tgl_Position = gl_Position * projectionMatrix;\r\n\r\n\t\t\t\tvTexCoord = vec2(aTexCoord.x*transforms[int(aConstantIndex.y)].z+transforms[int(aConstantIndex.y)].x, aTexCoord.y*transforms[int(aConstantIndex.y)].w+transforms[int(aConstantIndex.y)].y);\r\n\t\t\t\tvColor = transforms[int(aConstantIndex.w)];\r\n\t\t\t}\r\n\t\t ";
com.genome2d.context.webgl.renderers.GQuadTextureShaderRenderer.FRAGMENT_SHADER_CODE_ALPHA = "\r\n\t\t\t//#ifdef GL_ES\r\n\t\t\tprecision lowp float;\r\n\t\t\t//#endif\r\n\r\n\t\t\tvarying vec2 vTexCoord;\r\n\t\t\tvarying vec4 vColor;\r\n\r\n\t\t\tuniform sampler2D sTexture;\r\n\r\n\t\t\tvoid main(void)\r\n\t\t\t{\r\n\t\t\t\tgl_FragColor = texture2D(sTexture, vTexCoord) * vColor;\r\n\t\t\t}\r\n\t\t";
com.genome2d.node.GNode.g2d_nodeCount = 0;
com.genome2d.postprocesses.GPostProcess.g2d_count = 0;
com.genome2d.signals.GMouseSignalType.MOUSE_DOWN = "mouseDown";
com.genome2d.signals.GMouseSignalType.MOUSE_MOVE = "mouseMove";
com.genome2d.signals.GMouseSignalType.MOUSE_UP = "mouseUp";
com.genome2d.signals.GMouseSignalType.MOUSE_OVER = "mouseOver";
com.genome2d.signals.GMouseSignalType.MOUSE_OUT = "mouseOut";
com.genome2d.signals.GMouseSignalType.RIGHT_MOUSE_DOWN = "rightmousedown";
com.genome2d.signals.GMouseSignalType.RIGHT_MOUSE_UP = "rightmouseup";
com.genome2d.textures.GContextTexture.defaultFilteringType = 1;
com.genome2d.textures.GContextTexture.g2d_instanceCount = 0;
com.genome2d.textures.GTextureFilteringType.NEAREST = 0;
com.genome2d.textures.GTextureFilteringType.LINEAR = 1;
com.genome2d.textures.GTextureSourceType.IMAGE = 0;
com.genome2d.textures.GTextureType.STANDALONE = 0;
com.genome2d.textures.GTextureType.SUBTEXTURE = 1;
com.genome2d.textures.GTextureType.ATLAS = 2;
components.BackgroundMovement.PROTOTYPE_PROPERTIES = [];
components.EnemyShipComponent.PROTOTYPE_PROPERTIES = [];
components.EnemySpawner.PROTOTYPE_PROPERTIES = [];
components.FollowMouseComponent.PROTOTYPE_PROPERTIES = [];
components.PlayerBulletComponent.PROTOTYPE_PROPERTIES = [];
components.PlayerShipComponent.PROTOTYPE_PROPERTIES = [];
components.PlayerShoot.PROTOTYPE_PROPERTIES = [];
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
js.Boot.__toStr = {}.toString;
model.MovementTypes.SINUSOIDAL = "sinusoidal_movemen";
model.MovementTypes.STREIGHT = "streight_movemen";
Main.main();
})();
