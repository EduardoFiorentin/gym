import type { ITraining } from "../interfaces/ITraining"

export default class TrainingModel implements ITraining{
    private _id: string = ''
    private _name: string = ''
    private _createdAt: Date = new Date()
    private _updatedAt: Date = new Date()

    constructor(id: string, name: string, createdAt: Date, updatedAt: Date) {
        this._id = id
        this._name = name
        this._createdAt = createdAt
        this._updatedAt = updatedAt
    }

    static fromJSON(data: any): TrainingModel {
        return new TrainingModel(
        data._id,
        data._name,
        new Date(data._createdAt),
        new Date(data._updatedAt)
        )
    }

    /**
     * Getter $id
     * @return {string }
     */
	public get id(): string  {
		return this._id;
	}

    /**
     * Getter $name
     * @return {string }
     */
	public get name(): string  {
		return this._name;
	}

    /**
     * Getter $createdAt
     * @return {Date }
     */
	public get createdAt(): Date  {
		return this._createdAt;
	}

    /**
     * Getter $updatedAt
     * @return {Date }
     */
	public get updatedAt(): Date  {
		return this._updatedAt;
	}

    /**
     * Setter $id
     * @param {string } value
     */
	public set id(value: string ) {
		this._id = value;
	}

    /**
     * Setter $name
     * @param {string } value
     */
	public set name(value: string ) {
		this._name = value;
	}

    /**
     * Setter $createdAt
     * @param {Date } value
     */
	public set createdAt(value: Date ) {
		this._createdAt = value;
	}

    /**
     * Setter $updatedAt
     * @param {Date } value
     */
	public set updatedAt(value: Date ) {
		this._updatedAt = value;
	}
    

}