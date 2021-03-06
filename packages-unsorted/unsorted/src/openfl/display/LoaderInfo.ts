import DisplayObject from "./DisplayObject";
import Loader from "./Loader";
import EventDispatcher from "../events/EventDispatcher";
import Event from "../events/Event";
import ProgressEvent from "../events/ProgressEvent";
import UncaughtErrorEvents from "../events/UncaughtErrorEvents";
import ApplicationDomain from "../system/ApplicationDomain";
import ByteArray from "../utils/ByteArray";

/**
	The LoaderInfo class provides information about a loaded SWF file or a
	loaded image file(JPEG, GIF, or PNG). LoaderInfo objects are available for
	any display object. The information provided includes load progress, the
	URLs of the loader and loaded content, the number of bytes total for the
	media, and the nominal height and width of the media.

	You can access LoaderInfo objects in two ways:

	* The `contentLoaderInfo` property of a openfl.display.Loader
	object -  The `contentLoaderInfo` property is always available
	for any Loader object. For a Loader object that has not called the
	`load()` or `loadBytes()` method, or that has not
	sufficiently loaded, attempting to access many of the properties of the
	`contentLoaderInfo` property throws an error.
	* The `loaderInfo` property of a display object.

	The `contentLoaderInfo` property of a Loader object provides
	information about the content that the Loader object is loading, whereas
	the `loaderInfo` property of a DisplayObject provides
	information about the root SWF file for that display object.

	When you use a Loader object to load a display object(such as a SWF
	file or a bitmap), the `loaderInfo` property of the display
	object is the same as the `contentLoaderInfo` property of the
	Loader object(`DisplayObject.loaderInfo =
	Loader.contentLoaderInfo`). Because the instance of the main class of
	the SWF file has no Loader object, the `loaderInfo` property is
	the only way to access the LoaderInfo for the instance of the main class of
	the SWF file.

	The following diagram shows the different uses of the LoaderInfo
	object - for the instance of the main class of the SWF file, for the
	`contentLoaderInfo` property of a Loader object, and for the
	`loaderInfo` property of a loaded object:

	When a loading operation is not complete, some properties of the
	`contentLoaderInfo` property of a Loader object are not
	available. You can obtain some properties, such as
	`bytesLoaded`, `bytesTotal`, `url`,
	`loaderURL`, and `applicationDomain`. When the
	`loaderInfo` object dispatches the `init` event, you
	can access all properties of the `loaderInfo` object and the
	loaded image or SWF file.

	**Note:** All properties of LoaderInfo objects are read-only.

	The `EventDispatcher.dispatchEvent()` method is not
	applicable to LoaderInfo objects. If you call `dispatchEvent()`
	on a LoaderInfo object, an IllegalOperationError exception is thrown.

	@event complete   Dispatched when data has loaded successfully. In other
						words, it is dispatched when all the content has been
						downloaded and the loading has finished. The
						`complete` event is always dispatched after
						the `init` event. The `init` event
						is dispatched when the object is ready to access, though
						the content may still be downloading.
	@event httpStatus Dispatched when a network request is made over HTTP and
						an HTTP status code can be detected.
	@event init       Dispatched when the properties and methods of a loaded
						SWF file are accessible and ready for use. The content,
						however, can still be downloading. A LoaderInfo object
						dispatches the `init` event when the following
						conditions exist:

						* All properties and methods associated with the
						loaded object and those associated with the LoaderInfo
						object are accessible.
						* The constructors for all child objects have
						completed.
						* All ActionScript code in the first frame of the
						loaded SWF's main timeline has been executed.

						For example, an `Event.INIT` is dispatched
						when the first frame of a movie or animation is loaded.
						The movie is then accessible and can be added to the
						display list. The complete movie, however, can take
						longer to download. The `Event.COMPLETE` is
						only dispatched once the full movie is loaded.

						The `init` event always precedes the
						`complete` event.
	@event ioError    Dispatched when an input or output error occurs that
						causes a load operation to fail.
	@event open       Dispatched when a load operation starts.
	@event progress   Dispatched when data is received as the download
						operation progresses.
	@event unload     Dispatched by a LoaderInfo object whenever a loaded
						object is removed by using the `unload()`
						method of the Loader object, or when a second load is
						performed by the same Loader object and the original
						content is removed prior to the load beginning.
**/
export default class LoaderInfo extends EventDispatcher
{
	protected static __rootURL: string = (document != null ? document.URL : "");

	// /** @hidden */ @:dox(hide) public actionScriptVersion (default, never):openfl.display.ActionScriptVersion;

	protected __applicationDomain: ApplicationDomain;
	protected __bytes: ByteArray;
	protected __bytesLoaded: number;
	protected __bytesTotal: number;
	protected __childAllowsParent: boolean;
	protected __completed: boolean;
	protected __content: DisplayObject;
	protected __contentType: string;
	protected __frameRate: number;
	protected __height: number;
	protected __loader: Loader;
	protected __loaderURL: string;
	protected __parameters: Object;
	protected __parentAllowsChild: boolean;
	protected __sameDomain: boolean;
	protected __sharedEvents: EventDispatcher;
	protected __uncaughtErrorEvents: UncaughtErrorEvents;
	protected __url: string;
	protected __width: number;

	protected constructor()
	{
		super();

		this.__applicationDomain = ApplicationDomain.currentDomain;
		this.__bytesLoaded = 0;
		this.__bytesTotal = 0;
		this.__childAllowsParent = true;
		this.__parameters = {};
	}

	public static create(loader: Loader): LoaderInfo
	{
		var loaderInfo = new LoaderInfo();
		loaderInfo.__uncaughtErrorEvents = new UncaughtErrorEvents();

		if (loader != null)
		{
			loaderInfo.__loader = loader;
		}
		else
		{
			loaderInfo.__url = this.__rootURL;
		}

		return loaderInfo;
	}

	// /** @hidden */ @:dox(hide) public static getLoaderInfoByDefinition (object:Dynamic):LoaderInfo;
	protected __complete(): void
	{
		if (!this.__completed)
		{
			if (this.__bytesLoaded < this.__bytesTotal)
			{
				this.__bytesLoaded = this.__bytesTotal;
			}

			this.__update(this.__bytesLoaded, this.__bytesTotal);
			this.__completed = true;

			this.dispatchEvent(new Event(Event.COMPLETE));
		}
	}

	protected __update(bytesLoaded: number, bytesTotal: number): void
	{
		this.__bytesLoaded = bytesLoaded;
		this.__bytesTotal = bytesTotal;

		this.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, bytesLoaded, bytesTotal));
	}

	// Get & Set Methods

	/**
		When an external SWF file is loaded, all ActionScript 3.0 definitions
		contained in the loaded class are stored in the
		`applicationDomain` property.

		All code in a SWF file is defined to exist in an application domain.
		The current application domain is where your main application runs. The
		system domain contains all application domains, including the current
		domain and all classes used by Flash Player or Adobe AIR.

		All application domains, except the system domain, have an associated
		parent domain. The parent domain of your main application's
		`applicationDomain` is the system domain. Loaded classes are
		defined only when their parent doesn't already define them. You cannot
		override a loaded class definition with a newer definition.

		For usage examples of application domains, see the "Client System
		Environment" chapter in the _ActionScript 3.0 Developer's Guide_.

		@throws SecurityError This security sandbox of the caller is not allowed
								to access this ApplicationDomain.
	**/
	public get applicationDomain(): ApplicationDomain
	{
		return this.__applicationDomain;
	}

	/**
		The bytes associated with a LoaderInfo object.

		@throws SecurityError If the object accessing this API is prevented from
								accessing the loaded object due to security
								restrictions. This situation can occur, for
								instance, when a Loader object attempts to access
								the `contentLoaderInfo.content` property
								and it is not granted security permission to access
								the loaded content.

								For more information related to security, see the
								Flash Player Developer Center Topic:
								[Security](http://www.adobe.com/go/devnet_security_en).
	**/
	public get bytes(): ByteArray
	{
		return this.__bytes;
	}

	/**
		The number of bytes that are loaded for the media. When this number equals
		the value of `bytesTotal`, all of the bytes are loaded.
	**/
	public get bytesLoaded(): number
	{
		return this.__bytesLoaded;
	}

	/**
		The number of compressed bytes in the entire media file.

		Before the first `progress` event is dispatched by this
		LoaderInfo object's corresponding Loader object, `bytesTotal`
		is 0. After the first `progress` event from the Loader object,
		`bytesTotal` reflects the actual number of bytes to be
		downloaded.
	**/
	public get bytesTotal(): number
	{
		return this.__bytesTotal;
	}

	/**
		Expresses the trust relationship from content(child) to the Loader
		(parent). If the child has allowed the parent access, `true`;
		otherwise, `false`. This property is set to `true`
		if the child object has called the `allowDomain()` method to
		grant permission to the parent domain or if a URL policy is loaded at the
		child domain that grants permission to the parent domain. If child and
		parent are in the same domain, this property is set to `true`.

		For more information related to security, see the Flash Player
		Developer Center Topic: [Security](http://www.adobe.com/go/devnet_security_en).

		@throws Error Thrown if the file is not downloaded sufficiently to
						retrieve the requested information.
	**/
	public get childAllowsParent(): boolean
	{
		return this.__childAllowsParent;
	}

	// /** @hidden */ @:dox(hide) @:require(flash11_4) public childSandboxBridge:Dynamic;

	/**
		The loaded object associated with this LoaderInfo object.

		@throws SecurityError If the object accessing this API is prevented from
								accessing the loaded object due to security
								restrictions. This situation can occur, for
								instance, when a Loader object attempts to access
								the `contentLoaderInfo.content` property
								and it is not granted security permission to access
								the loaded content.

								For more information related to security, see the
								Flash Player Developer Center Topic:
								[Security](http://www.adobe.com/go/devnet_security_en).
	**/
	public get content(): DisplayObject
	{
		return this.__content;
	}

	/**
		The MIME type of the loaded file. The value is `null` if not
		enough of the file has loaded in order to determine the type. The
		following list gives the possible values:

		* `"application/x-shockwave-flash"`
		* `"image/jpeg"`
		* `"image/gif"`
		* `"image/png"`
	**/
	public get contentType(): string
	{
		return this.__contentType;
	}

	/**
		The nominal frame rate, in frames per second, of the loaded SWF file. This
		number is often an integer, but need not be.

		This value may differ from the actual frame rate in use. Flash Player
		or Adobe AIR only uses a single frame rate for all loaded SWF files at any
		one time, and this frame rate is determined by the nominal frame rate of
		the main SWF file. Also, the main frame rate may not be able to be
		achieved, depending on hardware, sound synchronization, and other
		factors.

		@throws Error If the file is not downloaded sufficiently to retrieve the
						requested information.
		@throws Error If the file is not a SWF file.
	**/
	public get frameRate(): number
	{
		return this.__frameRate;
	}

	/**
		The nominal height of the loaded file. This value might differ from the
		actual height at which the content is displayed, since the loaded content
		or its parent display objects might be scaled.

		@throws Error If the file is not downloaded sufficiently to retrieve the
						requested information.
	**/
	public get height(): number
	{
		return this.__height;
	}

	// /** @hidden */ @:dox(hide) @:require(flash10_1) public isURLInaccessible (default, null):Bool;

	/**
		The Loader object associated with this LoaderInfo object. If this
		LoaderInfo object is the `loaderInfo` property of the instance
		of the main class of the SWF file, no Loader object is associated.

		@throws SecurityError If the object accessing this API is prevented from
								accessing the Loader object because of security
								restrictions. This can occur, for instance, when a
								loaded SWF file attempts to access its
								`loaderInfo.loader` property and it is
								not granted security permission to access the
								loading SWF file.

								For more information related to security, see the
								Flash Player Developer Center Topic:
								[Security](http://www.adobe.com/go/devnet_security_en).
	**/
	public get loader(): Loader
	{
		return this.__loader;
	}

	/**
		The URL of the SWF file that initiated the loading of the media described
		by this LoaderInfo object. For the instance of the main class of the SWF
		file, this URL is the same as the SWF file's own URL.
	**/
	public get loaderURL(): string
	{
		return this.__loaderURL;
	}

	/**
		An object that contains name-value pairs that represent the parameters
		provided to the loaded SWF file.

		You can use a `for-in` loop to extract all the names and
		values from the `parameters` object.

		The two sources of parameters are: the query string in the URL of the
		main SWF file, and the value of the `FlashVars` HTML parameter
		(this affects only the main SWF file).

		The `parameters` property replaces the ActionScript 1.0 and
		2.0 technique of providing SWF file parameters as properties of the main
		timeline.

		The value of the `parameters` property is null for Loader
		objects that contain SWF files that use ActionScript 1.0 or 2.0. It is
		only non-null for Loader objects that contain SWF files that use
		ActionScript 3.0.
	**/
	public get parameters(): Object
	{
		return this.__parameters;
	}

	/**
		Expresses the trust relationship from Loader(parent) to the content
		(child). If the parent has allowed the child access, `true`;
		otherwise, `false`. This property is set to `true`
		if the parent object called the `allowDomain()` method to grant
		permission to the child domain or if a URL policy file is loaded at the
		parent domain granting permission to the child domain. If child and parent
		are in the same domain, this property is set to `true`.

		For more information related to security, see the Flash Player
		Developer Center Topic: [Security](http://www.adobe.com/go/devnet_security_en).

		@throws Error Thrown if the file is not downloaded sufficiently to
						retrieve the requested information.
	**/
	public get parentAllowsChild(): boolean
	{
		return this.__parentAllowsChild;
	}

	// /** @hidden */ @:dox(hide) @:require(flash11_4) public parentSandboxBridge:Dynamic;

	/**
		Expresses the domain relationship between the loader and the content:
		`true` if they have the same origin domain; `false`
		otherwise.

		@throws Error Thrown if the file is not downloaded sufficiently to
						retrieve the requested information.
	**/
	public get sameDomain(): boolean
	{
		return this.__sameDomain;
	}

	/**
		An EventDispatcher instance that can be used to exchange events across
		security boundaries. Even when the Loader object and the loaded content
		originate from security domains that do not trust one another, both can
		access `sharedEvents` and send and receive events via this
		object.
	**/
	public get sharedEvents(): EventDispatcher
	{
		return this.__sharedEvents;
	}

	// /** @hidden */ @:dox(hide) public swfVersion (default, null):UInt;

	/**
		An object that dispatches an `uncaughtError` event when an
		unhandled error occurs in code in this LoaderInfo object's SWF file. An
		uncaught error happens when an error is thrown outside of any
		`try..catch` blocks or when an ErrorEvent object is dispatched
		with no registered listeners.

		This property is created when the SWF associated with this LoaderInfo
		has finished loading. Until then the `uncaughtErrorEvents`
		property is `null`. In an ActionScript-only project, you can
		access this property during or after the execution of the constructor
		function of the main class of the SWF file. For a Flex project, the
		`uncaughtErrorEvents` property is available after the
		`applicationComplete` event is dispatched.
	**/
	public get uncaughtErrorEvents(): UncaughtErrorEvents
	{
		return this.__uncaughtErrorEvents;
	}

	/**
		The URL of the media being loaded.

		Before the first `progress` event is dispatched by this
		LoaderInfo object's corresponding Loader object, the value of the
		`url` property might reflect only the initial URL specified in
		the call to the `load()` method of the Loader object. After the
		first `progress` event, the `url` property reflects
		the media's final URL, after any redirects and relative URLs are
		resolved.

		In some cases, the value of the `url` property is truncated;
		see the `isURLInaccessible` property for details.
	**/
	public get url(): string
	{
		return this.__url;
	}

	/**
		The nominal width of the loaded content. This value might differ from the
		actual width at which the content is displayed, since the loaded content
		or its parent display objects might be scaled.

		@throws Error If the file is not downloaded sufficiently to retrieve the
						requested information.
	**/
	public get width(): number
	{
		return this.__width;
	}
}
