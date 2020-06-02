import MovieClip from "../display/MovieClip";
import AssetManifest from "./AssetManifest";
import ByteArray from "./ByteArray";
import AssetBundle from "./AssetBundle";
import Future from "./Future";

export default class AssetLibrary
{
	public constructor()
	{
	}

	public static fromBundle(bundle: AssetBundle): AssetLibrary
	{
		return null;
	}

	public static fromBytes(bytes: ByteArray, rootPath: string = null): AssetLibrary
	{
		return null;
	}

	public static fromFile(path: string, rootPath: string = null): AssetLibrary
	{
		return null;
	}

	public static fromManifest(manifest: AssetManifest): AssetLibrary
	{
		return null;
	}

	public getMovieClip(id: string): MovieClip
	{
		return null;
	}

	public static loadFromBytes(bytes: ByteArray, rootPath: string = null): Future<AssetLibrary>
	{
		return Future.withValue(null) as Future<AssetLibrary>;
	}

	public static loadFromFile(path: string, rootPath: string = null): Future<AssetLibrary>
	{
		return Future.withValue(null) as Future<AssetLibrary>;
	}

	public static loadFromManifest(manifest: AssetManifest): Future<AssetLibrary>
	{
		return Future.withValue(null) as Future<AssetLibrary>;
	}

	public loadMovieClip(id: string): Future<MovieClip>
	{
		return Future.withValue(this.getMovieClip(id));
	}
}
