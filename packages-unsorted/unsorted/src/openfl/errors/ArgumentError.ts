import Error from "./Error";

export default class ArgumentError extends Error
{
	public constructor(message: string = "")
	{
		super(message);

		this.name = "ArgumentError";
	}
}
