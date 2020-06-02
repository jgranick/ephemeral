import Error from "./Error";

export default class TypeError extends Error
{
	public constructor(message: string = "")
	{
		super(message, 0);

		this.name = "TypeError";
	}
}
