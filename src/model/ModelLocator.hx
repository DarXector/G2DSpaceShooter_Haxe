package model;



/**
 * ...
 * @author Marko Ristic
 */

class ModelLocator
{
	public var model:AppModel = new AppModel();
	public var assets:Assets = new Assets();
	private static var _instance:ModelLocator;

	public function new() 
	{
		if( _instance != null ) trace( "Error:ModelLocator already initialised." );
		if( _instance == null ) _instance = this;
	}
	
	public static inline function instance():ModelLocator
	{
		return initialize();
	}
	
	public static function initialize():ModelLocator
	{
		if (_instance == null){
			_instance = new ModelLocator();
		}
		return _instance;
	}
	
}