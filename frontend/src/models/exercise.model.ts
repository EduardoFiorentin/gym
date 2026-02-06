class Exercise {
    public id: string = '';
    public name: string = '';
    public date: Date = new Date();

    constructor(id: string, name: string, date?: Date) {
        this.id = id
        this.name = name
        if (date) {
            this.date = date
        }
    }
}