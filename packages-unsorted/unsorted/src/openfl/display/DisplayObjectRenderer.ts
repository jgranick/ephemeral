import DisplayObjectRendererType from "../_internal/renderer/DisplayObjectRendererType";
import DisplayObjectType from "../_internal/renderer/DisplayObjectType";
import * as internal from "../_internal/utils/InternalAccess";
import Bitmap from "./Bitmap";
import BitmapData from "./BitmapData";
import BlendMode from "./BlendMode";
import DisplayObject from "./DisplayObject";
import IBitmapDrawable from "./IBitmapDrawable";
import MovieClip from "./MovieClip";
import Stage from "./Stage";
import Tilemap from "./Tilemap";
import EventDispatcher from "../events/EventDispatcher";
import ColorTransform from "../geom/ColorTransform";
import Matrix from "../geom/Matrix";
import Rectangle from "../geom/Rectangle";
import Video from "../media/Video";

export default class DisplayObjectRenderer extends EventDispatcher
{
	protected __allowSmoothing: boolean;
	protected __blendMode: BlendMode;
	protected __cleared: boolean;
	// @SuppressWarnings("checkstyle:Dynamic") protected __context:#if lime RenderContext #else Dynamic #end;
	protected __overrideBlendMode: BlendMode;
	protected __roundPixels: boolean;
	protected __stage: Stage;
	protected __transparent: boolean;
	protected __type: DisplayObjectRendererType;
	protected __worldAlpha: number;
	protected __worldColorTransform: ColorTransform;
	protected __worldTransform: Matrix;

	protected constructor()
	{
		super();

		this.__allowSmoothing = true;
		this.__worldAlpha = 1;
	}

	protected __clear(): void { }

	protected __drawBitmapData(bitmapData: BitmapData, source: IBitmapDrawable, clipRect: Rectangle): void { }

	protected __enterFrame(displayObject: DisplayObject, deltaTime: number): void
	{
		for (let child of (<internal.DisplayObject><any>displayObject).__childIterator(false))
		{
			switch ((<internal.DisplayObject><any>child).__type)
			{
				case DisplayObjectType.BITMAP:
					var bitmap: Bitmap = child as Bitmap;
					if ((<internal.Bitmap><any>bitmap).__bitmapData != null
						&& (<internal.Bitmap><any>bitmap).__bitmapData.readable
						&& (<internal.BitmapData><any>(<internal.Bitmap><any>bitmap).__bitmapData).__getVersion() != (<internal.Bitmap><any>bitmap).__imageVersion)
					{
						(<internal.DisplayObject><any>bitmap).__setRenderDirty();
					}
					break;

				case DisplayObjectType.MOVIE_CLIP:
					var movieClip: MovieClip = child as MovieClip;
					if ((<internal.MovieClip><any>movieClip).__timeline != null)
					{
						(<internal.Timeline><any>(<internal.MovieClip><any>movieClip).__timeline).__enterFrame(deltaTime);
					}
					break;

				case DisplayObjectType.TILEMAP:
					var tilemap: Tilemap = child as Tilemap;
					if ((<internal.Tile><any>(<internal.Tilemap><any>tilemap).__group).__dirty)
					{
						(<internal.DisplayObject><any>tilemap).__setRenderDirty();
					}
					break;

				case DisplayObjectType.VIDEO:
					var video: Video = child as Video;
					if ((<internal.DisplayObject><any>video).__renderable && (<internal.Video><any>video).__stream != null)
					{
						(<internal.DisplayObject><any>video).__setRenderDirty();
					}
					break;

				default:
			}
		}
	}

	protected __render(object: IBitmapDrawable): void { }

	protected __resize(width: number, height: number): void { }
}
