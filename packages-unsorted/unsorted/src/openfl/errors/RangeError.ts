import Error from "./Error";

export default class RangeError extends Error
{
	public constructor(message: string = "")
	{
		super(message, 0);

		this.name = "RangeError";
	}
}
